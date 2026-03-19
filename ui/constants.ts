export const THEME_KEY = "theme";
export const EXPAND_USER = "role.permissions";
export const EXPAND_PRODUCT =
  "category,uom,tags,bom_via_product," +
  "productAttribute_via_product.attribute," +
  "productAttribute_via_product.productAttributeValue_via_productAttribute.attributeValue,";
export const EXPAND_PRODUCT_VARIANT = "productAttributeValues";

export const EXPAND_PRODATTR = "attribute";

export const NEW_RECORD_ID = "_new_record";

export const DROP_ABOVE_CLASS = `
  relative 
  before:absolute 
  before:inset-x-1
  before:top-0
  before:h-1 
  before:rounded-full 
  before:bg-blue-500
  before:content-['']
`;

export const DROP_BELOW_CLASS = `
  relative 
  after:absolute 
  after:inset-x-1
  after:bottom-0 
  after:h-1 
  after:rounded-full 
  after:bg-blue-500 
  after:content-['']
`;

export const IGNORE_ERRORS = [
  "ResizeObserver loop completed with undelivered notifications.",
  "ResizeObserver loop limit exceeded",
];
