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
  title: string;
  description: string;
  help: string;
  options?: {
    label: string;
    value: string;
  }[];
};

export type FieldSchema = {
  [C in keyof CollectionRecords]?: {
    [F in keyof CollectionRecords[C]]?: FieldDefinition;
  };
};

export const fieldSchema: FieldSchema = {
  "": {},
  "attribute": {
    "active": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Active",
      "type": "bool"
    },
    "created": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Created",
      "type": "autodate"
    },
    "name": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Name",
      "type": "text"
    },
    "updated": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Updated",
      "type": "autodate"
    }
  },
  "attributeValue": {
    "active": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Active",
      "type": "bool"
    },
    "attribute": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Attribute",
      "type": "relation"
    },
    "created": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Created",
      "type": "autodate"
    },
    "name": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Name",
      "type": "text"
    },
    "updated": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Updated",
      "type": "autodate"
    }
  },
  "pricingRule": {
    "created": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Created",
      "type": "autodate"
    },
    "default": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Default",
      "type": "bool"
    },
    "margin": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Margin",
      "type": "number"
    },
    "name": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Name",
      "type": "text"
    },
    "overhead": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Overhead",
      "type": "number"
    },
    "tax": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Tax",
      "type": "number"
    },
    "updated": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Updated",
      "type": "autodate"
    }
  },
  "product": {
    "active": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Active",
      "type": "bool"
    },
    "canPurchase": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Can Purchase",
      "type": "bool"
    },
    "canSell": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Can Sell",
      "type": "bool"
    },
    "category": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Category",
      "type": "relation"
    },
    "created": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Created",
      "type": "autodate"
    },
    "description": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Description",
      "type": "text"
    },
    "image": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Image",
      "type": "file"
    },
    "name": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Name",
      "type": "text"
    },
    "pricingRule": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Pricing Rule",
      "type": "relation"
    },
    "sellPrice": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Sell Price",
      "type": "number"
    },
    "squareItem": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Square Item",
      "type": "text"
    },
    "squareLastSync": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Square Last Sync",
      "type": "date"
    },
    "tags": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Tags",
      "type": "relation"
    },
    "type": {
      "description": "",
      "help": "",
      "options": [
        {
          "label": "Stockable",
          "value": "stockable"
        },
        {
          "label": "Consumable",
          "value": "consumable"
        }
      ],
      "title": "Type",
      "type": "select"
    },
    "uom": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Uom",
      "type": "relation"
    },
    "updated": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Updated",
      "type": "autodate"
    }
  },
  "productAttribute": {
    "active": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Active",
      "type": "bool"
    },
    "attribute": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Attribute",
      "type": "relation"
    },
    "created": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Created",
      "type": "autodate"
    },
    "product": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Product",
      "type": "relation"
    },
    "updated": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Updated",
      "type": "autodate"
    }
  },
  "productAttributeValue": {
    "active": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Active",
      "type": "bool"
    },
    "attributeValue": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Attribute Value",
      "type": "relation"
    },
    "created": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Created",
      "type": "autodate"
    },
    "priceExtra": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Price Extra",
      "type": "number"
    },
    "product": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Product",
      "type": "relation"
    },
    "updated": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Updated",
      "type": "autodate"
    }
  },
  "productCategory": {
    "active": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Active",
      "type": "bool"
    },
    "created": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Created",
      "type": "autodate"
    },
    "name": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Name",
      "type": "text"
    },
    "parent": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Parent",
      "type": "relation"
    },
    "updated": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Updated",
      "type": "autodate"
    }
  },
  "productVariant": {
    "active": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Active",
      "type": "bool"
    },
    "computedPrice": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Computed Price",
      "type": "number"
    },
    "created": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Created",
      "type": "autodate"
    },
    "name": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Name",
      "type": "text"
    },
    "product": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Product",
      "type": "relation"
    },
    "sellPrice": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Sell Price",
      "type": "number"
    },
    "sellPriceSquare": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Sell Price Square",
      "type": "number"
    },
    "sku": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Sku",
      "type": "text"
    },
    "squareItemVariation": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Square Item Variation",
      "type": "text"
    },
    "squareLastSync": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Square Last Sync",
      "type": "date"
    },
    "updated": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Updated",
      "type": "autodate"
    }
  },
  "squareConfig": {
    "created": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Created",
      "type": "autodate"
    },
    "updated": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Updated",
      "type": "autodate"
    },
    "url": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Url",
      "type": "text"
    }
  },
  "supplierPrice": {
    "active": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Active",
      "type": "bool"
    },
    "created": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Created",
      "type": "autodate"
    },
    "discount": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Discount",
      "type": "number"
    },
    "minQty": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Minimum Order Quantity",
      "type": "number"
    },
    "partner": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Partner",
      "type": "relation"
    },
    "price": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Price",
      "type": "number"
    },
    "productVariant": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Product Variant",
      "type": "relation"
    },
    "uom": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Unit of Measure",
      "type": "relation"
    },
    "updated": {
      "description": "",
      "help": "",
      "options": [],
      "title": "Updated",
      "type": "autodate"
    }
  }
};
