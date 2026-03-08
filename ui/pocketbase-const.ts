/* This file was automatically generated, changes will be overwritten. */

import { CollectionRecords } from "./pocketbase-types";

type FieldType =
  | "text"
  | "number"
  | "bool"
  | "relation"
  | "select"
  | "json"
  | "file"
  | "date"
  | "autodate"
  | "email";

type FieldDefinition = {
  type: FieldType;
  values?: string[];
};

export type FieldSchema = {
  [C in keyof CollectionRecords]: {
    [F in keyof CollectionRecords[C]]?: FieldDefinition;
  };
};

export const fieldSchema: FieldSchema = {
  user: {
    avatar: { type: "file" },
    name: { type: "text" },
    verified: { type: "bool" },
    emailVisibility: { type: "bool" },
    email: { type: "email" },
    role: { type: "relation" },
    created: { type: "autodate" },
    updated: { type: "autodate" },
    id: { type: "text" },
  },
  permission: {
    id: { type: "text" },
    name: { type: "text" },
    collections: { type: "json" },
    canView: { type: "bool" },
    canList: { type: "bool" },
    canCreate: { type: "bool" },
    canUpdate: { type: "bool" },
    canDelete: { type: "bool" },
    created: { type: "autodate" },
    updated: { type: "autodate" },
  },
  role: {
    id: { type: "text" },
    name: { type: "text" },
    permissions: { type: "relation" },
    created: { type: "autodate" },
    updated: { type: "autodate" },
  },
  tag: {
    id: { type: "text" },
    name: { type: "text" },
    colorHex: { type: "text" },
    created: { type: "autodate" },
    updated: { type: "autodate" },
  },
  uom: {
    id: { type: "text" },
    name: { type: "text" },
    category: { type: "select", values: ["weight", "volume", "units"] },
    ratio: { type: "number" },
    referenceUom: { type: "bool" },
    active: { type: "bool" },
    created: { type: "autodate" },
    updated: { type: "autodate" },
  },
  changelog: {
    id: { type: "text" },
    collection: { type: "text" },
    record: { type: "text" },
    changeType: { type: "select", values: ["create", "update", "delete"] },
    changedBy: { type: "relation" },
    reason: { type: "text" },
    created: { type: "autodate" },
    updated: { type: "autodate" },
  },
  changelogDiff: {
    id: { type: "text" },
    changelog: { type: "relation" },
    field: { type: "text" },
    valueOld: { type: "text" },
    valueNew: { type: "text" },
    created: { type: "autodate" },
    updated: { type: "autodate" },
  },
  partner: {
    id: { type: "text" },
    name: { type: "text" },
    created: { type: "autodate" },
    updated: { type: "autodate" },
  },
  productCategory: {
    id: { type: "text" },
    name: { type: "text" },
    active: { type: "bool" },
    parent: { type: "relation" },
    created: { type: "autodate" },
    updated: { type: "autodate" },
  },
  attribute: {
    id: { type: "text" },
    name: { type: "text" },
    active: { type: "bool" },
    created: { type: "autodate" },
    updated: { type: "autodate" },
  },
  attributeValue: {
    id: { type: "text" },
    name: { type: "text" },
    active: { type: "bool" },
    attribute: { type: "relation" },
    created: { type: "autodate" },
    updated: { type: "autodate" },
  },
  product: {
    id: { type: "text" },
    name: { type: "text" },
    active: { type: "bool" },
    type: { type: "select", values: ["stockable", "consumable"] },
    canPurchase: { type: "bool" },
    canSell: { type: "bool" },
    uom: { type: "relation" },
    category: { type: "relation" },
    description: { type: "text" },
    image: { type: "file" },
    tags: { type: "relation" },
    sellPrice: { type: "number" },
    pricingRule: { type: "relation" },
    squareItem: { type: "text" },
    squareLastSync: { type: "date" },
    created: { type: "autodate" },
    updated: { type: "autodate" },
  },
  productAttribute: {
    id: { type: "text" },
    active: { type: "bool" },
    attribute: { type: "relation" },
    product: { type: "relation" },
    created: { type: "autodate" },
    updated: { type: "autodate" },
  },
  productAttributeValue: {
    id: { type: "text" },
    product: { type: "relation" },
    active: { type: "bool" },
    attributeValue: { type: "relation" },
    priceExtra: { type: "number" },
    created: { type: "autodate" },
    updated: { type: "autodate" },
  },
  productVariant: {
    id: { type: "text" },
    sku: { type: "text" },
    name: { type: "text" },
    product: { type: "relation" },
    active: { type: "bool" },
    sellPrice: { type: "number" },
    squareItemVariation: { type: "text" },
    sellPriceSquare: { type: "number" },
    squareLastSync: { type: "date" },
    created: { type: "autodate" },
    updated: { type: "autodate" },
  },
  bom: {
    id: { type: "text" },
    product: { type: "relation" },
    created: { type: "autodate" },
    updated: { type: "autodate" },
  },
  bomLine: {
    id: { type: "text" },
    productVariant: { type: "relation" },
    productAttributeValues: { type: "relation" },
    qty: { type: "number" },
    uom: { type: "relation" },
    bom: { type: "relation" },
    created: { type: "autodate" },
    updated: { type: "autodate" },
  },
  supplierPrice: {
    id: { type: "text" },
    productVariant: { type: "relation" },
    partner: { type: "relation" },
    price: { type: "number" },
    uom: { type: "relation" },
    minQty: { type: "number" },
    active: { type: "bool" },
    discount: { type: "number" },
    created: { type: "autodate" },
    updated: { type: "autodate" },
  },
  pricingRule: {
    id: { type: "text" },
    name: { type: "text" },
    margin: { type: "number" },
    overhead: { type: "number" },
    default: { type: "bool" },
    tax: { type: "number" },
    created: { type: "autodate" },
    updated: { type: "autodate" },
  },
  squareConfig: {
    id: { type: "text" },
    url: { type: "text" },
    created: { type: "autodate" },
    updated: { type: "autodate" },
  },
};

