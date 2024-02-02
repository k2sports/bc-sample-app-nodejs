import { SessionContextProps, SessionProps, StoreSettings } from "@types";
import db from "./db";

export async function getStoreSettings({
  storeHash,
  user,
}: SessionContextProps) {
  return await db.getStoreSettings(storeHash, user);
}

export async function updateStoreSettings(
  session: SessionContextProps,
  storeSettings: StoreSettings
) {
  await db.setStoreSettings(session, storeSettings);
}
