import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export default interface IEditSize extends IServiceData {
    name: string;
}

interface IEditSizeDto {
    name: string;
}

const EditSizeValidator = ajv.compile({
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

export {
    EditSizeValidator,
    IEditSizeDto,
};
