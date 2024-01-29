import {
  Button,
  Checkbox,
  Flex,
  FormGroup,
  HR,
  Input,
  Panel,
  Select,
  Small,
  Form as StyledForm,
  Switch,
  Text,
  Textarea,
} from "@bigcommerce/big-design";
import { ChangeEvent, FormEvent, useState } from "react";
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
  const { description, isVisible, name, price, type } = formData;
  const [form, setForm] = useState<FormData>({
    description,
    isVisible,
    name,
    price,
    type,
  });
  const [errors, setErrors] = useState<StringKeyValue>({});

  const [isEnabled, setIsEnabled] = useState(false);
  const handleSwitchChange = () => setIsEnabled(!isEnabled);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name: formName, value } = event.target || {};
    setForm((prevForm) => ({ ...prevForm, [formName]: value }));

    // Add error if it exists in FormErrors and the input is empty, otherwise remove from errors
    !value && FormErrors[formName]
      ? setErrors((prevErrors) => ({
          ...prevErrors,
          [formName]: FormErrors[formName],
        }))
      : setErrors(({ [formName]: removed, ...prevErrors }) => ({
          ...prevErrors,
        }));
  };

  const handleSelectChange = (value: string) => {
    setForm((prevForm) => ({ ...prevForm, type: value }));
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked, name: formName } = event.target || {};
    setForm((prevForm) => ({ ...prevForm, [formName]: checked }));
  };

  const handleSubmit = (event: FormEvent<EventTarget>) => {
    event.preventDefault();

    // If there are errors, do not submit the form
    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) return;

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
            checked={isEnabled}
            onChange={handleSwitchChange}
          />
        </FormGroup>
        <Small color="secondary50">
          Enabling this will set the recommended shipping method as the only
          available shipping method in checkout. This prevents multiple shipping
          method options when a free shipping promotion is being used.
        </Small>
      </Flex>

      <HR marginVertical="xxLarge" />
      <FormGroup>
        <Flex flexDirection="column" flexRowGap="8px">
          <Select
            disabled={!isEnabled}
            label="Hide Free Shipping"
            placeholder="Select a Customer Group"
            name="type"
            options={[
              { value: "physical", content: "Physical" },
              { value: "digital", content: "Digital" },
            ]}
            required
            value={form.type}
            onOptionChange={handleSelectChange}
          />
          <Small as="span" color="secondary50">
            Optional – hide the free shipping method for the selected customer
            group.
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
