import { NextApiRequest, NextApiResponse } from "next";
import { bigcommerceClient, getSession } from "../../../../lib/auth";

export type CheckoutSettingsResponse = {
  custom_checkout_script_url: string;
  custom_checkout_supports_uco_settings: boolean;
  custom_order_confirmation_script_url: string;
  order_confirmation_use_custom_checkout_script: boolean;
};

export default async function checkoutSettings(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body, method } = req;

  switch (method) {
    case "GET":
      try {
        const { accessToken, storeHash } = await getSession(req);
        const bigcommerce = bigcommerceClient(accessToken, storeHash);

        const { data } = await bigcommerce.get("/checkouts/settings");

        res.status(200).json(data);
      } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
      }
      break;
    case "PUT":
      try {
        const session = await getSession(req);
        const bigcommerce = bigcommerceClient(
          session.accessToken,
          session.storeHash
        );

        const { data } = await bigcommerce.put(`/checkouts/settings`, body);
        res.status(200).json(data);
      } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
