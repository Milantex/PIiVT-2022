import IModel from "../../common/IModel.interface";
import ItemModel, { IItemSize } from "../item/ItemModel.model";

export interface ICartContentItem {
    item: ItemModel;
    size: IItemSize;
    quantity: number;
}

export default class CartModel implements IModel {
    cartId: number;
    userId: number;
    createdAt: Date;

    content: ICartContentItem[];

    isUsed: boolean;
}
