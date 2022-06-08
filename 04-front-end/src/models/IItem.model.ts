import ICategory from "./ICategory.model";
import IIngredient from "./IIngredient.model";
import IPhoto from "./IPhoto.model";
import ISize from "./ISize.model";

export default interface IItem {
    category?: ICategory | null;
    sizes: ISize[];
    ingredients: IIngredient[];
    photos: IPhoto[];
    itemId: number;
    name: string;
    description: string;
    categoryId: number;
    isActive: boolean;
}
