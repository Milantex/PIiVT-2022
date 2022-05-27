import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export interface IAddSizeDto {
    name: string;
}

export default interface IAddSize extends IServiceData {
    name: string;
}

const AddSizeValidator = ajv.compile({
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

export { AddSizeValidator };
