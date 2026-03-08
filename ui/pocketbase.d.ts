/* This file was automatically generated, changes will be overwritten. */

interface BaseRecord {
  readonly id: string;
  readonly collectionName: string;
  readonly collectionId: string;
  readonly created: string;
  readonly updated: string;
}

/* Collection type: auth */
interface User {
  avatar: string; // file
  name: string; // text
  verified: boolean; // bool
  emailVisibility: boolean; // bool
  email: string; // email
  role: string; // relation
}
type UserRecord = User & BaseRecord;
type UserUpdatePayload = Partial<UserRecord>;

/* Collection type: base */
interface Permission {
  name: string; // text
  collections: any; // json
  canView: boolean; // bool
  canList: boolean; // bool
  canCreate: boolean; // bool
  canUpdate: boolean; // bool
  canDelete: boolean; // bool
}
type PermissionRecord = Permission & BaseRecord;
type PermissionUpdatePayload = Partial<PermissionRecord>;

/* Collection type: base */
interface Role {
  name: string; // text
  permissions: string[]; // relation
}
type RoleRecord = Role & BaseRecord;
type RoleUpdatePayload = Partial<RoleRecord>;

/* Collection type: base */
interface Tag {
  name: string; // text
  colorHex: string; // text
}
type TagRecord = Tag & BaseRecord;
type TagUpdatePayload = Partial<TagRecord>;

/* Collection type: base */
interface Uom {
  name: string; // text
  category: "weight" | "volume" | "units"; // select
  ratio: number; // number
  referenceUom: boolean; // bool
  active: boolean; // bool
}
type UomRecord = Uom & BaseRecord;
type UomUpdatePayload = Partial<UomRecord>;

/* Collection type: base */
interface Changelog {
  collection: string; // text
  record: string; // text
  changeType: "create" | "update" | "delete"; // select
  changedBy: string; // relation
  reason: string; // text
}
type ChangelogRecord = Changelog & BaseRecord;
type ChangelogUpdatePayload = Partial<ChangelogRecord>;

/* Collection type: base */
interface ChangelogDiff {
  changelog: string; // relation
  field: string; // text
  valueOld: string; // text
  valueNew: string; // text
}
type ChangelogDiffRecord = ChangelogDiff & BaseRecord;
type ChangelogDiffUpdatePayload = Partial<ChangelogDiffRecord>;

/* Collection type: base */
interface Partner {
  name: string; // text
}
type PartnerRecord = Partner & BaseRecord;
type PartnerUpdatePayload = Partial<PartnerRecord>;

/* Collection type: base */
interface ProductCategory {
  name: string; // text
  active: boolean; // bool
  parent: string; // relation
}
type ProductCategoryRecord = ProductCategory & BaseRecord;
type ProductCategoryUpdatePayload = Partial<ProductCategoryRecord>;

/* Collection type: base */
interface Attribute {
  name: string; // text
  active: boolean; // bool
}
type AttributeRecord = Attribute & BaseRecord;
type AttributeUpdatePayload = Partial<AttributeRecord>;

/* Collection type: base */
interface AttributeValue {
  name: string; // text
  active: boolean; // bool
  attribute: string; // relation
}
type AttributeValueRecord = AttributeValue & BaseRecord;
type AttributeValueUpdatePayload = Partial<AttributeValueRecord>;

/* Collection type: base */
interface Product {
  name: string; // text
  active: boolean; // bool
  type: "stockable" | "consumable"; // select
  canPurchase: boolean; // bool
  canSell: boolean; // bool
  uom: string; // relation
  category: string; // relation
  description: string; // text
  image: string; // file
  tags: string[]; // relation
  sellPrice: number; // number
  pricingRule: string; // relation
  squareItem: string; // text
  squareLastSync: string; // date
}
type ProductRecord = Product & BaseRecord;
type ProductUpdatePayload = Partial<ProductRecord>;

/* Collection type: base */
interface ProductAttribute {
  active: boolean; // bool
  attribute: string; // relation
  product: string; // relation
}
type ProductAttributeRecord = ProductAttribute & BaseRecord;
type ProductAttributeUpdatePayload = Partial<ProductAttributeRecord>;

/* Collection type: base */
interface ProductAttributeValue {
  product: string; // relation
  active: boolean; // bool
  attributeValue: string; // relation
  priceExtra: number; // number
}
type ProductAttributeValueRecord = ProductAttributeValue & BaseRecord;
type ProductAttributeValueUpdatePayload = Partial<ProductAttributeValueRecord>;

/* Collection type: base */
interface ProductVariant {
  sku: string; // text
  name: string; // text
  product: string; // relation
  active: boolean; // bool
  sellPrice: number; // number
  squareItemVariation: string; // text
  sellPriceSquare: number; // number
  squareLastSync: string; // date
}
type ProductVariantRecord = ProductVariant & BaseRecord;
type ProductVariantUpdatePayload = Partial<ProductVariantRecord>;

/* Collection type: base */
interface Bom {
  product: string; // relation
}
type BomRecord = Bom & BaseRecord;
type BomUpdatePayload = Partial<BomRecord>;

/* Collection type: base */
interface BomLine {
  productVariant: string; // relation
  productAttributeValues: string[]; // relation
  qty: number; // number
  uom: string; // relation
  bom: string; // relation
}
type BomLineRecord = BomLine & BaseRecord;
type BomLineUpdatePayload = Partial<BomLineRecord>;

/* Collection type: base */
interface SupplierPrice {
  productVariant: string; // relation
  partner: string; // relation
  price: number; // number
  uom: string; // relation
  minQty: number; // number
  active: boolean; // bool
  discount: number; // number
}
type SupplierPriceRecord = SupplierPrice & BaseRecord;
type SupplierPriceUpdatePayload = Partial<SupplierPriceRecord>;

/* Collection type: base */
interface PricingRule {
  name: string; // text
  margin: number; // number
  overhead: number; // number
  default: boolean; // bool
  tax: number; // number
}
type PricingRuleRecord = PricingRule & BaseRecord;
type PricingRuleUpdatePayload = Partial<PricingRuleRecord>;

/* Collection type: base */
interface SquareConfig {
  url: string; // text
}
type SquareConfigRecord = SquareConfig & BaseRecord;
type SquareConfigUpdatePayload = Partial<SquareConfigRecord>;

