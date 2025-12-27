import { ParentComponent } from "solid-js";

interface Props {
  class?: string;
}

const Card: ParentComponent<Props> = (props) => {
  return (
    <div
      class={`rounded-xl p-3 bg-[var(--color-light-surface)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-light-primary)] dark:text-[var(--color-text-dark-primary)] ${
        props.class ?? ""
      }`}
    >
      {props.children}
    </div>
  );
};

export default Card;
