/* The rest of your app types */

// Stronger typed version of the auto-generated, as the auto generated doesn't know the type of json
type TPermission = Omit<Permission, "collections"> & { collections: string[] };

type TRole = Role & { expand?: { permissions: TPermission[] } };

type TUser = User & { expand?: { role: TRole } };

type ProductAttributeRecordExpand = ProductAttributeRecord & {
  expand: {
    attribute: AttributeRecord;
    productAttributeValue_via_productAttribute?: ProductAttributeValueRecordExpand[];
  };
};

type ProductAttributeValueRecordExpand = ProductAttributeValueRecord & {
  expand: {
    attributeValue: AttributeValueRecord;
  };
};

type ProductRecordExpand = ProductRecord & {
  expand: {
    category?: ProductCategoryRecord;
    tags?: TagRecord[];
    uom?: UomRecord;
    bom_via_product?: BomRecord[];
    productAttribute_via_product?: ProductAttributeRecordExpand[];
  };
};

type ProductVariantRecordExpand = ProductVariantRecord & {
  expand: {
    product: ProductRecord;
    productAttributeValues: ProductAttributeValueRecordExpand[];
  };
};

type BomLineRecordExpand = BomLineRecord & {
  expand: {
    uom: UomRecord;
    productVariant: ProductVariantRecordExpand;
    productAttributeValues: ProductAttributeValueRecordExpand[];
  };
};

type BomRecordExpand = BomRecord & {
  expand: {
    product: ProductRecordExpand;
    bomLine_via_bom: BomLineRecordExpand[];
  };
};
