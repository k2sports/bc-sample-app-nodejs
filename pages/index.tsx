import { Flex, Message, Panel } from "@bigcommerce/big-design";
import { useState } from "react";
import InfoPanel from "@components/infoPanel";
import Loading from "@components/loading";
import RescourcesBox from "@components/resourcesBox";
import SettingsForm from "@components/settingsForm";
import { useSession } from "context/session";
import {
  useCheckoutSettings,
  useScripts,
  useStoreSettings,
} from "../lib/hooks";
import { FormData } from "../types";

export const CUSTOM_CHECKOUT_URL = "http://127.0.0.1:8080/auto-loader-dev.js";

const Index = () => {
  const encodedContext = useSession()?.context;
  const { scripts, isLoading: isLoadingScripts, mutateScripts } = useScripts();
  const {
    checkoutSettings,
    isLoading: isLoadingCheckout,
    mutateCheckoutSettings,
  } = useCheckoutSettings();

  const { storeSettings } = useStoreSettings();
  console.log("useStoreSettings", storeSettings);

  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const formData: FormData = {
    isEnabled: storeSettings?.isEnabled || false,
    hideFreeShippingGroups: storeSettings?.hideFreeShippingGroups || [],
    showRecommendedMethod: storeSettings?.showRecommendedMethod || false,
  };

  const handleCancel = () => {
    console.log("Handling Canceling...");
  };

  const handleSubmit = async (data: FormData) => {
    console.log("Handling Submitting...", data);
    setIsSuccess(false);
    setErrorMessage(undefined);
    setIsSubmitting(true);

    let customerGroupIds = "";
    if (data?.hideFreeShippingGroups?.length) {
      customerGroupIds = `customerGroupIds: [${data.hideFreeShippingGroups}],`;
    }

    const script = `<script>
        function modifyShippingMethods() {
            if(window?.checkoutConfig) {
                window.checkoutConfig.hideShippingMethods = {
                    isEnabled: ${data.isEnabled},
                    showRecommendedMethod: ${data.showRecommendedMethod},
                    ${customerGroupIds}
                };
            }
        };
        window.onload = modifyShippingMethods; 
        console.log('hello!');
    </script>`;

    try {
      const resp = await fetch(
        `/api/store_settings?context=${encodedContext}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            isEnabled: data.isEnabled,
            showRecommendedMethod: data.showRecommendedMethod,
            hideFreeShippingGroups: `${data.hideFreeShippingGroups}`,
          }),
        }
      );

      console.log("updating db!", resp);

      //   if (scripts?.length) {
      //     console.log("updating!");
      //     const scriptId = scripts[0].uuid;
      //     const resp = await fetch(
      //       `/api/scripts/${scriptId}?context=${encodedContext}`,
      //       {
      //         method: "PUT",
      //         headers: { "Content-Type": "application/json" },
      //         body: JSON.stringify({
      //           html: script,
      //           enabled: data.isEnabled,
      //         }),
      //       }
      //     );
      //   } else {
      //     console.log("making a new one!");
      //     await fetch(`/api/scripts?context=${encodedContext}`, {
      //       method: "POST",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify({
      //         name: "Modify Shipping Methods",
      //         description: "Do things.",
      //         html: script,
      //         auto_uninstall: true,
      //         load_method: "default",
      //         location: "footer",
      //         visibility: "checkout",
      //         kind: "script_tag",
      //         consent_category: "functional",
      //         enabled: true,
      //       }),
      //     });
      //   }

      //   // Enable or Disable custom checkout
      //   await fetch(`/api/checkouts/settings?context=${encodedContext}`, {
      //     method: "PUT",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       custom_checkout_script_url: data.isEnabled ? CUSTOM_CHECKOUT_URL : "",
      //       order_confirmation_use_custom_checkout_script: false,
      //       custom_order_confirmation_script_url: "",
      //       custom_checkout_supports_uco_settings: true,
      //     }),
      //   });

      //   // Refetch to validate local data
      //   mutateScripts();
      //   mutateCheckoutSettings();

      // TODO: Save configuration to database

      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      setErrorMessage(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSuccess && (
        <Message
          header="You Nailed It!"
          messages={[
            {
              text: "Successully updated.",
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
              text: `Something went wrong. Please try again. ${errorMessage}`,
            },
          ]}
          onClose={() => setErrorMessage(undefined)}
          marginBottom="large"
        />
      )}
      <Panel header="App Settings" id="panel-settings">
        <Flex>
          <SettingsForm
            formData={formData}
            isLoading={isSubmitting}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        </Flex>
      </Panel>
      <InfoPanel
        scripts={scripts}
        checkoutSettings={checkoutSettings}
        isEnabled={formData.isEnabled}
        isLoading={isLoadingScripts || isLoadingCheckout}
      />
      <RescourcesBox />
    </>
  );
};

export default Index;
