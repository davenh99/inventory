import { type BreadCrumb } from "@solidpb/ui-kit";
import { createContext } from "solid-js";

type CrumbsContextType = {
  crumbs: () => BreadCrumb[];
  setCrumbs: (crumbs: BreadCrumb[]) => void;
};

export const CrumbsContext = createContext<CrumbsContextType>();
