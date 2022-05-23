import IModel from "../../common/IModel.interface";
import CategoryModel from "../category/CategoryModel.model";
import IngredientModel from "../ingredient/IngredientModel.model";
import SizeModel from "../size/SizeModel.model";

export interface IItemSize {
    size: SizeModel,
    price: number;
    kcal: number;
}

export default class ItemModel implements IModel {
    itemId: number;
    name: string;
    description: string;
    categoryId: number;
    isActive: boolean;

    category?: CategoryModel = null;
    sizes?: IItemSize[] = [];
    ingredients?: IngredientModel[] = [];
}
