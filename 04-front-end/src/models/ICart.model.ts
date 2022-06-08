import IItem from "./IItem.model";
import ISize from "./ISize.model";

interface ICartContent {
    item: IItem;
    size: ISize;
    quantity: number;
}

export default interface ICart {
    cartId: number;
    userId: number;
    createdAt: string;
    content: ICartContent[];
    isUsed: boolean;
}
