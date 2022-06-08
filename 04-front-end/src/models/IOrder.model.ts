import IAddress from "./IAddress.model";
import ICart from "./ICart.model";

export default interface IOrder {
    orderId: number;
    cartId: number;
    addressId: number;
    createdAt: string;
    deliverAt: string;
    note: string;
    status: 'pending' | 'canceled' | 'accepted' | 'rejected' | 'sent';
    markValue?: 1 | 2 | 3 | 4 | 5 | null;
    markNote?: string | null;
    cart: ICart;
    address: IAddress;
}
