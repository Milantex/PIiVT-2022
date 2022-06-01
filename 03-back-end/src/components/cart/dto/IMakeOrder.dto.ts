import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export interface IMakeOrderDto {
    addressId: number;
    deliverAt: string;
}

export interface IAddOrder extends IServiceData {
    address_id: number;
    deliver_at: string;
    cart_id: number;
}

const MakeOrderValidator = ajv.compile({
    type: "object",
    properties: {
        addressId: {
            type: "integer",
        },
        deliverAt: {
            type: "string",
            pattern: "[12][0-9]:[0-9]{2}",
        },
    },
    required: [
        "addressId",
        "deliverAt",
    ],
    additionalProperties: false,
});

export { MakeOrderValidator };
