import { sendMessage } from "src/services/extension";
import { listenMessageFromPopup } from "./bgHelper";

export function listenConfirmAccountConnection({ req, res, next, end, isOpenRequestedPopup, data }) {
  listenMessageFromPopup(async (request, sender, sendResponse, resolve, reject) => {
    if (request.type === "confirm_account_connection") {
      const keysStorage = JSON.parse(localStorage.getItem("persist:keys") || "{}");
      const localSelectedAccount = JSON.parse(keysStorage.selectedAccount || null);
      res.result = localSelectedAccount ? [localSelectedAccount] : [data[0]];
      await sendMessage({ type: "close_popup" });
      isOpenRequestedPopup = false;
      return end();
    }
    if (request.type === "reject_account_connection") {
      res.result = [];
      await sendMessage({ type: "close_popup" });
      isOpenRequestedPopup = false;
      return end({ code: 4001, message: "The user rejected to connect." });
    }
  });
}
