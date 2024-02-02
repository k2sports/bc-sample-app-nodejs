import { NextApiRequest, NextApiResponse } from "next";
import { bigcommerceClient, getSession } from "../../../lib/auth";

export default async function scripts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    body,
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const { accessToken, storeHash } = await getSession(req);
        const bigcommerce = bigcommerceClient(accessToken, storeHash);

        const { data } = await bigcommerce.get(`/content/scripts/${id}`);
        res.status(200).json(data);
      } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
      }
      break;
    case "PUT":
      try {
        const { accessToken, storeHash } = await getSession(req);
        const bigcommerce = bigcommerceClient(accessToken, storeHash);

        const { data } = await bigcommerce.put(`/content/scripts/${id}`, body);
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
