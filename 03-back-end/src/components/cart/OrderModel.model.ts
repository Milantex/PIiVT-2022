import IModel from "../../common/IModel.interface";
import CartModel from "./CartModel.model";

export default class OrderModel implements IModel {
    orderId: number;
    cartId: number;
    addressId: number;

    createdAt: Date;
    deliverAt: Date;

    note: string;

    status: 'pending' | 'canceled' | 'accepted' | 'rejected' | 'sent';

    markValue?: 1 | 2 | 3 | 4 | 5;
    markNote?: string;

    cart: CartModel;
}
