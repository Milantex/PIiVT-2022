import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv();
addFormats(ajv);

export interface IPasswordResetDto {
    email: string;
}

const PasswordResetValidator = ajv.compile({
    type: "object",
    properties: {
        email: {
            type: "string",
            format: "email",
        }
    },
    required: [
        "email",
    ],
    additionalProperties: false,
});

export { PasswordResetValidator };
