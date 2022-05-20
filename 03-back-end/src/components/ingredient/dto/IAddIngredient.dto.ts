import Ajv from "ajv";

const ajv = new Ajv();

export default interface IAddIngredient {
    name: string;
}

const AddIngredientValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 4,
            maxLength: 32,
        },
    },
    required: [
        "name",
    ],
    additionalProperties: false,
});

export { AddIngredientValidator };
