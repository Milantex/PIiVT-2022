import IModel from "../../common/IModel.interface";

export default class IngredientModel implements IModel {
    ingredientId: number;
    name: string;

    // FKs:
    categoryId: number;
}
