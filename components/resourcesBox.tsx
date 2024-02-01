import { Box, H4, Small } from "@bigcommerce/big-design";
import { CUSTOM_CHECKOUT_URL } from "@pages/index";

const RescourcesBox = () => (
  <Box
    backgroundColor="secondary10"
    border="box"
    borderRadius="normal"
    padding="medium"
  >
    <H4>Resources</H4>
    <ul>
      <li>
        <Small>
          <a href="https://github.com/k2sports/bc-checkout-js">
            EOC Checkout GitHub Repo
          </a>
        </Small>
      </li>
      <li>
        <Small>
          <a href="https://github.com/k2sports/bc-sample-app-nodejs">
            Modify Shipping Methods App GitHub Repo
          </a>
        </Small>
      </li>
      <li>
        <Small>
          <a href="https://developer.bigcommerce.com/docs/integrations/scripts#scripts-api-and-script-manager">
            Script Manager Documentation
          </a>
        </Small>
      </li>
      <li>
        <Small>
          <a href="https://developer.bigcommerce.com/docs/storefront/cart-checkout/open-checkouts/guide">
            Customizing Checkout Documentation
          </a>
        </Small>
      </li>
    </ul>
  </Box>
);

export default RescourcesBox;
