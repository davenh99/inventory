import { Component } from "solid-js";
import Loader from "lucide-solid/icons/loader";

const LoadFullScreen: Component = () => {
  return (
    <div class="fixed inset-0 z-100 flex items-center justify-center bg-[var(--color-dark-background)]/25 dark:bg-[var(--color-light-background)]/25">
      <Loader class="w-9 h-9 animate-spin text-[var(--color-light-muted)] dark:text-[var(--color-dark-muted)]" />
    </div>
  );
};

export default LoadFullScreen;
