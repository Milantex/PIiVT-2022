import { resolve } from "path";
import BaseService from "../../common/BaseService"
import IAdapterOptions from "../../common/IAdapterOptions.interface"
import { DevConfig } from "../../configs";
import IAddItem, { IItemIngredient, IItemSize } from "./dto/IAddItem.dto";
import IEditItem from "./dto/IEditItem.dto";
import ItemModel from "./ItemModel.model"

export interface IItemAdapterOptions extends IAdapterOptions {
    loadCategory: boolean,
    loadSizes: boolean,
    hideInactiveSizes: boolean,
    loadIngredients: boolean,
    loadPhotos: boolean,
}

export const DefaultItemAdapterOptions: IItemAdapterOptions = {
    loadCategory: false,
    loadSizes: false,
    hideInactiveSizes: true,
    loadIngredients: false,
    loadPhotos: false,
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
                item.sizes = await this.services.size.getAllByItemId(item.itemId, {});

                if (options.hideInactiveSizes) {
                    item.sizes = item.sizes.filter(sizeInfo => sizeInfo.isActive);
                }
            }

            if (options.loadIngredients) {
                item.ingredients = await this.services.ingredient.getAllByItemId(item.itemId, {});
            }

            if (options.loadPhotos) {
                item.photos = await this.services.photo.getAllByItemId(item.itemId);
            }

            resolve(item);
        })
    }

    async getAllByCategoryId(categoryId: number, options: IItemAdapterOptions) {
        return this.getAllByFieldNameAndValue("category_id", categoryId, options);
    }

    async add(data: IAddItem): Promise<ItemModel> {
        return this.baseAdd(data, DefaultItemAdapterOptions);
    }

    async edit(itemId: number, data: IEditItem, options: IItemAdapterOptions): Promise<ItemModel> {
        return this.baseEditById(itemId, data, options);
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

    async deleteItemIngredient(data: IItemIngredient): Promise<number> {
        return new Promise((resolve, reject) => {
            const sql: string = "DELETE FROM item_ingredient WHERE item_id = ? AND ingredient_id = ?;";

            this.db.execute(sql, [ data.item_id, data.ingredient_id ])
            .then(async result => {
                const info: any = result;
                resolve(+(info[0]?.affectedRows));
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

    async editItemSize(data: IItemSize): Promise<true> {
        return new Promise((resolve, reject) => {
            const sql: string = "UPDATE item_size SET price = ?, kcal = ? WHERE item_id = ? AND size_id = ?;";

            this.db.execute(sql, [ data.price, data.kcal, data.item_id, data.size_id ])
            .then(result => {
                const info: any = result;

                if (+info[0]?.affectedRows === 1) {
                    return resolve(true);
                }

                throw {
                    status: 500,
                    message: "Could not edit this item size record!",
                }
            })
            .catch(error => {
                reject(error);
            });
        })
    }

    async deleteById(itemId: number): Promise<{ filesToDelete: string[] }> {
        return new Promise(resolve => {
            this.deleteAllOrdersByItemId(itemId)
            .then(() => this.deleteCartContentByItemId(itemId))
            .then(() => this.deleteCartsByItemId(itemId))
            .then(() => this.deleteAllItemIngredientsByItemId(itemId))
            .then(() => this.deleteAllItemSizesByItemId(itemId))
            .then(() => this.getById(itemId, {
                loadIngredients: false,
                loadSizes: false,
                hideInactiveSizes: false,
                loadCategory: false,
                loadPhotos: true, // !
            }))
            .then(item => {
                if (item === null) throw { status: 404, message: "Item not found!" }
                return item;
            })
            .then(async item => {
                const filesToDelete = item.photos.map(photo => DevConfig.server.static.path + "/" + photo.filePath);

                for (let photo of item.photos) {
                    await this.services.photo.deleteById(photo.photoId);
                }

                return filesToDelete;
            })
            .then(async filesToDelete => {
                await this.baseDeleteById(itemId);
                return filesToDelete;
            })
            .then(filesToDelete => {
                resolve({
                    filesToDelete: filesToDelete,
                });
            })
            .catch(error => {
                throw {
                    message: error?.message ?? "Could not delete this item!",
                }
            });
        })
    }

    private async deleteAllOrdersByItemId(itemId: number): Promise<true> {
        return new Promise(resolve => {
            const sql = `DELETE FROM \`order\` WHERE \`order\`.cart_id IN (
                            SELECT
                                cart.cart_id
                            FROM
                                cart
                            INNER JOIN cart_content ON cart.cart_id = cart_content.cart_id
                            INNER JOIN item_size ON cart_content.item_size_id = item_size.item_size_id
                            WHERE
                                item_size.item_id = ?
                        );`;
            this.db.execute(sql, [ itemId ])
            .then(() => {
                resolve(true);
            })
            .catch(error => {
                throw {
                    message: error?.message ?? "Could not delete orders!",
                }
            });
        })
    }

    private async deleteCartContentByItemId(itemId: number): Promise<true> {
        return new Promise(resolve => {
            const sql = `DELETE FROM cart_content WHERE cart_content.item_size_id IN (
                            SELECT
                                item_size_id
                            FROM
                                item_size
                            WHERE
                                item_size.item_id = ?
                        );`;
            this.db.execute(sql, [ itemId ])
            .then(() => {
                resolve(true);
            })
            .catch(error => {
                throw {
                    message: error?.message ?? "Could not delete cart content!",
                }
            });
        })
    }

    private async deleteCartsByItemId(itemId: number): Promise<true> {
        return new Promise(resolve => {
            const sql = `DELETE FROM cart WHERE cart.cart_id IN (
                            SELECT
                                cart.cart_id
                            FROM
                                cart
                            INNER JOIN cart_content ON cart.cart_id = cart_content.cart_id
                            INNER JOIN item_size ON cart_content.item_size_id = item_size.item_size_id
                            WHERE
                                item_size.item_id = ?
                        );`;
            this.db.execute(sql, [ itemId ])
            .then(() => {
                resolve(true);
            })
            .catch(error => {
                throw {
                    message: error?.message ?? "Could not delete carts!",
                }
            });
        })
    }

    private async deleteAllItemIngredientsByItemId(itemId: number): Promise<true> {
        return new Promise(resolve => {
            const sql = `DELETE FROM item_ingredient WHERE item_id = ?;`;
            this.db.execute(sql, [ itemId ])
            .then(() => {
                resolve(true);
            })
            .catch(error => {
                throw {
                    message: error?.message ?? "Could not delete item ingredients!",
                }
            });
        })
    }

    private async deleteAllItemSizesByItemId(itemId: number): Promise<true> {
        return new Promise(resolve => {
            const sql = `DELETE FROM item_size WHERE item_id = ?;`;
            this.db.execute(sql, [ itemId ])
            .then(() => {
                resolve(true);
            })
            .catch(error => {
                throw {
                    message: error?.message ?? "Could not delete item sizes!",
                }
            });
        })
    }
}
