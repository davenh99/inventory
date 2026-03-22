import { expect, test } from "vitest";
import { AdvancedFilter, Filter, FilterGroup } from "@solidpb/ui-kit";
import { buildFilterString } from "./filters";

type BuildFilterTestCase = {
  name: string;
  input: (Filter<any> | FilterGroup<any> | AdvancedFilter)[];
  expected: string;
};

const buildFilterTestCases: BuildFilterTestCase[] = [
  {
    name: "simple text filter with equals",
    input: [
      {
        field: {
          name: "name",
          label: "Name",
          type: "text",
        },
        operator: "=",
        value: "test",
      },
    ],
    expected: "name = 'test'",
  },
  {
    name: "filter with not equals",
    input: [
      {
        field: {
          name: "status",
          label: "Status",
          type: "text",
        },
        operator: "!=",
        value: "archived",
      },
    ],
    expected: "status != 'archived'",
  },
  {
    name: "numeric filter with greater than",
    input: [
      {
        field: {
          name: "price",
          label: "Price",
          type: "number",
        },
        operator: ">",
        value: 100,
      },
    ],
    expected: "price > 100",
  },
  {
    name: "numeric filter with less than or equal",
    input: [
      {
        field: {
          name: "quantity",
          label: "Quantity",
          type: "number",
        },
        operator: "<=",
        value: 50,
      },
    ],
    expected: "quantity <= 50",
  },
  {
    name: "multiple filters with AND",
    input: [
      {
        field: {
          name: "name",
          label: "Name",
          type: "text",
        },
        operator: "=",
        value: "product",
      },
      {
        field: {
          name: "category",
          label: "Category",
          type: "text",
        },
        operator: "=",
        value: "electronics",
      },
    ],
    expected: "name = 'product' && category = 'electronics'",
  },
  {
    name: "filter with contains operator",
    input: [
      {
        field: {
          name: "description",
          label: "Description",
          type: "text",
        },
        operator: "~",
        value: "wireless",
      },
    ],
    expected: "description ~ 'wireless'",
  },
  {
    name: "three filters with AND",
    input: [
      {
        field: {
          name: "status",
          label: "Status",
          type: "text",
        },
        operator: "=",
        value: "active",
      },
      {
        field: {
          name: "price",
          label: "Price",
          type: "number",
        },
        operator: ">",
        value: 50,
      },
      {
        field: {
          name: "inStock",
          label: "In Stock",
          type: "bool",
        },
        operator: "=",
        value: true,
      },
    ],
    expected: "status = 'active' && price > 50 && inStock = true",
  },
  {
    name: "filter with value containing quotes",
    input: [
      {
        field: {
          name: "name",
          label: "Name",
          type: "text",
        },
        operator: "=",
        value: "O'Brien",
      },
    ],
    expected: "name = 'O\\'Brien'",
  },
  {
    name: "boolean filter",
    input: [
      {
        field: {
          name: "isPublished",
          label: "Published",
          type: "bool",
        },
        operator: "=",
        value: false,
      },
    ],
    expected: "isPublished = false",
  },
  {
    name: "numeric filter without quotes",
    input: [
      {
        field: {
          name: "rating",
          label: "Rating",
          type: "number",
        },
        operator: ">=",
        value: 4.5,
      },
    ],
    expected: "rating >= 4.5",
  },
  {
    name: "2 filters and filter group",
    input: [
      {
        field: {
          name: "status",
          label: "Status",
          type: "text",
        },
        operator: "=",
        value: "active",
      },
      {
        field: {
          name: "price",
          label: "Price",
          type: "number",
        },
        operator: ">",
        value: 50,
      },
      {
        filters: [
          {
            field: {
              name: "inStock",
              label: "In Stock",
              type: "bool",
            },
            operator: "=",
            value: true,
          },
          {
            field: {
              name: "quantity",
              label: "Quantity",
              type: "number",
            },
            operator: ">",
            value: 0,
          },
        ],
      },
    ],
    expected: "status = 'active' && price > 50 && (inStock = true || quantity > 0)",
  },
  {
    name: "filter group and advanced filter",
    input: [
      {
        filters: [
          {
            field: {
              name: "category",
              label: "Category",
              type: "text",
            },
            operator: "=",
            value: "electronics",
          },
          {
            field: {
              name: "brand",
              label: "Brand",
              type: "text",
            },
            operator: "=",
            value: "Acme",
          },
        ],
      },
      {
        filter: "price > 100 && rating >= 4.5",
      } as AdvancedFilter,
    ],
    expected: "(category = 'electronics' || brand = 'Acme') && price > 100 && rating >= 4.5",
  },
];

for (const testCase of buildFilterTestCases) {
  test(testCase.name, () => {
    const result = buildFilterString(testCase.input);
    expect(result).toEqual(testCase.expected);
  });
}
