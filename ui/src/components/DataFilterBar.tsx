import { Accessor, createSignal, Setter } from "solid-js";
import { Button, FilterBar, type FilterField, type Filter, type FilterGroup } from "@solidpb/ui-kit";
import Plus from "lucide-solid/icons/plus";
import { tv } from "tailwind-variants";

interface DataFilterBarProps<T> {
  availableFields: FilterField<T>[];
  filters: Accessor<(Filter<T> | FilterGroup<T>)[]>;
  setFilters: Setter<(Filter<T> | FilterGroup<T>)[]>;
  onCreateNew?: () => void;
  class?: string;
}

const styles = tv({
  base: "md:w-160",
});

export const DataFilterBar = <T,>(props: DataFilterBarProps<T>) => {
  const [searchValue, setSearchValue] = createSignal("");

  const handleAddFilterGroup = (newFilters: Filter<T>[]) => {
    if (newFilters.length === 1) {
      props.setFilters([...(props.filters() || []), newFilters[0]]);
      return;
    }

    const newGroup: FilterGroup<T> = {
      filters: newFilters,
    };

    props.setFilters([...(props.filters() || []), newGroup]);
  };

  const handleUpdateFilterGroup = (ind: number, filters: Filter<T>[]) => {
    props.setFilters((prev) => {
      const updated = [...prev];
      if (filters.length === 1) {
        // Collapse group back to single filter
        updated[ind] = filters[0];
      } else {
        // just in case we do a spread
        updated[ind] = { filters: [...filters] };
      }
      return updated;
    });
  };

  const handleGroupDrag = (sourceInd: number, targetInd: number, sourceFilterGroupInd?: number) => {
    props.setFilters((prev) => {
      const updated = [...prev];

      // Extract the item being dragged
      let draggedItem: Filter<T> | FilterGroup<T>;

      if (sourceFilterGroupInd !== undefined) {
        // Dragging a filter OUT of a group
        const sourceGroup = updated[sourceInd] as FilterGroup<T>;
        draggedItem = sourceGroup.filters[sourceFilterGroupInd];

        // Remove it from the group, or collapse group if only one left
        const remainingFilters = sourceGroup.filters.filter((_, i) => i !== sourceFilterGroupInd);
        if (remainingFilters.length === 1) {
          updated[sourceInd] = remainingFilters[0];
        } else {
          updated[sourceInd] = { filters: remainingFilters };
        }
      } else {
        // Dragging a whole filter/group
        draggedItem = updated[sourceInd];
        updated.splice(sourceInd, 1);

        // Adjust targetInd if needed after splice
        if (targetInd > sourceInd) targetInd--;
      }

      if (targetInd === -1) {
        if (sourceFilterGroupInd !== undefined)
          // Dropped on the bar itself - append to end
          return [...updated, draggedItem];
      }

      // Dropped on another chip - merge into a group
      const targetItem = updated[targetInd];

      if ("filters" in targetItem) {
        // Target is already a group - add to it
        updated[targetInd] = {
          filters: [...targetItem.filters, draggedItem as Filter<T>],
        };
      } else {
        // Merge source and target into a new group
        updated[targetInd] = { filters: [targetItem, draggedItem as Filter<T>] };
      }

      return updated;
    });
  };

  return (
    <FilterBar<T>
      leftAction={
        <Button appearance="success" onClick={props.onCreateNew}>
          <Plus size={16} /> New
        </Button>
      }
      class={styles({ class: props.class })}
      availableFields={props.availableFields}
      value={searchValue()}
      onChangeValue={setSearchValue}
      items={props.filters()}
      setItems={props.setFilters}
      onFilterRemove={(ind) => props.setFilters((prev) => prev.filter((_, i) => ind !== i))}
      onAddFilterGroup={handleAddFilterGroup}
      onUpdateFilterGroup={handleUpdateFilterGroup}
      onGroupDrag={handleGroupDrag}
    />
  );
};

export default DataFilterBar;
