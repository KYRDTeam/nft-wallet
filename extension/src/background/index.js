import LocalStore from "./local-store";
import browser from "webextension-polyfill";
import { createEngineStream } from "json-rpc-middleware-stream";
import PortStream from "extension-port-stream";
import pump from "pump";
import {
  getChainIdStorage,
  getCurrentPageInfo,
  getListTrustedApps,
  openPopup,
  setupMultiplex,
} from "./bgHelper";
import { DAPP_REQUEST_METHODS } from "src/config/constants/dappRequestMethods";
import {
  requestAccounts,
  switchChain,
  getChainId,
  getProviderState,
  getAccounts,
  signAndSendTx,
  personalSign,
  getBlockNumber,
  getPermittedAccounts,
} from "./jsonRpcApi";
import { nanoid } from "nanoid";
import { hexToNumber } from "web3-utils";

const JsonRpcEngine = require("json-rpc-engine");
const KeyringController = require("eth-keyring-controller");
const localStore = new LocalStore();

let keyringController = null;
let password = null;

let globalData = {
  selectedAccount: null,
  chainId: "0x1", // hex version of chainId
  networkVersion: "1", // chainId
  // Flag
  isOpenRequestedPopup: false,
  isRejectAccountOnce: false,
  isRejectSwitchChainOnce: false,
};

const connections = {};
global.connections = connections;

initialize().catch(console.error);

async function initialize() {
  const data = await localStore.get();

  keyringController = new KeyringController({
    initState: data,
  });

  global.keyringController = keyringController;
  if (password) {
    keyringController.submitPassword(password);
  }

  registerLockEvent();
  registerUnlockEvent();

  browser.runtime.onConnect.addListener(connectRemote);
}

function registerUnlockEvent() {
  keyringController.on("unlock", async () => {
    notifyAllConnections(async (origin) => {
      const pageInfo = getCurrentPageInfo(connections, origin);

      return {
        method: DAPP_REQUEST_METHODS.METAMASK_UNLOCK_STATE_CHANGED,
        params: {
          isUnlocked: true,
          params: await getPermittedAccounts(
            keyringController,
            globalData.selectedAccount,
            pageInfo
          ),
        },
      };
    });
  });
}

function registerLockEvent() {
  keyringController.on("lock", async () => {
    notifyAllConnections(async () => {
      return {
        method: DAPP_REQUEST_METHODS.METAMASK_UNLOCK_STATE_CHANGED,
        params: {
          isUnlocked: false,
        },
      };
    });
    globalData.isOpenRequestedPopup = false;
  });
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "create_new_vault") {
    keyringController.createNewVaultAndKeychain(request.password).then(() => {
      password = request.password;
      const mnemonic = keyringController.keyrings[0].mnemonic;
      sendResponse({ mnemonic: mnemonic });
    });
  }
  if (request.type === "set_password") {
    password = request.password;
    if (password) {
      keyringController.submitPassword(password);
    } else {
      keyringController.setLocked();
    }
    sendResponse(password);
  }
  if (request.type === "get_password") {
    sendResponse(password);
  }
  if (request.type === "store_vault") {
    if (request.vault) {
      localStore.set(request.vault);
      sendResponse(request.vault);
    } else {
      const vault = keyringController.store.getState();
      localStore.set(vault);
      sendResponse(vault);
    }
  }
  if (request.type === "create_new_vault_and_restore") {
    keyringController
      .createNewVaultAndRestore(request.password, request.mnemonic)
      .then((res) => {
        const vault = keyringController.store.getState();
        password = request.password;
        localStore.set(vault);
        sendResponse({ vault, isError: false });
      })
      .catch((err) => {
        sendResponse({ error: err.message, isError: true });
      });
  }
  if (request.type === "set_selected_account") {
    globalData.selectedAccount = request.selectedAccount;
    notifyAllConnections(async (origin) => {
      const pageInfo = getCurrentPageInfo(connections, origin);
      return {
        method: DAPP_REQUEST_METHODS.METAMASK_ACCOUNTS_CHANGED,
        params: await getPermittedAccounts(
          keyringController,
          globalData.selectedAccount,
          pageInfo
        ),
      };
    });
    sendResponse(globalData.selectedAccount);
  }
  if (request.type === "revoke_trusted_app") {
    if (request.address === globalData.selectedAccount) {
      let origin = "https://" + request.domain;
      notifyConnections(origin, async () => {
        return {
          method: DAPP_REQUEST_METHODS.METAMASK_ACCOUNTS_CHANGED,
          params: [],
        };
      });
    }
    sendResponse(true);
  }
  if (request.type === "set_chain_id") {
    globalData.chainId = "0x" + request.chainId.toString(16);
    globalData.networkVersion = request.chainId.toString();
    notifyAllConnections(async () => {
      return {
        method: DAPP_REQUEST_METHODS.METAMASK_CHAIN_CHANGED,
        params: {
          chainId: globalData.chainId,
          networkVersion: globalData.networkVersion,
        },
      };
    });
    sendResponse(true);
  }
  if (request.type === "close_popup_window") {
    keyringController.removeAllListeners("unlock");
    globalData.isOpenRequestedPopup = false;
    registerUnlockEvent();
  }
  if (request.type === "log") {
    console.log(request.message);
  }
  if (request.type === "get_page_info") {
    const pageInfo = getCurrentPageInfo(connections, request.url);
    sendResponse(pageInfo);
  }
  if (request.type === "set_reject_account_once") {
    globalData.isRejectAccountOnce = request.isRejected;
    sendResponse(request.isRejected);
  }
  if (request.type === "set_reject_switch_chain_once") {
    globalData.isRejectSwitchChainOnce = request.value;
    sendResponse(request.isRejectSwitchChainOnce);
  }
  if (request.type === "get_chain_id") {
    sendResponse(globalData.chainId);
  }
  return true;
});

/**
 * A runtime.Port object, as provided by the browser:
 *
 * @see https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/Port
 * @typedef Port
 * @type Object
 */

/**
 * @param {Port} remotePort - The port provided by a new context.
 */
function connectRemote(remotePort) {
  const connectionStream = new PortStream(remotePort);
  const { sender } = remotePort;
  const mux = setupMultiplex(connectionStream);
  const outStream = mux.createStream("metamask-provider");

  const engine = new JsonRpcEngine();
  const origin = new URL(sender.url).origin;

  engine.push(async (req, res, next, end) => {
    try {
      // Change global variables
      if (
        req.params &&
        req.method === DAPP_REQUEST_METHODS.METAMASK_SEND_DOMAIN_METADATA
      ) {
        const pageInfo = {
          title: req.params.name,
          domain: req.params.icon.split("/")[2],
          icon: req.params.icon,
        };
        const keyUrl = Object.keys(connections).find((url) => url === origin);
        if (!!keyUrl) {
          connections[keyUrl].page_info = pageInfo;
        }
      }
      next();
    } catch (error) {
      console.log(error);
    }
  });

  engine.push(async (req, res, next, end) => {
    try {
      if (Object.values(DAPP_REQUEST_METHODS).includes(req.method)) {
        const { isUnlocked } = keyringController.memStore.getState();
        // const listApps = getListTrustedApps(globalData.selectedAccount);
        const pageInfo = getCurrentPageInfo(connections, origin);
        const chainIdStorage = getChainIdStorage();
        // Request account
        if (
          !!pageInfo &&
          !(
            isUnlocked
            // && listApps?.find((app) => app.domain === pageInfo.domain)
          ) &&
          req.method === DAPP_REQUEST_METHODS.ETH_REQUEST_ACCOUNTS
        ) {
          if (
            !globalData.isOpenRequestedPopup &&
            !globalData.isRejectAccountOnce
          ) {
            globalData.isRejectAccountOnce = true;
            globalData.isOpenRequestedPopup = true;
            await openPopup(`method=${req.method}&origin=${origin}`, () => {
              globalData.isOpenRequestedPopup = false;
              globalData.isRejectAccountOnce = false;
            });
          }
        }

        if (
          req.method === DAPP_REQUEST_METHODS.WALLET_SWITCH_ETH_CHAIN &&
          chainIdStorage !== hexToNumber(req.params[0].chainId)
        ) {
          globalData.isOpenRequestedPopup = true;
          await openPopup(`method=${req.method}&origin=${origin}`);
        }

        if (
          [
            DAPP_REQUEST_METHODS.PERSONAL_SIGN,
            DAPP_REQUEST_METHODS.ETH_SEND_TRANSACTION,
            // DAPP_REQUEST_METHODS.WALLET_SWITCH_ETH_CHAIN,
          ].includes(req.method)
        ) {
          globalData.isOpenRequestedPopup = true;
          await openPopup(`method=${req.method}&origin=${origin}`);
        }
      }
      next();
    } catch (error) {
      globalData.isOpenRequestedPopup = false;
      console.log(error);
    }
  });

  engine.push(async (req, res, next, end) => {
    const pageInfo = getCurrentPageInfo(connections, origin);

    const params = {
      req,
      res,
      next,
      end,
      keyringController,
      selectedAccount: globalData.selectedAccount,
      chainId: globalData.chainId,
      networkVersion: globalData.networkVersion,
      isOpenRequestedPopup: globalData.isOpenRequestedPopup,
      pageInfo,
    };

    getProviderState(params);
    getAccounts(params);
    requestAccounts(params);
    switchChain(params);
    getChainId(params);
    signAndSendTx(params);
    personalSign(params);
    getBlockNumber(params);
  });

  // setup connection
  const providerStream = createEngineStream({ engine });

  const connectionId = addConnection(origin, { engine });

  pump(outStream, providerStream, outStream, (err) => {
    engine._middleware.forEach((mid) => {
      if (mid.destroy && typeof mid.destroy === "function") {
        mid.destroy();
      }
    });
    connectionId && removeConnection(origin, connectionId);
    if (err) {
      console.log(err);
    }
  });

  remotePort.onMessage.addListener((msg) => {
    console.log(msg, remotePort);
  });
}

/**
 * Adds a reference to a connection by origin. Ignores the 'metamask' origin.
 * Caller must ensure that the returned id is stored such that the reference
 * can be deleted later.
 *
 * @param {string} origin - The connection's origin string.
 * @param {Object} options - Data associated with the connection
 * @param {Object} options.engine - The connection's JSON Rpc Engine
 * @returns {string} The connection's id (so that it can be deleted later)
 */
function addConnection(origin, { engine }) {
  if (origin === "metamask") {
    return null;
  }

  if (!connections[origin]) {
    connections[origin] = {};
  }

  const id = nanoid();
  connections[origin][id] = {
    engine,
  };

  return id;
}

/**
 * Deletes a reference to a connection, by origin and id.
 * Ignores unknown origins.
 *
 * @param {string} origin - The connection's origin string.
 * @param {string} id - The connection's id, as returned from addConnection.
 */
function removeConnection(origin, id) {
  const data = connections[origin];
  if (!data) {
    return;
  }

  delete data[id];

  if (Object.keys(data).length === 0) {
    delete connections[origin];
  }
}

/**
 * Closes all connections for the given origin, and removes the references
 * to them.
 * Ignores unknown origins.
 *
 * @param {string} origin - The origin string.
 */
function removeAllConnections(origin) {
  const connections = connections[origin];
  if (!connections) {
    return;
  }

  Object.keys(connections).forEach((id) => {
    removeConnection(origin, id);
  });
}

/**
 * Causes the RPC engines associated with the connections to the given origin
 * to emit a notification event with the given payload.
 *
 * The caller is responsible for ensuring that only permitted notifications
 * are sent.
 *
 * Ignores unknown origins.
 *
 * @param {string} origin - The connection's origin string.
 * @param {unknown} payload - The event payload.
 */
function notifyConnections(origin, payload) {
  const connections = global.connections[origin];
  const getPayload =
    typeof payload === "function" ? (origin) => payload(origin) : () => payload;

  if (connections) {
    Object.values(connections).forEach(async (conn) => {
      if (conn.engine) {
        conn.engine.emit("notification", await getPayload(origin));
      }
    });
  }
}

/**
 * Causes the RPC engines associated with all connections to emit a
 * notification event with the given payload.
 *
 * If the "payload" parameter is a function, the payload for each connection
 * will be the return value of that function called with the connection's
 * origin.
 *
 * The caller is responsible for ensuring that only permitted notifications
 * are sent.
 *
 * @param {unknown} payload - The event payload, or payload getter function.
 */
export function notifyAllConnections(payload) {
  const getPayload =
    typeof payload === "function" ? (origin) => payload(origin) : () => payload;

  Object.keys(connections).forEach((origin) => {
    Object.values(connections[origin]).forEach(async (conn) => {
      if (conn.engine) {
        conn.engine.emit("notification", await getPayload(origin));
      }
    });
  });
}
