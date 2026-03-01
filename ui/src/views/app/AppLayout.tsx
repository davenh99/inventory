import { ParentComponent } from "solid-js";
import Home from "lucide-solid/icons/home";
import DrawOpen from "lucide-solid/icons/panel-left-open";
import DrawClose from "lucide-solid/icons/panel-left-close";
import User from "lucide-solid/icons/user";
import Settings from "lucide-solid/icons/settings";
import LogOut from "lucide-solid/icons/log-out";
import { Avatar, Container, Drawer, DropdownMenu, Navbar } from "@solidpb/ui-kit";
import { useAuthPB } from "../../config/pocketbase";

export const AppLayout: ParentComponent = (props) => {
  const { user } = useAuthPB();

  return (
    <Drawer id="app-drawer">
      <Drawer.Content>
        <Navbar>
          <div class="flex items-center">
            <Drawer.Trigger class="btn btn-ghost btn-square btn-sm lg:hidden mx-1">
              <DrawOpen size="24" />
            </Drawer.Trigger>
            <Navbar.Brand>
              <Home size={24} />
            </Navbar.Brand>
          </div>
          <Navbar.Profile>
            <DropdownMenu>
              <DropdownMenu.Trigger modifier="circle" class="mr-2">
                <Avatar fallback={user.name.charAt(0).toUpperCase()} alt="Placeholder" size="md" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content size="sm" class="min-w-50">
                <DropdownMenu.MenuItem onSelect={() => {}}>
                  <a class="justify-between">
                    <span>Profile</span> <User class="w-[1em] h-[1em]" />
                  </a>
                </DropdownMenu.MenuItem>
                <DropdownMenu.MenuItem onSelect={() => {}}>
                  <a class="justify-between">
                    <span>Settings</span> <Settings class="w-[1em] h-[1em]" />
                  </a>
                </DropdownMenu.MenuItem>
                <DropdownMenu.MenuItem onSelect={() => {}}>
                  <a class="justify-between">
                    <span>Logout</span> <LogOut class="w-[1em] h-[1em]" />
                  </a>
                </DropdownMenu.MenuItem>
              </DropdownMenu.Content>
            </DropdownMenu>
          </Navbar.Profile>
        </Navbar>
        <Container>
          <div>{props.children}</div>
        </Container>
      </Drawer.Content>
      <Drawer.Drawer>
        <Drawer.Trigger class="btn btn-ghost btn-square btn-sm hidden lg:flex mx-2 mt-2 w-12">
          <DrawOpen size="24" class="is-drawer-open:hidden" />
          <DrawClose size="24" class="is-drawer-close:hidden" />
        </Drawer.Trigger>
        <Drawer.Menu>
          <Drawer.MenuItem icon={<Home />} label="Home" />
        </Drawer.Menu>
      </Drawer.Drawer>
    </Drawer>
  );
};

export default AppLayout;
