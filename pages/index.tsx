import { Flex, Message, Panel } from "@bigcommerce/big-design";
import { useState } from "react";
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
  //   const encodedContext = useSession()?.context;
  const { scripts, isLoading: isLoadingScripts, mutateScripts } = useScripts();
  const {
    checkoutSettings,
    isLoading: isLoadingCheckout,
    mutateCheckoutSettings,
  } = useCheckoutSettings();

  const { storeSettings, isLoading: isLoadingSettings } = useStoreSettings();

  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  if (isLoadingCheckout || isLoadingScripts || isLoadingSettings) {
    return <Loading />;
  }

  return (
    <>
      {isSuccess && (
        <Message
          header="Success!"
          messages={[
            {
              text: "Successully updated all configurations and checkout settings.",
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
      <InfoPanel
        scripts={scripts}
        checkoutSettings={checkoutSettings}
        isEnabled={storeSettings?.isEnabled || false}
        isLoading={isLoadingScripts || isLoadingCheckout || isLoadingSettings}
      />
      <Panel header="App Settings" id="panel-settings">
        <Flex>
          <SettingsForm
            settings={storeSettings}
            scripts={scripts}
            setIsSuccess={setIsSuccess}
            setErrorMessage={setErrorMessage}
          />
        </Flex>
      </Panel>
      <RescourcesBox />
    </>
  );
};

export default Index;
