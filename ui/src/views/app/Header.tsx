import { ParentComponent } from "solid-js";

const Header: ParentComponent = (props) => {
  return (
    <header class="px-[5vw] py-4 bg-[var(--color-light-surface)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-light-primary)] dark:text-[var(--color-dark-primary)]">
      {props.children}
    </header>
  );
};

export default Header;
