/*
 filters contains helpers for transforming filters to and from pocketbase string filter into filter types
 from @solidpb/ui-kit.

 at the moment the system is quite simple, we only need to convert filters to pocketbase filter string.
*/

import { AdvancedFilter, Filter, FilterGroup } from "@solidpb/ui-kit";
import PocketBase from "pocketbase";

const pb = new PocketBase(); // just for the filter builder, we won't be making any requests with this instance

export function buildFilterString(filters: (Filter<any> | FilterGroup<any> | AdvancedFilter)[]): string {
  let filterStrings: string[] = [];

  const getFilterType = (
    item: Filter<any> | FilterGroup<any> | AdvancedFilter,
  ): "filter" | "group" | "advanced" => {
    if ("filter" in item) return "advanced";
    if ("filters" in item) return "group";
    return "filter";
  };

  for (let filter of filters) {
    const filterType = getFilterType(filter);

    switch (filterType) {
      case "filter":
        filter = filter as Filter<any>;

        // check if select value
        if (typeof filter.value === "object" && filter.value !== null && "value" in filter.value) {
          filter.value = filter.value.value;
        }

        console.log(typeof filter.value, filter.value);

        filterStrings.push(
          pb.filter(`${String(filter.field.name)} ${filter.operator} {:val}`, { val: filter.value }),
        );
        break;
      case "group":
        let filterGroupStrings: string[] = [];
        for (let groupFilter of (filter as FilterGroup<any>).filters) {
          filterGroupStrings.push(buildFilterString([groupFilter]));
        }
        filterStrings.push(`(${filterGroupStrings.join(" || ")})`);
        break;
      case "advanced":
        filterStrings.push((filter as AdvancedFilter).filter);
        break;
    }
  }

  return filterStrings.join(" && ");
}
