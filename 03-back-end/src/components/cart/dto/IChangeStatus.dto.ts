import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

interface IChangeStatusDto {
    status: 'pending' | 'canceled' | 'accepted' | 'rejected' | 'sent';
}

interface IChangeStatus extends IServiceData {
    status: 'pending' | 'canceled' | 'accepted' | 'rejected' | 'sent';
}

const ChangeStatusValidator = ajv.compile({
    type: "object",
    properties: {
        status: {
            type: "string",
            enum: [ 'pending', 'canceled', 'accepted', 'rejected', 'sent' ]
        },
    },
    required: [
        "status",
    ],
    additionalProperties: false,
});

export { IChangeStatusDto, IChangeStatus, ChangeStatusValidator };
