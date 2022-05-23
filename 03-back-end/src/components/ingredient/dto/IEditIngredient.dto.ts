import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export interface IEditIngredientDto {
    name: string;
}

export default interface IEditIngredient extends IServiceData {
    name: string;
}

const EditIngredientValidator = ajv.compile({
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

export { EditIngredientValidator };
