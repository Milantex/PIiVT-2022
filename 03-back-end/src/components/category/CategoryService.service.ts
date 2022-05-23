import CategoryModel from "./CategoryModel.model";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import IngredientService from "../ingredient/IngredientService.service";
import IAddCategory from "./dto/IAddCategory.dto";
import BaseService from "../../common/BaseService";
import IEditCategory from "./dto/IEditCategory.dto";

interface ICategoryAdapterOptions extends IAdapterOptions {
    loadIngredients: boolean;
}

const DefaultCategoryAdapterOptions: ICategoryAdapterOptions = {
    loadIngredients: false,
}

class CategoryService extends BaseService<CategoryModel, ICategoryAdapterOptions> {
    tableName(): string {
        return "category";
    }

    protected async adaptToModel(data: any, options: ICategoryAdapterOptions = DefaultCategoryAdapterOptions): Promise<CategoryModel> {
        const category: CategoryModel = new CategoryModel();

        category.categoryId = +data?.category_id;
        category.name = data?.name;

        if (options.loadIngredients) {
            const ingredientService: IngredientService = new IngredientService(this.db);

            // Async/Await pristup:
            category.ingredients = await ingredientService.getAllByCategoryId(category.categoryId, {});
        }

        return category;
    }

    public async add(data: IAddCategory): Promise<CategoryModel> {
        return this.baseAdd(data, DefaultCategoryAdapterOptions);
    }

    public async editById(categoryId: number, data: IEditCategory, options: ICategoryAdapterOptions = DefaultCategoryAdapterOptions): Promise<CategoryModel> {
        return this.baseEditById(categoryId, data, options);
    }
}

export default CategoryService;
export { DefaultCategoryAdapterOptions };
