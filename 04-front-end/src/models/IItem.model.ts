import ICategory from "./ICategory.model";
import IIngredient from "./IIngredient.model";
import ISize from "./ISize.model";

export default interface IItem {
    category?: ICategory | null;
    sizes: ISize[];
    ingredients: IIngredient[];
    photos: any[];
    itemId: number;
    name: string;
    description: string;
    categoryId: number;
    isActive: boolean;
}
