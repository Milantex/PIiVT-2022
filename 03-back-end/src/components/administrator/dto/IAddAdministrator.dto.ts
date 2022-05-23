import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export default interface IAddAdministrator extends IServiceData {
    username: string;
    password_hash: string;
}

export interface IAddAdministratorDto {
    username: string;
    password: string;
}

const AddAdministratorValidator = ajv.compile({
    type: "object",
    properties: {
        username: {
            type: "string",
            pattern: "^[a-z\-]{5,64}$",
        },
        password: {
            type: "string",
            pattern: "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$",
        }
    },
    required: [
        "username",
        "password",
    ],
    additionalProperties: false,
});

export { AddAdministratorValidator };
