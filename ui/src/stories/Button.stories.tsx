import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Button } from "../components/";
import { For, Show } from "solid-js";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

// Variants, appearances, sizes
const variants = ["solid", "text"] as const;
const appearances = ["primary", "success", "warning", "neutral", "error", "muted"] as const;
const sizes = ["xs", "sm", "md", "lg"] as const;

export const AllButtons: Story = {
  render: () => (
    <div class="space-y-4">
      <For each={variants}>
        {(v) => (
          <div>
            <h3 class="mt-5 mb-1 font-bold">Variant: {v}</h3>
            <For each={sizes}>
              {(s) => (
                <div>
                  <h4 class="mt-2 font-bold">Size: {s}</h4>
                  <For each={[false, true]}>
                    {(l) => (
                      <div class="space-x-3">
                        <h5 class="mt-2 font-bold">Loading: {l}</h5>
                        <For each={appearances}>
                          {(a) => (
                            <Button variant={v} appearance={a} size={s} isLoading={l}>
                              {a}
                            </Button>
                          )}
                        </For>
                      </div>
                    )}
                  </For>
                </div>
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  ),
};
