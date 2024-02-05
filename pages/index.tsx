import { Flex, Message, Panel, Small } from "@bigcommerce/big-design";
import { useState } from "react";
import ErrorMessage from "@components/error";
import InfoPanel from "@components/infoPanel";
import Loading from "@components/loading";
import RescourcesBox from "@components/resourcesBox";
import SettingsForm from "@components/settingsForm";
import {
  useCheckoutSettings,
  useScripts,
  useStoreSettings,
} from "../lib/hooks";

export const CUSTOM_CHECKOUT_URL = "http://127.0.0.1:8080/auto-loader-dev.js";

const Index = () => {
  console.log(process.env);
  const {
    scripts,
    error: hasScriptError,
    isLoading: isLoadingScripts,
    mutateScripts,
  } = useScripts();

  const {
    checkoutSettings,
    error: hasCheckoutError,
    isLoading: isLoadingCheckout,
    mutateCheckoutSettings,
  } = useCheckoutSettings();

  const {
    storeSettings,
    error: hasSettingsError,
    isLoading: isLoadingSettings,
    mutateStoreSettings,
  } = useStoreSettings();

  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  if (isLoadingCheckout || isLoadingScripts || isLoadingSettings) {
    return <Loading />;
  }

  if (hasScriptError || hasCheckoutError || hasSettingsError) {
    return (
      <ErrorMessage
        error={hasScriptError || hasCheckoutError || hasSettingsError}
        renderPanel={false}
      />
    );
  }

  const refreshData = () => {
    mutateCheckoutSettings();
    mutateScripts();
    mutateStoreSettings();
  };

  return (
    <>
      {isSuccess && (
        <Message
          header="Success!"
          messages={[
            {
              text: "All configurations and checkout settings have been updated.",
            },
          ]}
          onClose={() => setIsSuccess(false)}
          marginBottom="large"
        />
      )}
      {errorMessage && (
        <Message
          header="Oh no!"
          type="error"
          messages={[
            {
              text: `Something went wrong. Please try again.\n${errorMessage}`,
            },
          ]}
          onClose={() => setErrorMessage(undefined)}
          marginBottom="large"
        />
      )}
      <Panel header="App Settings" id="panel-settings">
        <Flex>
          <SettingsForm
            settings={storeSettings}
            scripts={scripts}
            setIsSuccess={setIsSuccess}
            setErrorMessage={setErrorMessage}
            refreshData={refreshData}
          />
        </Flex>
      </Panel>
      <InfoPanel
        scripts={scripts}
        checkoutSettings={checkoutSettings}
        isEnabled={storeSettings?.isEnabled || false}
        isLoading={isLoadingScripts || isLoadingCheckout || isLoadingSettings}
      />
      <RescourcesBox />
      <Small marginTop="medium">Manage Shipping Methods v0.0.1-beta</Small>
    </>
  );
};

export default Index;
