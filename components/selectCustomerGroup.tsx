import {
  Button,
  Checkbox,
  Flex,
  FormGroup,
  Input,
  Panel,
  Select,
  Form as StyledForm,
  Textarea,
} from "@bigcommerce/big-design";
import { ChangeEvent, FormEvent, useState } from "react";
import { FormData, StringKeyValue } from "../types";

interface FormProps {
  label: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  onCancel(): void;
  onSubmit(form: FormData): void;
}

const FormErrors = {
  name: "Product name is required",
  price: "Default price is required",
};

const Form = ({ label, isDisabled = false, isRequired = false }: FormProps) => {
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

  return (
    <Select
      disabled={!isDisabled}
      label={label}
      placeholder="Select a Customer Group"
      name="type"
      options={[
        { value: "physical", content: "Physical" },
        { value: "digital", content: "Digital" },
      ]}
      required={isRequired}
      value={form.type}
      onOptionChange={handleSelectChange}
    />
  );
};

export default Form;
