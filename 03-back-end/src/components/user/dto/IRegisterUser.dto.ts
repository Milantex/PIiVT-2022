import Ajv from "ajv";
import addFormats from "ajv-formats";
// import * as formats from "ajv-formats-draft2019/formats"; // Za IDN podrsku: npm i ajv-formats-draft2019
import IServiceData from "../../../common/IServiceData.interface";

// const ajv = new Ajv({ formats }); // Za IDN podrsku
const ajv = new Ajv();
addFormats(ajv);

export interface IRegisterUserDto {
    email: string;
    password: string;
    forename: string;
    surname: string;
}

export interface IAddUser extends IServiceData {
    email: string;
    password_hash: string;
    forename: string;
    surname: string;
    activation_code: string;
}

const RegisterUserValidator = ajv.compile({
    type: "object",
    properties: {
        email: {
            type: "string",
            // format: "idn-email", // Za IDN podrsku
            format: "email",
        },
        password: {
            type: "string",
            pattern: "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$",
        },
        forename: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
        surname: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
    },
    required: [
        "email",
        "password",
        "forename",
        "surname",
    ],
    additionalProperties: false,
});

export { RegisterUserValidator };
