import { InlineMessage, Panel, Small } from "@bigcommerce/big-design";
import { MessagingType } from "@bigcommerce/big-design/dist/utils";
import { CheckoutSettingsResponse } from "@pages/api/checkouts/settings";
import { CUSTOM_CHECKOUT_URL } from "@pages/index";
import Loading from "./loading";
import getCheckoutInfo from "./utils/getCheckoutInfo";
import getScriptInfo from "./utils/getScriptInfo";

interface PanelProps {
  scripts: any[];
  checkoutSettings: CheckoutSettingsResponse;
  isEnabled: boolean;
  isLoading?: boolean;
}

interface MessageObject {
  text: string;
}

export interface InfoMessage {
  type: MessagingType;
  message: MessageObject[];
}

const InfoPanel = ({
  scripts,
  checkoutSettings,
  isEnabled,
  isLoading = false,
}: PanelProps) => {
  console.log("Info Panel", {
    scripts,
    checkoutSettings,
    isEnabled,
    isLoading,
  });

  if (isLoading) {
    return <Loading />;
  }

  const customCheckoutStatusInfo: InfoMessage = getCheckoutInfo(
    isEnabled,
    checkoutSettings
  );
  const checkoutScriptStatusInfo: InfoMessage = getScriptInfo(
    isEnabled,
    scripts
  );

  return (
    <Panel header="App Info" id="panel-info">
      <Small>
        Custom Checkout Script URL: <code>{CUSTOM_CHECKOUT_URL}</code>
      </Small>
      <InlineMessage
        header="Script"
        marginVertical="medium"
        messages={checkoutScriptStatusInfo.message}
        type={checkoutScriptStatusInfo.type}
      />
      <InlineMessage
        header="Custom Checkout Script"
        marginVertical="medium"
        messages={customCheckoutStatusInfo.message}
        type={customCheckoutStatusInfo.type}
      />
    </Panel>
  );
};

export default InfoPanel;
