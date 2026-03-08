/* This file was automatically generated, changes will be overwritten. */

import PocketBase, { RecordService } from "pocketbase";

export const Collections = {
  User: "user",
  Permission: "permission",
  Role: "role",
  Tag: "tag",
  Uom: "uom",
  Changelog: "changelog",
  ChangelogDiff: "changelogDiff",
  Partner: "partner",
  ProductCategory: "productCategory",
  Attribute: "attribute",
  AttributeValue: "attributeValue",
  Product: "product",
  ProductAttribute: "productAttribute",
  ProductAttributeValue: "productAttributeValue",
  ProductVariant: "productVariant",
  Bom: "bom",
  BomLine: "bomLine",
  SupplierPrice: "supplierPrice",
  PricingRule: "pricingRule",
  SquareConfig: "squareConfig",
} as const;

export interface CollectionRecords {
  user: UserRecord;
  permission: PermissionRecord;
  role: RoleRecord;
  tag: TagRecord;
  uom: UomRecord;
  changelog: ChangelogRecord;
  changelogDiff: ChangelogDiffRecord;
  partner: PartnerRecord;
  productCategory: ProductCategoryRecord;
  attribute: AttributeRecord;
  attributeValue: AttributeValueRecord;
  product: ProductRecord;
  productAttribute: ProductAttributeRecord;
  productAttributeValue: ProductAttributeValueRecord;
  productVariant: ProductVariantRecord;
  bom: BomRecord;
  bomLine: BomLineRecord;
  supplierPrice: SupplierPriceRecord;
  pricingRule: PricingRuleRecord;
  squareConfig: SquareConfigRecord;
}

export interface TypedPocketBase extends PocketBase {
  collection<K extends keyof CollectionRecords>(
    name: K
  ): RecordService<CollectionRecords[K]>;

  // fallback for dynamic strings
  collection(name: string): RecordService<any>;
}

