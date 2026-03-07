import { createEffect, createSignal, ParentComponent } from "solid-js";
import { useLocation } from "@solidjs/router";
import { type BreadCrumb } from "@solidpb/ui-kit";

import { CrumbsContext } from "./context";

type RouteConfig = {
  [key: string]: BreadCrumb;
};

const routeConfig: RouteConfig = {
  "/": { label: "Dashboard", href: "/" },
  "/settings": { label: "Settings", href: "/settings" },
};

export const CrumbsProvider: ParentComponent = (props) => {
  //   const location = useLocation();
  const [baseCrumbs, setBaseCrumbs] = createSignal<BreadCrumb[]>([]);
  const [dynamicCrumbs, setDynamicCrumbs] = createSignal<BreadCrumb[]>([]);

  // Update base crumbs when location changes
  createEffect(() => {
    const pathname = location.pathname;
    const routeCrumb = routeConfig[pathname];

    if (routeCrumb) {
      setBaseCrumbs([routeCrumb]);
    } else {
      // Default fallback
      setBaseCrumbs([{ label: "Home", href: "/" }]);
    }

    // Reset dynamic crumbs when route changes
    setDynamicCrumbs([]);
  });

  const handleSetCrumbs = (newCrumbs: BreadCrumb[]) => {
    setDynamicCrumbs(newCrumbs);
  };

  const allCrumbs = () => [...baseCrumbs(), ...dynamicCrumbs()];

  return (
    <CrumbsContext.Provider
      value={{
        crumbs: allCrumbs,
        setCrumbs: handleSetCrumbs,
      }}
    >
      {props.children}
    </CrumbsContext.Provider>
  );
};
