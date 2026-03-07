import { CollectionRecords } from "../../pocketbase-types";
import { fieldSchema } from "../../pocketbase-const";
import { FilterField } from "@solidpb/ui-kit";

export const getAvailableFields = <T>(collection: keyof CollectionRecords): FilterField<T>[] => {
  const collectionFields = fieldSchema[collection];

  return Object.entries(collectionFields)
    .filter(([_, def]) => ["date", "string", "bool", "text", "number"].includes(def.type))
    .map(([fieldName, fieldConfig]) => {
      const field: FilterField<T> = {
        name: fieldName as keyof T,
        label: camelCaseToLabel(fieldName),
        //@ts-ignore
        type: fieldConfig.type,
      };

      if (fieldConfig.type === "select" && fieldConfig.values) {
        field.options = getSelectOptions(fieldConfig.values);
      }

      return field;
    });
};

export const getSelectOptions = (options: string[]): { label: string; value: string }[] => {
  return options.map((opt) => ({ value: opt, label: camelCaseToLabel(opt) }));
};

export const camelCaseToLabel = (str: string): string => {
  return str.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
};
