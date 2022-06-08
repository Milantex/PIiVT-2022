import IAddress from "./IAddress.model";

export default interface IUser {
    userId: number;
    email: string;
    forename: string;
    surname: string;
    passwordHash: string|null;
    isActive: boolean;
    activationCode: string|null;
    passwordResetCode: string|null;
    addresses: IAddress[];
}
