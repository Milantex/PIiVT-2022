import IIngredient from "./IIngredient.model";

export default interface ICategory {
    categoryId: number;
    name: string;
    ingredients?: IIngredient[];
}
