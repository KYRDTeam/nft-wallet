import { initializeProvider } from "@metamask/providers";
import { WindowPostMessageStream } from "@metamask/post-message-stream";

const krystalStream = new WindowPostMessageStream({
  name: "krystal-inpage",
  target: "krystal-contentscript",
});

initializeProvider({
  connectionStream: krystalStream,
  shouldShimWeb3: true,
});

const { ethereum } = window;
ethereum.isKrystalWallet = true;
// ethereum.isMetaMask = false;

ethereum.on("accountsChanged", () => {
  console.log("pl");
});
