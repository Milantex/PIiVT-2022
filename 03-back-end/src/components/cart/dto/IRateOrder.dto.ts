import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

interface IRateOrderDto {
    value: number;
    note: string;
}

interface IRateOrder extends IServiceData {
    mark_value: string,
    mark_note: string,
}

const RateOrderValidator = ajv.compile({
    type: "object",
    properties: {
        value: {
            type: "integer",
            minimum: 1,
            maximum: 5
        },
        note: {
            type: "string",
            minLength: 0,
            maxLength: 2000,
        },
    },
    required: [
        "value",
        "note",
    ],
    additionalProperties: false,
});

export { IRateOrderDto, IRateOrder, RateOrderValidator };
