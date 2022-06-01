import Ajv from "ajv";

const ajv = new Ajv();

export interface IAddToCartDto {
    itemId: number;
    sizeId: number;
    quantity: number;
}

const AddToCartValidator = ajv.compile({
    type: "object",
    properties: {
        itemId: {
            type: "integer",
        },
        sizeId: {
            type: "integer",
        },
        quantity: {
            type: "integer",
            minimum: 1,
        },
    },
    required: [
        "itemId",
        "sizeId",
        "quantity",
    ],
    additionalProperties: false,
});

export { AddToCartValidator };
