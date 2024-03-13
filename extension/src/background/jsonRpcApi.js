import { sendMessage } from "src/services/extension";
import { DAPP_REQUEST_METHODS } from "src/config/constants/dappRequestMethods";
import { listenConfirmAccountConnection } from "./bgServices";
import { getWeb3BlockNumber } from "src/utils/web3";
import { hexToNumber, numberToHex } from "web3-utils";
import browser from "webextension-polyfill";
import { getListTrustedApps } from "./bgHelper";
import { notifyAllConnections } from "./index";

const unlockPopup = ({ res, end, keyringController, isOpenRequestedPopup, selectedAccount, pageInfo }) => {
  const cb = async () => {
    res.result = await getPermittedAccounts(keyringController, selectedAccount, pageInfo);
    end();
    if (isOpenRequestedPopup) {
      await sendMessage({ type: "close_popup" });
    }
    keyringController.removeListener("unlock", cb);
  };
  keyringController.on("unlock", cb);
};

export async function requestAccounts({
  req,
  res,
  next,
  end,
  keyringController,
  isOpenRequestedPopup,
  selectedAccount,
  pageInfo,
}) {
  if (req.method === DAPP_REQUEST_METHODS.ETH_REQUEST_ACCOUNTS) {
    const { isUnlocked } = keyringController.memStore.getState();
    let data = [];
    let rootStorage = {};
    let trustedApps = {};
    let listApps = [];
    const promise = new Promise(async (resolve, reject) => {
      if (isUnlocked) {
        resolve();
      } else {
        const cb = async () => {
          resolve();

          keyringController.removeListener("unlock", cb);
        };
        keyringController.on("unlock", cb);
      }
    });
    promise
      .then(async () => {
        data = await keyringController.getAccounts();
        rootStorage = JSON.parse(localStorage.getItem("persist:root") || "{}");
        trustedApps = JSON.parse(rootStorage.trustedApps || "{}").trustedApps;
        listApps = trustedApps[selectedAccount ? selectedAccount : data[0]];
      })
      .then(async () => {
        if (pageInfo && listApps && listApps.find((app) => app.domain === pageInfo.domain)) {
          res.result = await getPermittedAccounts(keyringController, selectedAccount, pageInfo);
          if (isOpenRequestedPopup) {
            await sendMessage({ type: "close_popup" });
          }
          isOpenRequestedPopup = false;
          return end();
        } else {
          listenConfirmAccountConnection({
            req,
            res,
            next,
            end,
            isOpenRequestedPopup,
            data,
          });
        }
      });
  }
}

export async function getAccounts({
  req,
  res,
  next,
  end,
  keyringController,
  isOpenRequestedPopup,
  selectedAccount,
  pageInfo,
}) {
  if (req.method === DAPP_REQUEST_METHODS.ETH_ACCOUNTS) {
    res.result = await getPermittedAccounts(keyringController, selectedAccount, pageInfo);
    if (isOpenRequestedPopup) {
      await sendMessage({ type: "close_popup" });
    }
    return end();
  }
}

export async function signAndSendTx({
  req,
  res,
  next,
  end,
  keyringController,
  isOpenRequestedPopup,
  selectedAccount,
  pageInfo,
}) {
  if (req.method === DAPP_REQUEST_METHODS.ETH_SEND_TRANSACTION) {
    const { isUnlocked } = keyringController.memStore.getState();
    if (isUnlocked) {
      await browser.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
        if (request.type === "is_loaded_popup") {
          sendResponse(true);
          await sendMessage({ type: "get_data_tx", data: req.params[0] });
        }
        if (request.type === "send_tx_hash") {
          sendResponse(true);
          res.result = request.hash;
          end();
        }
        if (request.type === "reject_tx") {
          sendResponse(true);
          res.result = "";
          end(new Error("Krystal Wallet Tx Signature: User denied transaction signature."));
        }
      });
    } else {
      unlockPopup({
        res,
        end,
        keyringController,
        isOpenRequestedPopup,
        selectedAccount,
        pageInfo,
      });
    }
  }
}

export async function personalSign({
  req,
  res,
  next,
  end,
  keyringController,
  isOpenRequestedPopup,
  selectedAccount,
  pageInfo,
}) {
  if (req.method === DAPP_REQUEST_METHODS.PERSONAL_SIGN) {
    const { isUnlocked } = keyringController.memStore.getState();
    if (isUnlocked) {
      await browser.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
        if (request.type === "is_loaded_popup") {
          sendResponse(true);
          await sendMessage({
            type: "get_data_sign",
            data: { tx: req.params[0], address: req.params[1], opts: req.params[2] },
          });
        }
        if (request.type === "send_tx_hash") {
          sendResponse(true);
          res.result = request.hash;
          end();
        }
        if (request.type === "reject_tx") {
          sendResponse(true);
          res.result = "";
          end(new Error("Krystal Wallet Tx Signature: User denied transaction signature."));
        }
      });
    } else {
      unlockPopup({
        res,
        end,
        keyringController,
        isOpenRequestedPopup,
        selectedAccount,
        pageInfo,
      });
    }
  }
}

export async function getProviderState({
  req,
  res,
  next,
  end,
  keyringController,
  selectedAccount,
  chainId,
  networkVersion,
  pageInfo,
}) {
  if (req.method === DAPP_REQUEST_METHODS.METAMASK_GET_PROVIDER_STATE) {
    const { isUnlocked } = keyringController.memStore.getState();
    const accounts = await getPermittedAccounts(keyringController, selectedAccount, pageInfo);
    res.result = {
      accounts,
      chainId,
      isUnlocked,
      networkVersion,
    };
    end();
  }
}

// TO DO
export async function switchChain({
  req,
  res,
  next,
  end,
  keyringController,
  isOpenRequestedPopup,
  selectedAccount,
  pageInfo,
}) {
  if (req.method === "wallet_switchEthereumChain") {
    const { isUnlocked } = keyringController.memStore.getState();
    if (isUnlocked) {
      await browser.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
        if (request.type === "is_loaded_popup") {
          sendResponse(true);
          await sendMessage({ type: "get_chain_id", chainId: req.params[0].chainId });
        }
        if (request.type === "confirm_switch_chain") {
          sendResponse(true);
          let chainId = "0x" + request.chainId.toString(16);
          let networkVersion = request.chainId.toString();
          notifyAllConnections(async () => {
            return {
              method: "metamask_chainChanged",
              params: { chainId, networkVersion },
            };
          });
          res.result = null;
          end();
        }
        if (request.type === "reject_switch_chain") {
          sendResponse(true);
          res.result = null;
          end(new Error("Krystal Wallet: User denied switch chain."));
        }
      });
    } else {
      unlockPopup({
        res,
        end,
        keyringController,
        isOpenRequestedPopup,
        selectedAccount,
        pageInfo,
      });
    }
  }
}

export async function getChainId({ req, res, next, end, chainId }) {
  if (req.method === DAPP_REQUEST_METHODS.ETH_CHAINID) {
    res.result = chainId;
    end();
  }
}

export async function getPermittedAccounts(keyringController, selectedAccount, pageInfo) {
  const { isUnlocked } = keyringController.memStore.getState();
  const data = await keyringController.getAccounts();
  const listApps = getListTrustedApps(selectedAccount);
  return isUnlocked && listApps?.find((app) => app.domain === pageInfo.domain)
    ? selectedAccount
      ? [selectedAccount]
      : [data[0]]
    : [];
}

export async function getBlockNumber({ req, res, next, end, chainId }) {
  if (req.method === DAPP_REQUEST_METHODS.ETH_BLOCK_NUMBER) {
    const blockNumber = await getWeb3BlockNumber(hexToNumber(chainId));
    res.result = numberToHex(blockNumber);
    end();
  }
}
