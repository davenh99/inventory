import { createEffect, createSignal, ParentComponent, useContext } from "solid-js";
import { useLocation } from "@solidjs/router";
import Package from "lucide-solid/icons/package";
import DrawOpen from "lucide-solid/icons/panel-left-open";
import DrawClose from "lucide-solid/icons/panel-left-close";
import Settings from "lucide-solid/icons/settings";
import LogOut from "lucide-solid/icons/log-out";
import SquareSquare from "lucide-solid/icons/square-square";
import RulerDimensionLine from "lucide-solid/icons/ruler-dimension-line";
import { Avatar, BreadCrumb, BreadCrumbs, Container, Drawer, DropdownMenu, Navbar } from "@solidpb/ui-kit";

import { useAuthPB } from "../../config/pocketbase";
import { AppContext } from "./appContext";

type RouteConfig = {
  [key: string]: BreadCrumb;
};

const routeConfig: RouteConfig = {
  "/": { label: "Products", href: "/" },
  "/settings": { label: "Settings", href: "/settings" },
  "/uom": { label: "Units of Measure", href: "/uom" },
  "/square": { label: "Square Integration", href: "/square" },
};

export const AppLayout: ParentComponent = (props) => {
  const { user, logout } = useAuthPB();
  const location = useLocation();
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

  const crumbs = () => {
    const crumbs = [...baseCrumbs(), ...dynamicCrumbs()];
    // remove href and onclick from the last crumb
    if (crumbs.length > 0) {
      const lastIndex = crumbs.length - 1;
      crumbs[lastIndex] = { label: crumbs[lastIndex].label };
    }
    return crumbs;
  };

  return (
    <Drawer id="app-drawer" class="md:drawer-open">
      <Drawer.Content>
        <Navbar>
          <div class="flex items-center">
            <Drawer.Trigger class="btn btn-ghost btn-square btn-sm lg:hidden mx-1">
              <DrawOpen size="24" />
            </Drawer.Trigger>
            <Navbar.Brand href="/">
              <Package size={24} /> Inventory
            </Navbar.Brand>
          </div>
          <Navbar.Profile>
            <DropdownMenu>
              <DropdownMenu.Trigger modifier="circle" class="mr-2">
                <Avatar fallback={user.name.charAt(0).toUpperCase()} alt="Placeholder" size="md" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content size="sm" class="min-w-50">
                <DropdownMenu.MenuItem onSelect={() => {}}>
                  <a class="justify-between" href="/settings">
                    <span>Settings</span> <Settings class="w-[1em] h-[1em]" />
                  </a>
                </DropdownMenu.MenuItem>
                <DropdownMenu.MenuItem onSelect={logout}>
                  <a class="justify-between">
                    <span>Logout</span> <LogOut class="w-[1em] h-[1em]" />
                  </a>
                </DropdownMenu.MenuItem>
              </DropdownMenu.Content>
            </DropdownMenu>
          </Navbar.Profile>
        </Navbar>
        <Container>
          <AppContext.Provider value={{ crumbs, setCrumbs: handleSetCrumbs }}>
            <BreadCrumbs items={crumbs()} class="font-bold text-md" />
            <div>{props.children}</div>
          </AppContext.Provider>
        </Container>
      </Drawer.Content>
      <Drawer.Drawer>
        <Drawer.Trigger class="btn btn-ghost btn-square btn-sm hidden lg:flex mx-2 mt-2.5 mb-3.5 w-12">
          <DrawOpen size="24" class="is-drawer-open:hidden" />
          <DrawClose size="24" class="is-drawer-close:hidden" />
        </Drawer.Trigger>
        <Drawer.Menu>
          <Drawer.MenuItem icon={<Package />} label="Products" href="/" />
          <Drawer.MenuItem icon={<RulerDimensionLine />} label="Units of Measure" href="/uom" />
          <Drawer.MenuItem icon={<SquareSquare />} label="Square Integration" href="/square" />
        </Drawer.Menu>
      </Drawer.Drawer>
    </Drawer>
  );
};

export function useCrumbs() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useCrumbs must be used within AppContext.Provider (AppLayout)");
  }
  return context;
}

export default AppLayout;
