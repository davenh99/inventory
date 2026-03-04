import { ThemeSwitch } from "@solidpb/ui-kit";
import Sun from "lucide-solid/icons/sun";
import Moon from "lucide-solid/icons/moon";

import { Component } from "solid-js";

const Settings: Component = () => {
  return (
    <div>
      <p>This is the Settings page.</p>
      <p>Choose theme:</p>
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
  );
};

export default Settings;
