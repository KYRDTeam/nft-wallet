// If your extension doesn't need a content script, just leave this file empty

// This is an example of a script that will run on every page. This can alter pages
// Don't forget to change `matches` in manifest.json if you want to only change specific webpages

// This needs to be an export due to typescript implementation limitation of needing '--isolatedModules' tsconfig

import browser from "webextension-polyfill";
import { WindowPostMessageStream } from "@metamask/post-message-stream";
import PortStream from "extension-port-stream";
import pump from "pump";
import ObjectMultiplex from "obj-multiplex";

const CONTENT_SCRIPT = "krystal-contentscript";
const PROVIDER = "metamask-provider";
const INPAGE = "krystal-inpage";

export function injectScript(file_path, tag) {
  console.log("inject");
  const container = document.head || document.documentElement;
  const scriptTag = document.createElement("script");
  scriptTag.setAttribute("async", "false");
  scriptTag.setAttribute("type", "text/javascript");
  scriptTag.setAttribute("src", file_path);
  container.insertBefore(scriptTag, container.children[0]);
  container.removeChild(scriptTag);

  // var node = document.getElementsByTagName(tag)[0];
  // var script = document.createElement("script");
  // script.setAttribute("type", "text/javascript");
  // script.setAttribute("src", file_path);
  // node.appendChild(script);
}
/**
 * Sets up two-way communication streams between the
 * browser extension and local per-page browser context.
 *
 */

function forwardTrafficBetweenMuxes(channelName, muxA, muxB) {
  const channelA = muxA.createStream(channelName);
  const channelB = muxB.createStream(channelName);
  pump(channelA, channelB, channelA, (error) =>
    console.debug(`MetaMask: Muxed traffic for channel "${channelName}" failed.`, error),
  );
}

async function setupStreams() {
  // the transport-specific streams for communication between inpage and background
  const pageStream = new WindowPostMessageStream({
    name: CONTENT_SCRIPT,
    target: INPAGE,
  });

  const extensionPort = browser.runtime.connect({ name: CONTENT_SCRIPT });
  const extensionStream = new PortStream(extensionPort);

  const pageMux = new ObjectMultiplex();
  pageMux.setMaxListeners(25);
  const extensionMux = new ObjectMultiplex();
  extensionMux.setMaxListeners(25);

  pump(pageMux, pageStream, pageMux, (err) => console.log(err));

  pump(extensionMux, extensionStream, extensionMux, (err) => {
    console.log(err);
  });

  forwardTrafficBetweenMuxes(PROVIDER, pageMux, extensionMux);

  extensionStream.on("data", (data) => {
    console.log(data.data)
  });

  // window.addEventListener("message",function (event) {
  //     extensionPort.postMessage(event);
  //   },false,
  // );
}

injectScript(global.chrome.extension.getURL("inpage.js"), "body");
setupStreams();
