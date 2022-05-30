import Ajv from "ajv";

const ajv = new Ajv();

export interface IAdministratorLoginDto {
    username: string;
    password: string;
}

const AdministratorLoginValidator = ajv.compile({
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

export { AdministratorLoginValidator };
