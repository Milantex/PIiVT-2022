export default interface IAddress {
    addressId: number,
    userId: number,
    streetAndNmber: string,
    floor?: number | null,
    apartment?: number | null,
    city: string,
    phoneNumber: string,
    isActive: boolean,
}
