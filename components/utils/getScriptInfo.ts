import { InfoMessage } from "@components/infoPanel";
import { CheckoutSettingsResponse } from "@pages/api/checkouts/settings";
import { CUSTOM_CHECKOUT_URL } from "@pages/index";

export default function getScriptInfo(
  isEnabled: boolean,
  scripts: any[]
): InfoMessage {
  const info: InfoMessage = {
    type: "error",
    message: [{ text: "Scripts couldn't be fetched." }],
  };

  const scriptIsEnabled = scripts?.length && scripts[0].enabled;
  const resaveNotice =
    "Verify all settings then save to properly setup the script.";

  if (isEnabled && scriptIsEnabled) {
    info.type = "success";
    info.message = [
      {
        text: `"Modify Shipping Methods" configuration script is enabled for checkout.`,
      },
    ];
  } else if (
    (isEnabled && !scripts?.length) ||
    (isEnabled && !scriptIsEnabled)
  ) {
    info.type = "error";
    info.message = [
      {
        text: `"Modify Shipping Methods" configuration script does not exist or is not enabled.`,
      },
      {
        text: resaveNotice,
      },
    ];
  } else if (
    (!isEnabled && !scripts?.length) ||
    (!isEnabled && !scriptIsEnabled)
  ) {
    info.type = "info";
    info.message = [
      {
        text: `"Modify Shipping Methods" configuration script is properly disabled.`,
      },
    ];
  } else if (!isEnabled && scriptIsEnabled) {
    info.type = "warning";
    info.message = [
      {
        text: `"Modify Shipping Methods" configuration script is still enabled.`,
      },
      {
        text: resaveNotice,
      },
    ];
  }

  return info;
}
