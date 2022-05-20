import IModel from "../../common/IModel.interface";
import IngredientModel from "../ingredient/IngredientModel.model";

export default class CategoryModel implements IModel {
    categoryId: number;
    name: string;

    ingredients?: IngredientModel[];
}
