import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export interface IEditItemDto {
    name: string;
    description: string;
    isActive: boolean;
    ingredientIds: number[];
    sizes: {
        sizeId: number;
        price: number;
        kcal: number;
    }[];
}

export default interface IEditItem extends IServiceData {
    name: string;
    description: string;
    is_active: number;
}

const EditItemValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 8,
            maxLength: 128,
        },
        description: {
            type: "string",
            minLength: 32,
            maxLength: 500,
        },
        isActive: {
            type: "boolean",
        },
        ingredientIds: {
            type: "array",
            minItems: 0,
            uniqueItems: true,
            items: {
                type: "integer",
            },
        },
        sizes: {
            type: "array",
            minItems: 1,
            uniqueItems: true,
            items: {
                type: "object",
                properties: {
                    sizeId: {
                        type: "integer",
                    },
                    price: {
                        type: "number",
                        multipleOf: 0.01,
                        minimum: 0.01,
                    },
                    kcal: {
                        type: "number",
                        multipleOf: 0.01,
                        minimum: 0.01,
                    }
                },
                required: [
                    "sizeId",
                    "price",
                    "kcal",
                ],
                additionalProperties: false,
            },
        }
    },
    required: [
        "name",
        "description",
        "isActive",
        "ingredientIds",
        "sizes",
    ],
    additionalProperties: false,
});

export { EditItemValidator };
