import { type BreadCrumb } from "@solidpb/ui-kit";
import { createContext } from "solid-js";

type AppContextType = {
  crumbs: () => BreadCrumb[];
  setCrumbs: (crumbs: BreadCrumb[]) => void;
};

export const AppContext = createContext<AppContextType>();
