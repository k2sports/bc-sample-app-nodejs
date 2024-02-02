import { InlineMessage, Panel, Small } from "@bigcommerce/big-design";
import { MessagingType } from "@bigcommerce/big-design/dist/utils";
import { CheckoutSettingsResponse } from "@pages/api/checkouts/settings";
import { CUSTOM_CHECKOUT_URL } from "@pages/index";
import Loading from "./loading";

interface PanelProps {
  scripts: any[];
  checkoutSettings: CheckoutSettingsResponse;
  isEnabled: boolean;
  isLoading?: boolean;
}

interface InfoMessage {
  type: MessagingType;
  message: string;
}

const InfoPanel = ({
  scripts,
  checkoutSettings,
  isEnabled,
  isLoading = false,
}: PanelProps) => {
  console.log("Info Panel", { scripts, checkoutSettings });

  const customCheckoutStatusInfo: InfoMessage = {
    type: "error",
    message: "Custom checkout setting couldn't be fetched.",
  };

  if (isLoading) {
    return <Loading />;
  }

  if (checkoutSettings) {
    if (isEnabled && checkoutSettings.custom_checkout_script_url === "") {
      customCheckoutStatusInfo.type = "error";
      customCheckoutStatusInfo.message =
        "Custom checkout is disabled! Try saving the settings to enable custom checkout.";
    } else if (
      isEnabled &&
      checkoutSettings.custom_checkout_script_url !== CUSTOM_CHECKOUT_URL
    ) {
      customCheckoutStatusInfo.type = "error";
      customCheckoutStatusInfo.message =
        "Custom checkout is using the wrong checkout script url. Please verify your store's checkout settings then try saving the app settings to enable custom checkout correctly.";
    } else if (
      !isEnabled &&
      checkoutSettings.custom_checkout_script_url === ""
    ) {
      customCheckoutStatusInfo.type = "info";
      customCheckoutStatusInfo.message = "Custom checkout is disabled.";
    } else if (
      !isEnabled &&
      checkoutSettings.custom_checkout_script_url !== CUSTOM_CHECKOUT_URL
    ) {
      customCheckoutStatusInfo.type = "warning";
      customCheckoutStatusInfo.message =
        "Custom checkout is using a different checkout script. Please verify your store's checkout settings before enabling this app.";
    } else {
      customCheckoutStatusInfo.type = "success";
      customCheckoutStatusInfo.message =
        "Custom checkout is enabled and configured correctly.";
    }
  }

  return (
    <Panel header="App Info" id="panel-info">
      <Small>
        Custom Checkout Script URL: <code>{CUSTOM_CHECKOUT_URL}</code>
      </Small>
      <InlineMessage
        header="Script"
        marginVertical="medium"
        messages={[
          {
            text: `"Modify Shipping Methods" configuration script is enabled for checkout.`,
          },
        ]}
        type="success"
      />
      <InlineMessage
        header="Custom Checkout Script"
        marginVertical="medium"
        messages={[
          {
            text: customCheckoutStatusInfo.message,
          },
        ]}
        type={customCheckoutStatusInfo.type}
      />
    </Panel>
  );
};

export default InfoPanel;
