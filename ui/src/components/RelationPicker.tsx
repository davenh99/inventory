import { Show } from "solid-js";
import TagArea, { TagRecord } from "./TagArea";

interface RelationPickerProps<T extends TagRecord = TagRecord> {
  relations: T[];
  setRelations: (relations: T[]) => void;
  suggestions?: T[];
  onCreateRelation: (name: string) => Promise<T>;
  onDeleteRelation: (relation: T) => Promise<void>;
  placeholder?: string;
  label?: string;
}

export const RelationPicker = <T extends TagRecord = TagRecord>(props: RelationPickerProps<T>) => {
  return (
    <div class="flex flex-col gap-1">
      <Show when={props.label}>
        <span class="text-xs font-medium text-[var(--color-text-light-secondary)] dark:text-[var(--color-text-dark-secondary)] mb-1">
          {props.label}
        </span>
      </Show>
      <TagArea
        tags={props.relations}
        setTags={props.setRelations}
        suggestions={props.suggestions}
        onCreateTag={props.onCreateRelation}
        onDeleteTag={props.onDeleteRelation}
        placeholder={props.placeholder || "Add relation..."}
      />
    </div>
  );
};

export default RelationPicker;
