import { InfoMessage } from "@components/infoPanel";
import { CheckoutSettingsResponse } from "@pages/api/checkouts/settings";
import { CUSTOM_CHECKOUT_URL } from "@pages/index";

export default function getCheckoutInfo(
  isEnabled: boolean,
  checkoutSettings: CheckoutSettingsResponse
): InfoMessage {
  const info: InfoMessage = {
    type: "error",
    message: [{ text: "Custom checkout setting couldn't be fetched." }],
  };

  if (!checkoutSettings) {
    return info;
  }

  const currentCheckoutUrl = checkoutSettings.custom_checkout_script_url;
  const resaveNotice =
    "Please verify your store's checkout settings and app settings then save to correctly configure custom checkout.";

  if (isEnabled && currentCheckoutUrl === "") {
    info.type = "error";
    info.message = [
      {
        text: "Custom checkout is disabled! ",
      },
      {
        text: resaveNotice,
      },
    ];
  } else if (isEnabled && currentCheckoutUrl !== CUSTOM_CHECKOUT_URL) {
    info.type = "error";
    info.message = [
      {
        text: "Custom checkout is using the wrong checkout script url.",
      },
      {
        text: resaveNotice,
      },
    ];
  } else if (!isEnabled && currentCheckoutUrl === "") {
    info.type = "info";
    info.message = [{ text: "Custom checkout is properly disabled." }];
  } else if (!isEnabled && currentCheckoutUrl !== CUSTOM_CHECKOUT_URL) {
    info.type = "warning";
    info.message = [
      {
        text: "Custom checkout is using a different checkout script.",
      },
      {
        text: "Please verify your store's checkout settings before enabling this app.",
      },
    ];
  } else if (!isEnabled && currentCheckoutUrl === CUSTOM_CHECKOUT_URL) {
    info.type = "warning";
    info.message = [
      {
        text: "Custom checkout is enabled even though app is disabled.",
      },
      {
        text: resaveNotice,
      },
    ];
  } else {
    info.type = "success";
    info.message = [
      { text: "Custom checkout is enabled and configured correctly." },
    ];
  }

  return info;
}
