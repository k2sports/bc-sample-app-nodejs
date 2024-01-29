import { NextApiRequest, NextApiResponse } from "next";
import { bigcommerceClient, getSession } from "../../../lib/auth";

export default async function customerGroups(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("doin this");
    const { accessToken, storeHash } = await getSession(req);
    const bigcommerce = bigcommerceClient(accessToken, storeHash);

    const { data } = await bigcommerce.get("/v2/customer_groups");
    res.status(200).json(data);
  } catch (error) {
    const { message, response } = error;
    res.status(response?.status || 500).json({ message });
  }
}
