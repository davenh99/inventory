/*
 filters contains helpers for transforming filters to and from pocketbase string filter into filter types
 from @solidpb/ui-kit.

 due to the incompatibility between frontend and backend filters (and some filters are only frontend),
 such as fuzzy_match and loose_contains, we structure like this:

 filters <-> filterString -> pbFilterString
 (the filterString is used in the url and can contain frontend only filters,
 pbFilterString is what we send to pocketbase and only contains compatible filters)

*/

import { Filter, FilterGroup } from "@solidpb/ui-kit";

export function parseFilterString<T>(filterStr: string): (Filter<T> | FilterGroup<T>)[] | null {
  const filterGroups = filterStr.split("||");

  return null;
}

export function buildFilterString(filters: (Filter<any> | FilterGroup<any>)[]): string {
  return "";
}

export function filterStringToPBFilter(filterStr: string): string {
  // Split by OR operator, process each filter individually, then rejoin
  return filterStr
    .split(" || ")
    .map((filterPart) => {
      // Find the operator position to separate metadata from condition
      const operatorMatch = filterPart.match(/\s+(=|!=|>|<|>=|<=)\s+/);
      if (!operatorMatch || operatorMatch.index === undefined) return "";

      // Extract field name (first segment before first middle dot)
      const fieldPart = filterPart.substring(0, operatorMatch.index);
      const fieldName = fieldPart.split("·")[0];

      // Extract operator and value
      const conditionPart = filterPart.substring(operatorMatch.index).trim();
      return `${fieldName} ${conditionPart}`;
    })
    .filter((f) => f)
    .join(" || ");
}

export function filtersToPBFilter<T>(filters: (Filter<T> | FilterGroup<T>)[]): string {
  return filterStringToPBFilter(buildFilterString(filters));
}
