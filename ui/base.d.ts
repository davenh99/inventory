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
  email: string; // email
  emailVisibility: boolean; // bool
  verified: boolean; // bool
  name: string; // text
  avatar: string; // file
  role: string; // relation
}
type UserRecord = User & BaseRecord;
type UserUpdatePayload = Partial<UserRecord>;

/* Collection type: base */
interface Changelog {
  collection: string; // text
  recordId: string; // text
  changeType: "create" | "update" | "delete"; // select
  changedBy: string; // relation
  reason: string; // text
}
type ChangelogRecord = Changelog & BaseRecord;
type ChangelogUpdatePayload = Partial<ChangelogRecord>;

/* Collection type: base */
interface ChangelogDiff {
  changelogId: string; // relation
  field: string; // text
  valueOld: string; // text
  valueNew: string; // text
}
type ChangelogDiffRecord = ChangelogDiff & BaseRecord;
type ChangelogDiffUpdatePayload = Partial<ChangelogDiffRecord>;

/* Collection type: base */
interface Role {
  name: string; // text
  permissions: string[]; // relation
}
type RoleRecord = Role & BaseRecord;
type RoleUpdatePayload = Partial<RoleRecord>;

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
interface Uom {
  name: string; // text
  category: "weight" | "volume" | "units" | ""; // select
  ratio: number; // number
  rounding: number; // number
}
type UomRecord = Uom & BaseRecord;
type UomUpdatePayload = Partial<UomRecord>;

/* Collection type: base */
interface Category {
  name: string; // text
  active: boolean; // bool
}
type CategoryRecord = Category & BaseRecord;
type CategoryUpdatePayload = Partial<CategoryRecord>;

/* Collection type: base */
interface PricingRule {
  name: string; // text
  default: boolean; // bool
  margin: number; // number
  overhead: number; // number
  tax: number; // number
  roundingPlaces: number; // number
}
type PricingRuleRecord = PricingRule & BaseRecord;
type PricingRuleUpdatePayload = Partial<PricingRuleRecord>;

/* Collection type: base */
interface Partner {
  name: string; // text
}
type PartnerRecord = Partner & BaseRecord;
type PartnerUpdatePayload = Partial<PartnerRecord>;

/* Collection type: base */
interface Product {
  name: string; // text
  type: "stockable" | "consumable" | ""; // select
  canPurchase: boolean; // bool
  canSell: boolean; // bool
  uom: string; // relation
  category: string; // relation
  active: boolean; // bool
  description: string; // text
  pricingRule: string; // relation
  squareItem: string; // text
}
type ProductRecord = Product & BaseRecord;
type ProductUpdatePayload = Partial<ProductRecord>;

/* Collection type: base */
interface Tag {
  name: string; // text
  colorHex: string; // text
}
type TagRecord = Tag & BaseRecord;
type TagUpdatePayload = Partial<TagRecord>;

/* Collection type: base */
interface ProductVariant {
  sku: string; // text
  product: string; // relation
  active: boolean; // bool
}
type ProductVariantRecord = ProductVariant & BaseRecord;
type ProductVariantUpdatePayload = Partial<ProductVariantRecord>;

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
interface SellPrice {
  productVariant: string; // relation
  priceSellSquare: number; // number
  squareLastSync: string; // date
  syncState: "synced" | "drift" | "overridden" | ""; // select
}
type SellPriceRecord = SellPrice & BaseRecord;
type SellPriceUpdatePayload = Partial<SellPriceRecord>;

/* Collection type: base */
interface SquareSettings {
  url: string; // text
}
type SquareSettingsRecord = SquareSettings & BaseRecord;
type SquareSettingsUpdatePayload = Partial<SquareSettingsRecord>;

/* Collection type: base */
interface Attribute {
  name: string; // text
}
type AttributeRecord = Attribute & BaseRecord;
type AttributeUpdatePayload = Partial<AttributeRecord>;

/* Collection type: base */
interface AttributeValue {
  name: string; // text
  attribute: string; // relation
}
type AttributeValueRecord = AttributeValue & BaseRecord;
type AttributeValueUpdatePayload = Partial<AttributeValueRecord>;

/* Collection type: base */
interface ProductAttribute {
  attribute: string; // relation
  product: string; // relation
}
type ProductAttributeRecord = ProductAttribute & BaseRecord;
type ProductAttributeUpdatePayload = Partial<ProductAttributeRecord>;

/* Collection type: base */
interface ProductAttributeValue {
  product: string; // relation
  attributeValue: string; // relation
  priceExtra: number; // number
}
type ProductAttributeValueRecord = ProductAttributeValue & BaseRecord;
type ProductAttributeValueUpdatePayload = Partial<ProductAttributeValueRecord>;
