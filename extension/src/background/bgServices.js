import { sendMessage } from "src/services/extension";
import { listenMessageFromPopup } from "./bgHelper";

export function listenConfirmAccountConnection({
  req,
  res,
  next,
  end,
  isOpenRequestedPopup,
  data,
}) {
  listenMessageFromPopup(
    async (request, sender, sendResponse, resolve, reject) => {
      if (request.type === "confirm_account_connection") {
        const keysStorage = JSON.parse(
          localStorage.getItem("persist:keys") || "{}"
        );
        const accountsTBA = JSON.parse(keysStorage.accountsTBA || "[]");
        const localSelectedAccount =
          JSON.parse(keysStorage.selectedAccount || null) ?? data[0];
        const enabledTBA = (accountsTBA?.[localSelectedAccount] || []).find(
          (item) => item?.isEnabled
        );
        console.log(keysStorage, accountsTBA, localSelectedAccount, enabledTBA);
        res.result = !!enabledTBA
          ? [enabledTBA.address]
          : [localSelectedAccount];
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
    }
  );
}
