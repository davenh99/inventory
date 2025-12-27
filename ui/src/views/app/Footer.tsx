import { ParentComponent } from "solid-js";

interface Props {
  class?: string;
}

const Footer: ParentComponent<Props> = (props) => {
  return (
    <footer
      class={`flex flex-col items-center py-4 bg-[var(--color-light-surface)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-light-primary)] dark:text-[var(--color-dark-primary)] ${
        props.class ?? ""
      }`}
    >
      {props.children}
    </footer>
  );
};

export default Footer;
