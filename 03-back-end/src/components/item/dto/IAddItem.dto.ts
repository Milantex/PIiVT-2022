import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export interface IAddItemDto {
    name: string;
    description: string;
    ingredientIds: number[];
    sizes: {
        sizeId: number;
        price: number;
        kcal: number;
    }[];
}

export default interface IAddItem extends IServiceData {
    name: string;
    description: string;
    category_id: number;
}

export interface IItemIngredient extends IServiceData {
    item_id: number;
    ingredient_id: number;
}

export interface IItemSize extends IServiceData {
    item_id: number;
    size_id: number;
    price: number;
    kcal: number;
}

const AddItemValidator = ajv.compile({
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
        "ingredientIds",
        "sizes",
    ],
    additionalProperties: false,
});

export { AddItemValidator };
