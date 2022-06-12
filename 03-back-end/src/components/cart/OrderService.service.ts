import { IRateOrder } from './dto/IRateOrder.dto';
import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import { IAddOrder } from "./dto/IMakeOrder.dto";
import OrderModel from "./OrderModel.model";
import { IChangeStatus } from './dto/IChangeStatus.dto';

export interface IOrderAdapterOptions extends IAdapterOptions {
    loadCartData: boolean;
}

export const DefaultOrderAdapterOptions: IOrderAdapterOptions = {
    loadCartData: true,
}

export default class OrderService extends BaseService<OrderModel, IOrderAdapterOptions> {
    tableName(): string {
        return "order";
    }

    protected adaptToModel(data: any, options: IOrderAdapterOptions = DefaultOrderAdapterOptions): Promise<OrderModel> {
        return new Promise(async resolve => {
            const order = new OrderModel();

            order.orderId   = +data?.order_id;
            order.cartId    = +data?.cart_id;
            order.addressId = +data?.address_id;
            order.createdAt = new Date(data?.created_at);
            order.deliverAt = new Date(data?.deliver_at);

            order.note = data?.note;
            order.status = data?.status;

            order.markValue = +data?.mark_value as 1 | 2 | 3 | 4 | 5;
            order.markNote  = data?.mark_note;

            if (options.loadCartData) {
                order.cart = await this.services.cart.getById(order.cartId, {});
            }

            order.address = await this.services.address.getById(order.addressId, { loadUserData: true, });

            resolve(order);
        });
    }

    public async getByCartId(cartId: number, options: IOrderAdapterOptions = { loadCartData: false, }): Promise<OrderModel|null> {
        return new Promise((resolve, reject) => {
            this.getAllByFieldNameAndValue("cart_id", cartId, options)
            .then(result => {
                if (result.length === 0) {
                    return resolve(null);
                }

                resolve(result[0]);
            })
            .catch(error => {
                reject(error);
            });
        });
    }

    public async makeOrder(data: IAddOrder): Promise<OrderModel> {
        return new Promise((resolve, reject) => {
            this.baseAdd(data, {
                loadCartData: true,
            })
            .then(result => {
                resolve(result);
            })
            .catch(error => {
                reject(error);
            });
        });
    }

    public async getAllByUserId(userId: number): Promise<OrderModel[]> {
        return new Promise(resolve => {
            this.services.cart.getAllByUserId(userId)
            .then(async carts => {
                const orders = [];

                for (let cart of carts) {
                    const order = await this.getByCartId(cart.cartId, { loadCartData: true, });
                    if (order) {
                        orders.push(order);
                    }
                }

                resolve(orders);
            })
        })
    }

    public async rateOrderById(orderId: number, data: IRateOrder, options: IOrderAdapterOptions): Promise<OrderModel> {
        return this.baseEditById(orderId, data, options);
    }

    public async changeStatusById(orderId: number, data: IChangeStatus, options: IOrderAdapterOptions): Promise<OrderModel> {
        return this.baseEditById(orderId, data, options);
    }
}
