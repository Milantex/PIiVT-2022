import Ajv from "ajv";

const ajv = new Ajv();

export interface IEditInCartDto {
    itemId: number;
    sizeId: number;
    quantity: number;
}

const EditInCartValidator = ajv.compile({
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
            minimum: 0,
        },
    },
    required: [
        "itemId",
        "sizeId",
        "quantity",
    ],
    additionalProperties: false,
});

export { EditInCartValidator };
