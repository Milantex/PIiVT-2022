import Ajv from "ajv";
import addFormats from "ajv-formats";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();
addFormats(ajv);

export interface IEditAddressDto {
    streetAndNmber: string;
    floor?: number | null;
    apartment?: number | null;
    city: string;
    phoneNumber: string;
    isActive?: boolean;
}

export interface IEditAddress extends IServiceData {
    user_id: number;
    street_and_nmber: string;
    floor: number | null;
    apartment: number | null;
    city: string;
    phone_number: string;
    is_active: number;
}

const EditAddressValidator = ajv.compile({
    type: "object",
    properties: {
        streetAndNmber: {
            type: "string",
            minLength: 2,
            maxLength: 255,
        },
        floor: {
            type: "integer",
            nullable: true,
        },
        apartment: {
            type: "integer",
            nullable: true,
        },
        city: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
        phoneNumber: {
            type: "string",
            pattern: "\\+[0-9]{8,23}",
        },
        isActive: {
            type: "boolean",
        },
    },
    required: [
        "streetAndNmber",
        "city",
        "phoneNumber",
    ],
    additionalProperties: false,
});

export { EditAddressValidator };
