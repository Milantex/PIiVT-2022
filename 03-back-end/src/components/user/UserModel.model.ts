import IModel from "../../common/IModel.interface";
import AddressModel from "./AddressModel.model";

export default class UserModel implements IModel {
    userId: number;
    email: string;
    passwordHash: string | null;
    forename: string;
    surname: string;
    isActive: boolean;
    activationCode: string | null;
    passwordResetCode: string | null;
    addresses?: AddressModel[];
}
