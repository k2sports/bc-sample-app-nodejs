import { Box, Flex, Panel } from "@bigcommerce/big-design";
import styled from "styled-components";
import SettingsForm from "@components/settingsForm";
import ErrorMessage from "../components/error";
import Loading from "../components/loading";
import { useCustomerGroups } from "../lib/hooks";

const Index = () => {
  const { error, isLoading, customerGroups } = useCustomerGroups();
  const formData = {};

  console.log("customerGroups", { error, isLoading, customerGroups });

  const handleCancel = () => {
    console.log("Handling Canceling...");
  };

  const handleSubmit = async (data: FormData) => {
    console.log("Handling Submitting...");
  };

  return (
    <Panel header="Settings" id="home">
      <Flex>
        <SettingsForm
          formData={formData}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
        {/* <StyledBox border="box" borderRadius="normal" marginRight="xLarge" padding="medium">
                    <H4>Inventory count</H4>
                    <H1 marginBottom="none">{summary.inventory_count}</H1>
                </StyledBox>
                <StyledBox border="box" borderRadius="normal" marginRight="xLarge" padding="medium">
                    <H4>Variant count</H4>
                    <H1 marginBottom="none">{summary.variant_count}</H1>
                </StyledBox>
                <StyledBox border="box" borderRadius="normal" padding="medium">
                    <H4>Primary category</H4>
                    <H1 marginBottom="none">{summary.primary_category_name}</H1>
                </StyledBox> */}
      </Flex>
    </Panel>
  );
};

export default Index;
