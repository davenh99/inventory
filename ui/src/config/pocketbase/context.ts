import { createContext } from "solid-js";
import { TypedPocketBase } from "../../../pocketbase";

type PBContextType = {
  pb: TypedPocketBase;
  store: { user: TUser | null; loading: boolean; networkError: boolean };
  checkAuth: () => Promise<void>;
};

export const PBContext = createContext<PBContextType>();
