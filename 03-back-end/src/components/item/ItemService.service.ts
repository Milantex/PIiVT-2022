import BaseService from "../../common/BaseService"
import IAdapterOptions from "../../common/IAdapterOptions.interface"
import IAddItem, { IItemIngredient, IItemSize } from "./dto/IAddItem.dto";
import ItemModel from "./ItemModel.model"

export interface IItemAdapterOptions extends IAdapterOptions {
    loadCategory: boolean,
    loadSizes: boolean,
    loadIngredients: boolean,
}

export class DefaultItemAdapterOptions implements IItemAdapterOptions {
    loadCategory: false;
    loadSizes: false;
    loadIngredients: false;
}

export default class ItemService extends BaseService<ItemModel, IItemAdapterOptions> {
    tableName(): string {
        return "item";
    }

    protected adaptToModel(data: any, options: IItemAdapterOptions): Promise<ItemModel> {
        return new Promise(async (resolve) => {
            const item = new ItemModel();

            item.itemId      = +data?.item_id;
            item.name        = data?.name;
            item.description = data?.description;
            item.categoryId  = +data?.category_id;
            item.isActive    = +data?.is_active === 1;

            if (options.loadCategory) {
                item.category = await this.services.category.getById(item.categoryId, {
                    loadIngredients: true,
                });
            }

            if (options.loadSizes) {
                console.log(this.services);

                item.sizes = await this.services.size.getAllByItemId(item.itemId, {});
            }

            if (options.loadIngredients) {
                item.ingredients = await this.services.ingredient.getAllByItemId(item.itemId, {});
            }

            resolve(item);
        })
    }

    async getAllByCategoryId(categoryId: number, options: IItemAdapterOptions) {
        return this.getAllByFieldNameAndValue("category_id", categoryId, options);
    }

    async add(data: IAddItem): Promise<ItemModel> {
        return this.baseAdd(data, {
            loadCategory: false,
            loadSizes: false,
            loadIngredients: false,
        });
    }

    async addItemIngredient(data: IItemIngredient): Promise<number> {
        return new Promise((resolve, reject) => {
            const sql: string = "INSERT item_ingredient SET item_id = ?, ingredient_id = ?;";

            this.db.execute(sql, [ data.item_id, data.ingredient_id ])
            .then(async result => {
                const info: any = result;
                resolve(+(info[0]?.insertId));
            })
            .catch(error => {
                reject(error);
            });
        })
    }

    async addItemSize(data: IItemSize): Promise<number> {
        return new Promise((resolve, reject) => {
            const sql: string = "INSERT item_size SET item_id = ?, size_id = ?, price = ?, kcal = ?;";

            this.db.execute(sql, [ data.item_id, data.size_id, data.price, data.kcal ])
            .then(async result => {
                const info: any = result;
                resolve(+(info[0]?.insertId));
            })
            .catch(error => {
                reject(error);
            });
        })
    }
}
