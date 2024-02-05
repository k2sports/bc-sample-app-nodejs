import { Message, Panel } from "@bigcommerce/big-design";
import { ErrorMessageProps, ErrorProps } from "../types";

const ErrorContent = ({ message }: Pick<ErrorProps, "message">) => (
  <>
    <Message
      header="Something went wrong!"
      type="error"
      messages={[
        {
          text: `Error Message: ${message}`,
        },
      ]}
    />
  </>
);

const ErrorMessage = ({ error, renderPanel = true }: ErrorMessageProps) => {
  if (renderPanel) {
    return (
      <Panel>
        <ErrorContent message={error.message} />
      </Panel>
    );
  }

  return <ErrorContent message={error.message} />;
};

export default ErrorMessage;
