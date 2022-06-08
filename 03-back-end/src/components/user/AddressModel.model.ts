import IModel from "../../common/IModel.interface";
import UserModel from "./UserModel.model";

export default class AddressModel implements IModel {
    addressId: number;
    userId: number;

    streetAndNmber: string;
    floor?: number | null;
    apartment?: number | null;
    city: string;
    phoneNumber: string;
    isActive: boolean;

    user?: UserModel;
}
