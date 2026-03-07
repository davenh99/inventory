import { useContext } from "solid-js";
import { CrumbsContext } from "./context";

export function useCrumbs() {
  const context = useContext(CrumbsContext);
  if (!context) {
    throw new Error("useCrumbs must be used within CrumbsProvider");
  }
  return context;
}
