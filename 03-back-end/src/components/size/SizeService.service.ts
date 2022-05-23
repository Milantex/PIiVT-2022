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
                kcal: number
            }>("item_size", "item_id", itemId)
            .then(async result => {
                if (result.length === 0) {
                    return resolve([]);
                }

                const items: IItemSize[] = await Promise.all(
                    result.map(async row => {
                        return {
                            size: {
                                sizeId: row.size_id,
                                // Dok nemamo cache:
                                name: await (await this.getById(row.size_id, {})).name, // Kada budemo imali cache, to ce biti npr. cache.get('size-' + row.size_id).name
                            },
                            price: row.price,
                            kcal: row.kcal
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
                kcal: number
            }>("item_size", "size_id", sizeId)
            .then(async result => {
                if (result.length === 0) {
                    return resolve([]);
                }

                const items: IItemSize[] = await Promise.all(
                    result.map(async row => {
                        return {
                            size: {
                                sizeId: row.size_id,
                                // Dok nemamo cache:
                                name: await (await this.getById(row.size_id, {})).name, // Kada budemo imali cache, to ce biti npr. cache.get('size-' + row.size_id).name
                            },
                            price: row.price,
                            kcal: row.kcal
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
}
