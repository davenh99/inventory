import { Component } from "solid-js";
import Loader from "lucide-solid/icons/loader";

const LoadFullScreen: Component = () => {
  return (
    <div class="fixed inset-0 z-100 flex items-center justify-center">
      <Loader class="w-9 h-9 animate-spin" />
    </div>
  );
};

export default LoadFullScreen;
