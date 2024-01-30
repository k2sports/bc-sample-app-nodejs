import {
  Button,
  Flex,
  FormGroup,
  HR,
  MultiSelect,
  Select,
  SelectOption,
  Small,
  Form as StyledForm,
  Switch,
  Text,
} from "@bigcommerce/big-design";
import { ChangeEvent, FormEvent, useState } from "react";
import { useCustomerGroups } from "@lib/hooks";
import { FormData, StringKeyValue } from "../types";

interface FormProps {
  formData: FormData;
  onCancel(): void;
  onSubmit(form: FormData): void;
}

const FormErrors = {
  name: "Product name is required",
  price: "Default price is required",
};

const SettingsForm = ({ formData, onCancel, onSubmit }: FormProps) => {
  const { error, customerGroups } = useCustomerGroups();
  const customerGroupOptions =
    customerGroups?.length && !error
      ? customerGroups.map((group) => ({
          value: group.id,
          content: group.name,
        }))
      : [];

  const { isEnabled, hideFreeShipping } = formData;
  const [form, setForm] = useState<FormData>({
    isEnabled,
    hideFreeShipping,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name: formName, checked } = event.target || {};
    setForm((prevForm) => ({ ...prevForm, [formName]: checked }));
  };

  const handleSelectChange = (value: SelectOption<any>[]) => {
    setForm((prevForm) => ({ ...prevForm, hideFreeShipping: value }));
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
            <Text bold>Enable</Text>
          </label>
          <Switch
            id="enable-modify-shipping-methods"
            name="isEnabled"
            checked={form.isEnabled}
            onChange={handleChange}
          />
        </FormGroup>
        <Small color="secondary50">
          Enabling this will set the recommended shipping method as the only
          available shipping method in checkout. This prevents multiple shipping
          method options when a free shipping promotion is being used.
        </Small>
      </Flex>
      <HR marginVertical="xLarge" />
      <FormGroup>
        <Flex flexDirection="column" flexRowGap="8px">
          <MultiSelect
            disabled={!form.isEnabled}
            label="Hide Free Shipping"
            placeholder="Select Customer Groups"
            name="hideFreeShipping"
            options={customerGroupOptions}
            value={form.hideFreeShipping}
            onOptionsChange={handleSelectChange}
          />
          <Small as="span" color="secondary50">
            Hide free shipping method for selected customer groups.
          </Small>
        </Flex>
      </FormGroup>

      <Flex justifyContent="flex-end">
        <Button
          marginRight="medium"
          type="button"
          variant="subtle"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </Flex>
    </StyledForm>
  );
};

export default SettingsForm;
