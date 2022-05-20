import CategoryModel from "./CategoryModel.model";
import * as mysql2 from "mysql2/promise";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import IngredientService from "../ingredient/IngredientService.service";
import IAddCategory from "./dto/IAddCategory.dto";
import BaseService from "../../common/BaseService";

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
        return new Promise<CategoryModel>((resolve, reject) => {
            const sql: string = "INSERT `category` SET `name` = ?;";

            this.db.execute(sql, [ data.name ])
                .then(async result => {
                    const info: any = result;

                    const newCategoryId = +(info[0]?.insertId);

                    const newCategory: CategoryModel|null = await this.getById(newCategoryId, DefaultCategoryAdapterOptions);

                    if (newCategory === null) {
                        return reject({ message: 'Duplicate category name!', });
                    }

                    resolve(newCategory);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
}

export default CategoryService;
export { DefaultCategoryAdapterOptions };
