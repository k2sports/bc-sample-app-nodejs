import {
  Button,
  Flex,
  FormGroup,
  HR,
  MultiSelect,
  SelectOption,
  Small,
  Form as StyledForm,
  Switch,
  Text,
} from "@bigcommerce/big-design";
import { ChangeEvent, FormEvent, useState } from "react";
import { useCustomerGroups } from "@lib/hooks";
import { CUSTOM_CHECKOUT_URL } from "@pages/index";
import { useSession } from "context/session";
import { FormData, StoreSettings } from "../types";

interface FormProps {
  settings: StoreSettings;
  scripts: any;
  setIsSuccess(isSuccess: boolean): void;
  setErrorMessage(errorMessage: string | undefined): void;
  refreshData(): void;
}

const FormErrors = {
  name: "Product name is required",
  price: "Default price is required",
};

const SettingsForm = ({
  settings,
  scripts,
  setIsSuccess,
  setErrorMessage,
  refreshData,
}: FormProps) => {
  console.log("SettingsForm", { settings, scripts });
  const encodedContext = useSession()?.context;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { error, customerGroups } = useCustomerGroups();
  const customerGroupOptions =
    customerGroups?.length && !error
      ? customerGroups.map((group) => ({
          value: group.id,
          content: group.name,
        }))
      : [];

  const hideFreeShippingGroupsArr =
    settings?.hideFreeShippingGroups
      ?.split(",")
      ?.map((group) => Number(group)) || [];

  const [form, setForm] = useState<FormData>({
    isEnabled: settings?.isEnabled === 1 || false,
    hideFreeShippingGroups: hideFreeShippingGroupsArr,
    showRecommendedMethod: settings?.showRecommendedMethod === 1 || false,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name: formName, checked } = event.target || {};
    setForm((prevForm) => ({ ...prevForm, [formName]: checked }));
  };

  const handleSelectChange = (value: SelectOption<any>[]) => {
    setForm((prevForm) => ({ ...prevForm, hideFreeShippingGroups: value }));
  };

  const handleCancel = () => {
    console.log("Handling Canceling...");
  };

  const handleSubmit = async (event: FormEvent<EventTarget>) => {
    event.preventDefault();

    // If there are errors, do not submit the form
    // const hasErrors = Object.keys(errors).length > 0;
    // if (hasErrors) return;

    const data = form;
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

      if (scripts?.length) {
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

      // Enable or Disable custom checkout
      await fetch(`/api/checkouts/settings?context=${encodedContext}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          custom_checkout_script_url: data.isEnabled ? CUSTOM_CHECKOUT_URL : "",
          order_confirmation_use_custom_checkout_script: false,
          custom_order_confirmation_script_url: "",
          custom_checkout_supports_uco_settings: true,
        }),
      });

      // Refetch to validate local data
      refreshData();

      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      setErrorMessage(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <Flex flexDirection="column">
        <FormGroup>
          <label htmlFor="enable-modify-shipping-methods">
            <Text bold>Enable App</Text>
          </label>
          <Switch
            id="enable-modify-shipping-methods"
            name="isEnabled"
            checked={form.isEnabled}
            onChange={handleChange}
          />
        </FormGroup>

        <Small color="secondary50">
          Enabling adds a script for injecting configuration on checkout and
          sets &quot;Custom Checkout&quot; script url. Disabling will disable
          the script and reset checkout type to &quot;Optimized One-Page
          Checkout&quot;.
        </Small>
      </Flex>
      <HR marginVertical="xxLarge" />
      <Flex flexDirection="column" marginBottom="xLarge">
        <FormGroup>
          <label htmlFor="show-recommended-method">
            <Text bold>Only Show Recommended</Text>
          </label>
          <Switch
            id="show-recommended-method"
            name="showRecommendedMethod"
            checked={form.showRecommendedMethod}
            onChange={handleChange}
            disabled={!form.isEnabled}
          />
        </FormGroup>
        <Small color="secondary50">
          Set the recommended shipping method as the only available shipping
          method in checkout. This prevents multiple shipping method options
          when a free shipping promotion is being used.
        </Small>
      </Flex>
      <FormGroup>
        <Flex flexDirection="column" flexRowGap="8px">
          <MultiSelect
            disabled={!form.isEnabled}
            label="Hide Free Shipping"
            placeholder="Select Customer Groups"
            name="hideFreeShippingGroups"
            options={customerGroupOptions}
            value={form.hideFreeShippingGroups}
            onOptionsChange={handleSelectChange}
            filterable
          />
          <Small as="span" color="secondary50">
            Hide free shipping method for selected customer groups. Still allows
            free shipping promotions.
          </Small>
        </Flex>
      </FormGroup>

      <Flex justifyContent="flex-end">
        <Button
          disabled
          marginRight="medium"
          type="button"
          variant="subtle"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Save
        </Button>
      </Flex>
    </StyledForm>
  );
};

export default SettingsForm;
