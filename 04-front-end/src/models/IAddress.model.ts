import IUser from "./IUser.model";

export default interface IAddress {
    addressId: number,
    userId: number,
    streetAndNmber: string,
    floor?: number | null,
    apartment?: number | null,
    city: string,
    phoneNumber: string,
    isActive: boolean,
    user?: IUser;
}

export function formatAddress(address: IAddress): string {
    return address.streetAndNmber +
           (address.apartment ? ", stan " + address.apartment : " ") +
           (address.floor ? ", sprat " + address.floor : " ") +
           ", " + address.city + " (" + address.phoneNumber + ")"
}
