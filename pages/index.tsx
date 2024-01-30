import { Flex, Message, Panel } from "@bigcommerce/big-design";
import { useState } from "react";
import SettingsForm from "@components/settingsForm";
import { useSession } from "context/session";
import { useScripts } from "../lib/hooks";
import { FormData } from "../types";

const Index = () => {
  const encodedContext = useSession()?.context;
  const { error, isLoading, scripts } = useScripts();

  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  console.log("scripts", scripts);

  const formData: FormData = {
    isEnabled: false,
    hideFreeShipping: [],
    showRecommendedMethod: false,
  };

  const handleCancel = () => {
    console.log("Handling Canceling...");
  };

  const handleSubmit = async (data: FormData) => {
    console.log("Handling Submitting...", data);
    setIsSuccess(false);
    setIsSubmitting(true);

    let customerGroupId = "";
    if (data?.hideFreeShipping?.length) {
      customerGroupId = `customerGroupId: ${data.hideFreeShipping[0]},`;
    }

    const script = `<script>
        function modifyShippingMethods() {
            if(window?.checkoutConfig) {
                window.checkoutConfig.hideShippingMethods = {
                    isEnabled: ${data.isEnabled},
                    showRecommendedMethod: ${data.showRecommendedMethod},
                    ${customerGroupId}
                };
            }
        };
        window.onload = modifyShippingMethods; 
        console.log('hello!');
    </script>`;
    console.log(script);

    try {
      if (scripts?.length) {
        console.log("updating!");
        const scriptId = scripts[0].uuid;
        await fetch(`/api/scripts/${scriptId}?context=${encodedContext}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            html: script,
            enabled: data.isEnabled,
          }),
        });
      } else {
        console.log("making a new one!");
        await fetch(`/api/scripts?context=${encodedContext}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Modify Shipping Methods",
            description: "Do things.",
            html: script,
            auto_uninstall: true,
            load_method: "default",
            location: "footer",
            visibility: "checkout",
            kind: "script_tag",
            consent_category: "functional",
            enabled: true,
          }),
        });
      }
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      setIsSuccess(false);
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
      <Panel header="Settings" id="home">
        <Flex>
          <SettingsForm
            formData={formData}
            isLoading={isSubmitting}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        </Flex>
      </Panel>
    </>
  );
};

export default Index;
