import { Flex, Panel } from "@bigcommerce/big-design";
import SettingsForm from "@components/settingsForm";
import { useScripts } from "../lib/hooks";

const Index = () => {
  const { error, isLoading, scripts } = useScripts();

  console.log("scripts", scripts);

  const formData = { isEnabled: false, hideFreeShipping: [] };

  const handleCancel = () => {
    console.log("Handling Canceling...");
  };

  const handleSubmit = async (data: FormData) => {
    console.log("Handling Submitting...", data);

    await fetch(`/api/scripts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Bootstrap",
        description: "Build responsive websites",
        html: "",
        auto_uninstall: true,
        load_method: "default",
        location: "footer",
        visibility: "checkout",
        kind: "script_tag",
        consent_category: "functional",
        enabled: false,
      }),
    });
  };

  return (
    <Panel header="Settings" id="home">
      <Flex>
        <SettingsForm
          formData={formData}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </Flex>
    </Panel>
  );
};

export default Index;
