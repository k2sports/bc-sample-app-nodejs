import { NextApiRequest, NextApiResponse } from "next";
import {
  bigcommerceClient,
  getBCVerify,
  getSession,
  removeDataStore,
} from "../../lib/auth";

export default async function uninstall(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getBCVerify(req.query);
    console.log("Calling uninstall! session", session);
    const bcSession = await getSession(req);
    console.log("Calling uninstall! bcSession", bcSession);

    // Reset to optimized one-page checkout
    const bigcommerce = bigcommerceClient(
      bcSession.accessToken,
      bcSession.storeHash
    );
    await bigcommerce.put(`/checkouts/settings`, {
      custom_checkout_script_url: "",
      order_confirmation_use_custom_checkout_script: false,
      custom_order_confirmation_script_url: "",
      custom_checkout_supports_uco_settings: true,
    });

    // Remove data from db
    await removeDataStore(session);

    res.status(200).end();
  } catch (error) {
    console.log("uninstall error!!", error);
    const { message, response } = error;
    res.status(response?.status || 500).json({ message });
  }
}
