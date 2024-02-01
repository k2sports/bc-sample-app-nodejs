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
import { FormData } from "../types";

interface FormProps {
  formData: FormData;
  isLoading: boolean;
  onCancel(): void;
  onSubmit(form: FormData): void;
}

const FormErrors = {
  name: "Product name is required",
  price: "Default price is required",
};

const SettingsForm = ({
  formData,
  isLoading,
  onCancel,
  onSubmit,
}: FormProps) => {
  const { error, customerGroups } = useCustomerGroups();
  const customerGroupOptions =
    customerGroups?.length && !error
      ? customerGroups.map((group) => ({
          value: group.id,
          content: group.name,
        }))
      : [];

  const { isEnabled, hideFreeShippingGroups, showRecommendedMethod } = formData;
  const [form, setForm] = useState<FormData>({
    isEnabled,
    hideFreeShippingGroups,
    showRecommendedMethod,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name: formName, checked } = event.target || {};
    setForm((prevForm) => ({ ...prevForm, [formName]: checked }));
  };

  const handleSelectChange = (value: SelectOption<any>[]) => {
    setForm((prevForm) => ({ ...prevForm, hideFreeShippingGroups: value }));
  };

  const handleSubmit = (event: FormEvent<EventTarget>) => {
    event.preventDefault();

    // If there are errors, do not submit the form
    // const hasErrors = Object.keys(errors).length > 0;
    // if (hasErrors) return;

    onSubmit(form);
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
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Update
        </Button>
      </Flex>
    </StyledForm>
  );
};

export default SettingsForm;
