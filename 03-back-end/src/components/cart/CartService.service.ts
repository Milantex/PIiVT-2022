import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import ItemModel from "../item/ItemModel.model";
import SizeModel from "../size/SizeModel.model";
import CartModel, { ICartContentItem } from "./CartModel.model";

export interface ICartAdapterOptions extends IAdapterOptions {

}

interface IItemSizeItemData {
    item_size_id: number,
    item_id: number,
    size_id: number,
    kcal: number,
    price: number,
    is_active: number
}

interface ICartContentItemData {
    cart_id: number,
    item_size_id: number,
    quantity: number,
}

export default class CartService extends BaseService<CartModel, ICartAdapterOptions> {
    tableName(): string {
        return "cart";
    }

    protected adaptToModel(data: any, options: ICartAdapterOptions = {}): Promise<CartModel> {
        return new Promise(async (resolve, reject) => {
            const cart = new CartModel();

            cart.cartId = +data?.cart_id;
            cart.userId = +data?.user_id;
            cart.createdAt = new Date(data?.created_at);

            cart.isUsed = false;

            if (await this.services.order.getByCartId(cart.cartId)) {
                cart.isUsed = true;
            }

            cart.content = [];

            this.getAllFromTableByFieldNameAndValue<ICartContentItemData>("cart_content", "cart_id", cart.cartId)
            .then(async result => {
                if (result.length === 0) {
                    return cart;
                }

                for (let item of result) {
                    cart.content.push(await this.fillOutCartContentItemData(item));
                }

                return cart;
            })
            .then(cart => {
                resolve(cart);
            })
            .catch(error => {
                reject(error);
            });
        });
    }

    private async fillOutCartContentItemData(inputData: ICartContentItemData): Promise<ICartContentItem> {
        return new Promise((resolve, reject) => {
            this.getAllFromTableByFieldNameAndValue<IItemSizeItemData>("item_size", "item_size_id", inputData.item_size_id)
            .then(itemSizes => {
                if (itemSizes.length === 0) {
                    throw {
                        status: 404,
                        message: "Item size not found!"
                    }
                }

                return itemSizes[0];
            })
            .then(itemSize => {
                return new Promise<{
                    item: ItemModel,
                    itemSize: {
                        item_id: number,
                        size_id: number,
                        kcal: number,
                        price: number,
                        is_active: number,
                    }
                }>(resolve => {
                    this.services.item.getById(itemSize.item_id, {
                        loadCategory: true,
                        loadIngredients: true,
                        loadPhotos: true,
                        loadSizes: false,
                        hideInactiveSizes: true,
                    })
                    .then(item => {
                        resolve({
                            item: item,
                            itemSize: itemSize,
                        });
                    });
                });
            })
            .then(data => {
                if (data.item === null) {
                    throw {
                        status: 404,
                        message: "Item not found!"
                    }
                }

                return data;
            })
            .then(data => {
                return new Promise<{
                    item: ItemModel,
                    size: SizeModel,
                    itemSize: {
                        item_id: number;
                        size_id: number;
                        kcal: number;
                        price: number;
                        is_active: number;
                    },
                }>(resolve => {
                    this.services.size.getById(data.itemSize.size_id, {})
                    .then(size => {
                        if (size === null) {
                            throw {
                                status: 404,
                                message: "Size not found!"
                            }
                        }

                        resolve({
                            item: data.item,
                            size: size,
                            itemSize: data.itemSize,
                        });
                    })
                });
            })
            .then(data => {
                resolve({
                    item: data.item,
                    size: {
                        size: data.size,
                        kcal: data.itemSize.kcal,
                        price: data.itemSize.price,
                        isActive: data.itemSize.is_active === 1,
                    },
                    quantity: inputData.quantity,
                });
            })
            .catch(error => {
                reject({
                    status: error?.status ?? 500,
                    message: error?.message,
                });
            });
        });
    }
    
    async getUserCart(id: number): Promise<CartModel> {
        return new Promise((resolve, reject) => {
            this.getAllByUserId(id)
            .then(carts => {
                if (carts.length === 0) {
                    return this.createNewCart(id);
                }

                const lastCart = carts[carts.length - 1];

                if (lastCart.isUsed) {
                    return this.createNewCart(id);
                }

                return lastCart;
            })
            .then(cart => {
                resolve(cart);
            })
            .catch(error => {
                reject(error);
            });
        });
    }

    async getAllByUserId(userId: number, options: ICartAdapterOptions = {}): Promise<CartModel[]> {
        return this.getAllByFieldNameAndValue("user_id", userId, options);
    }

    private async createNewCart(userId: number): Promise<CartModel> {
        return this.baseAdd(
            { user_id: userId },
            { }
        );
    }
}
