import { expect, test } from "vitest";
import { Filter, FilterGroup } from "@solidpb/ui-kit";
import { parseFilterString, buildFilterString, filterStringToPBFilter } from "./filters";

type ParseFilterTestCase = {
  name: string;
  input: string;
  expected: (Filter<any> | FilterGroup<any>)[];
};

type BuildFilterTestCase = {
  name: string;
  input: (Filter<any> | FilterGroup<any>)[];
  expected: string;
};

type FilterStringToPBFilterTestCase = {
  name: string;
  input: string;
  expected: string;
};

const parseFilterTestCases: ParseFilterTestCase[] = [
  {
    name: "simple filter",
    input: "name·Name·text·null⁞ is⁞ test",
    expected: [
      {
        field: {
          name: "name",
          label: "Name",
          type: "text",
        },
        operator: "is",
        value: "test",
      },
    ],
  },
];

const buildFilterTestCases: BuildFilterTestCase[] = [
  {
    name: "simple filter",
    input: [
      {
        field: {
          name: "name",
          label: "Name",
          type: "text",
        },
        operator: "is",
        value: "test",
      },
    ],
    expected: "name·Name·text·null⁞ is⁞ test",
  },
];

const filterStringToPBFilterTestCases: FilterStringToPBFilterTestCase[] = [
  {
    name: "simple text filter",
    input: "name·Name·text·null⁞ is⁞ test",
    expected: "name = 'test'",
  },
  {
    name: "select filter with options",
    input: "status·Status·select·active◦Active¦inactive◦Inactive⁞ is⁞ active",
    expected: "status = 'active'",
  },
  {
    name: "filter with not equal operator",
    input: "category·Category·text·null⁞ is_not⁞ archived",
    expected: "category != 'archived'",
  },
  {
    name: "filter with greater than operator",
    input: "price·Price·number·null⁞ >⁞ 100",
    expected: "price > '100'",
  },
  {
    name: "multiple filters with OR",
    input: "name·Name·text·null⁞ is⁞ test␞category·Category·text·null⁞ is⁞ electronics",
    expected: "name = 'test' || category = 'electronics'",
  },
];

// for (const testCase of parseFilterTestCases) {
//   test(testCase.name, () => {
//     const result = parseFilterString(testCase.input);
//     expect(result).toEqual(testCase.expected);
//   });
// }

// for (const testCase of buildFilterTestCases) {
//   test(testCase.name, () => {
//     const result = buildFilterString(testCase.input);
//     expect(result).toEqual(testCase.expected);
//   });
// }

for (const testCase of filterStringToPBFilterTestCases) {
  test(testCase.name, () => {
    const result = filterStringToPBFilter(testCase.input);
    expect(result).toEqual(testCase.expected);
  });
}
