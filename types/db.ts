import {
  SessionContextProps,
  SessionProps,
  StoreSettings,
  User,
} from "./index";

export interface StoreData {
  accessToken?: string;
  scope?: string;
  storeHash: string;
}

export interface UserData {
  email: string;
  username?: string;
}

export interface Db {
  hasStoreUser(storeHash: string, userId: string): Promise<boolean> | boolean;
  setUser(session: SessionProps): Promise<void>;
  setStore(session: SessionProps): Promise<void>;
  setStoreUser(session: SessionProps): Promise<void>;
  getStoreToken(storeId: string): Promise<string> | null;
  deleteStore(session: SessionProps): Promise<void>;
  deleteUser(session: SessionProps): Promise<void>;
  hasStoreSettings(storeHash: string): Promise<boolean> | null;
  getStoreSettings(
    storeHash: string,
    user: User
  ): Promise<StoreSettings> | null;
  setStoreSettings(
    session: SessionContextProps,
    storeSettings: StoreSettings
  ): Promise<void>;
  deleteStoreSettings(session: SessionProps): Promise<void>;
}
