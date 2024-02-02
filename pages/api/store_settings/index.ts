import { NextApiRequest, NextApiResponse } from "next";
import { getBCVerify, getSession } from "@lib/auth";
import { getStoreSettings, updateStoreSettings } from "@lib/settings";

export default async function storeSettings(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;

  switch (method) {
    case "GET":
      try {
        // const session = await getBCVerify(req.query);
        const session = await getSession(req);

        const response = await getStoreSettings(session);
        res.status(200).json(response || {});
      } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
      }
      break;
    case "PUT":
      try {
        const session = await getSession(req);
        // const session = await getBCVerify(req.query);

        await updateStoreSettings(session, body);

        res.status(200).end();
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
