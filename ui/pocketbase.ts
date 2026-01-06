/* This file was automatically generated, changes will be overwritten. */

import PocketBase, { RecordService } from "pocketbase";

export const Collections = {
  User: "user",
  Changelog: "changelog",
  ChangelogDiff: "changelogDiff",
  Role: "role",
  Permission: "permission",
  Uom: "uom",
  Category: "category",
  PricingRule: "pricingRule",
  Partner: "partner",
  Product: "product",
  Tag: "tag",
  ProductVariant: "productVariant",
  SupplierPrice: "supplierPrice",
  SellPrice: "sellPrice",
  SquareSettings: "squareSettings",
  Attribute: "attribute",
  AttributeValue: "attributeValue",
  ProductAttribute: "productAttribute",
  ProductAttributeValue: "productAttributeValue",
} as const;

export interface CollectionRecords {
  user: UserRecord;
  changelog: ChangelogRecord;
  changelogDiff: ChangelogDiffRecord;
  role: RoleRecord;
  permission: PermissionRecord;
  uom: UomRecord;
  category: CategoryRecord;
  pricingRule: PricingRuleRecord;
  partner: PartnerRecord;
  product: ProductRecord;
  tag: TagRecord;
  productVariant: ProductVariantRecord;
  supplierPrice: SupplierPriceRecord;
  sellPrice: SellPriceRecord;
  squareSettings: SquareSettingsRecord;
  attribute: AttributeRecord;
  attributeValue: AttributeValueRecord;
  productAttribute: ProductAttributeRecord;
  productAttributeValue: ProductAttributeValueRecord;
}

export interface TypedPocketBase extends PocketBase {
  collection<K extends keyof CollectionRecords>(
    name: K
  ): RecordService<CollectionRecords[K]>;

  // fallback for dynamic strings
  collection(name: string): RecordService<any>;
}

