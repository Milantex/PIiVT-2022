import { resolve } from "path";
import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import { IItemSize } from "../item/ItemModel.model";
import SizeModel from "./SizeModel.model";

export interface ISizeAdapterOptions extends IAdapterOptions {

}

export default class SizeService extends BaseService<SizeModel, ISizeAdapterOptions> {
    tableName(): string {
        return "size";
    }

    protected async adaptToModel(data: any, options: ISizeAdapterOptions): Promise<SizeModel> {
        const size = new SizeModel();

        size.sizeId = +data?.size_id;
        size.name = data?.name;

        return size;
    }

    public async getAllByItemId(itemId: number, options: ISizeAdapterOptions): Promise<IItemSize[]> {
        return new Promise((resolve, reject) => {
            this.getAllFromTableByFieldNameAndValue<{
                item_size_id: number,
                item_id: number,
                size_id: number,
                price: number,
                kcal: number,
                is_active: number,
            }>("item_size", "item_id", itemId)
            .then(async result => {
                if (result.length === 0) {
                    return resolve([]);
                }

                const items: IItemSize[] = await Promise.all(
                    result.map(async row => {
                        // Dok nemamo cache:
                        const size = await (await this.getById(row.size_id, {})); // Kada budemo imali cache, to ce biti npr. cache.get('size-' + row.size_id)

                        return {
                            size: {
                                sizeId: row.size_id,
                                name: size.name,
                            },
                            price: row.price,
                            kcal: row.kcal,
                            isActive: row.is_active === 1,
                        }
                    })
                );

                resolve(items);
            })
            .catch(error => {
                reject(error);
            });
        })
    }

    public async getAllBySizeId(sizeId: number, options: ISizeAdapterOptions): Promise<IItemSize[]> {
        return new Promise((resolve, reject) => {
            this.getAllFromTableByFieldNameAndValue<{
                item_size_id: number,
                item_id: number,
                size_id: number,
                price: number,
                kcal: number,
                is_active: number,
            }>("item_size", "size_id", sizeId)
            .then(async result => {
                if (result.length === 0) {
                    return resolve([]);
                }

                const items: IItemSize[] = await Promise.all(
                    result.map(async row => {
                        // Dok nemamo cache:
                        const size = await (await this.getById(row.size_id, {})); // Kada budemo imali cache, to ce biti npr. cache.get('size-' + row.size_id)

                        return {
                            size: {
                                sizeId: row.size_id,
                                name: size.name,
                            },
                            price: row.price,
                            kcal: row.kcal,
                            isActive: row.is_active === 1,
                        }
                    })
                );

                resolve(items);
            })
            .catch(error => {
                reject(error);
            });
        })
    }

    public async hideItemSize(itemId: number, sizeId: number): Promise<true> {
        return new Promise(resolve => {
            const sql = "UPDATE item_size SET is_active = 0 WHERE item_id = ? AND size_id = ?;";

            this.db.execute(sql, [ itemId, sizeId ])
            .then(result => {
                const info: any = result;
                
                if (+(info[0]?.affectedRows) === 1) {
                    return resolve(true);
                }

                throw {
                    status: 500,
                    message: "Could not hide this item size record!",
                }
            })
            .catch(error => {
                throw {
                    status: 500,
                    message: error?.message,
                }
            });
        })
    }

    public async showItemSize(itemId: number, sizeId: number): Promise<true> {
        return new Promise(resolve => {
            const sql = "UPDATE item_size SET is_active = 1 WHERE item_id = ? AND size_id = ?;";

            this.db.execute(sql, [ itemId, sizeId ])
            .then(result => {
                const info: any = result;
                
                if (+(info[0]?.affectedRows) === 1) {
                    return resolve(true);
                }

                throw {
                    status: 500,
                    message: "Could not hide this item size record!",
                }
            })
            .catch(error => {
                throw {
                    status: 500,
                    message: error?.message,
                }
            });
        })
    }
}
