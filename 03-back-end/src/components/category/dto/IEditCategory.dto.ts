import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export default interface IEditCategory extends IServiceData {
    name: string;
}

interface IEditCategoryDto {
    name: string;
}

const EditCategoryValidator = ajv.compile({
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
    EditCategoryValidator,
    IEditCategoryDto,
};
