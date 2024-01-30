import { NextApiRequest, NextApiResponse } from "next";
import { bigcommerceClient, getSession } from "../../../lib/auth";

export default async function customerGroups(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { accessToken, storeHash } = await getSession(req);
    const bigcommerce = bigcommerceClient(accessToken, storeHash, "v2");

    const customer_groups = await bigcommerce.get("/customer_groups");

    res.status(200).json(customer_groups);
  } catch (error) {
    const { message, response } = error;
    res.status(response?.status || 500).json({ message });
  }
}
