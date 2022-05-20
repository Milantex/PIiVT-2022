import IngredientModel from "./IngredientModel.model";
import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import { IAddCategoryServiceDto } from "../category/dto/IAddCategory.dto";

class IngredientAdapterOptions implements IAdapterOptions {

}

class IngredientService extends BaseService<IngredientModel, IngredientAdapterOptions> {
    tableName(): string {
        return "ingredient";
    }

    protected async adaptToModel(data: any): Promise<IngredientModel> {
        const ingredient: IngredientModel = new IngredientModel();

        ingredient.ingredientId = +data?.ingredient_id;
        ingredient.name = data?.name;
        ingredient.categoryId = data?.category_id;

        return ingredient;
    }

    public async getAllByCategoryId(categoryId: number, options: IngredientAdapterOptions): Promise<IngredientModel[]> {
        return this.getAllByFieldNameAnValue('category_id', categoryId, options);
    }

    public async add(data: IAddCategoryServiceDto): Promise<IngredientModel> {
        return new Promise<IngredientModel>((resolve, reject) => {
            const sql: string = "INSERT `ingredient` SET `name` = ?, `category_id` = ?;";

            this.db.execute(sql, [ data.name, data.categoryId ])
                .then(async result => {
                    const info: any = result;

                    const newIngredientId = +(info[0]?.insertId);

                    const newIngredient: IngredientModel|null = await this.getById(newIngredientId, {});

                    if (newIngredient === null) {
                        return reject({ message: 'Duplicate ingredient name in this category!', });
                    }

                    resolve(newIngredient);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
}

export default IngredientService;
