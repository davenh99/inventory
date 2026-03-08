import { Card, ThemeSwitch } from "@solidpb/ui-kit";
import Sun from "lucide-solid/icons/sun";
import Moon from "lucide-solid/icons/moon";

import { Component } from "solid-js";

const Settings: Component = () => {
  return (
    <Card>
      <div class="space-y-1">
        <h3 class="text-md font-bold">Theme</h3>
        <ThemeSwitch
          options={[
            {
              value: "emerald",
              label: (
                <span class="flex items-center gap-1">
                  <Sun class="w-[1em] h-[1em]" /> Light
                </span>
              ),
            },
            {
              value: "dracula",
              label: (
                <span class="flex items-center gap-1">
                  <Moon class="w-[1em] h-[1em]" /> Dark
                </span>
              ),
            },
          ]}
        />
      </div>
    </Card>
  );
};

export default Settings;
