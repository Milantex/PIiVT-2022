import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import { AddItemValidator, IAddItemDto } from "./dto/IAddItem.dto";
import { fstat, mkdirSync, readFileSync, unlinkSync } from "fs";
import { UploadedFile } from "express-fileupload";
import filetype from 'magic-bytes.js'
import { extname, basename, dirname } from "path";
import sizeOf from "image-size";
import * as uuid from "uuid";
import PhotoModel from "../photo/PhotoModel.model";
import IConfig, { IResize } from "../../common/IConfig.interface";
import { DevConfig } from "../../configs";
import * as sharp from "sharp";
import CategoryModel from "../category/CategoryModel.model";
import ItemModel from "./ItemModel.model";
import { EditItemValidator, IEditItemDto } from "./dto/IEditItem.dto";
import { DefaultCategoryAdapterOptions } from "../category/CategoryService.service";
import { DefaultItemAdapterOptions } from "./ItemService.service";

export default class ItemController extends BaseController {
    async getAllItemsByCategoryId(req: Request, res: Response) {
        const categoryId: number = +req.params?.cid;

        this.services.category.getById(categoryId, { loadIngredients: false })
        .then(result => {
            if (result === null) {
                return res.status(404).send("Category not found!");
            }

            this.services.item.getAllByCategoryId(categoryId, {
                loadCategory: false,
                loadIngredients: true,
                loadSizes: true,
                hideInactiveSizes: true,
                loadPhotos: true,
            })
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                res.status(500).send(error?.message);
            });
        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
    }

    async getItemById(req: Request, res: Response) {
        const categoryId: number = +req.params?.cid;
        const itemId: number = +req.params?.iid;

        this.services.category.getById(categoryId, { loadIngredients: false })
        .then(result => {
            if (result === null) {
                return res.status(404).send("Category not found!");
            }

            this.services.item.getById(itemId, {
                loadCategory: true,
                loadIngredients: true,
                loadSizes: true,
                hideInactiveSizes: true,
                loadPhotos: true,
            })
            .then(result => {
                if (result === null) {
                    return res.status(404).send("Item not found!");
                }

                if (result.categoryId !== categoryId) {
                    return res.status(404).send("Item not found in this category!");
                }

                res.send(result);
            })
            .catch(error => {
                res.status(500).send(error?.message);
            });
        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
    }

    async add(req: Request, res: Response) {
        const categoryId: number = +req.params?.cid;
        const data               =  req.body as IAddItemDto;

        if (!AddItemValidator(data)) {
            return res.status(400).send(AddItemValidator.errors);
        }

        this.services.category.getById(categoryId, { loadIngredients: true })
        .then(resultCategory => {
            if (resultCategory === null) {
                throw {
                    status: 404,
                    message: "Category not found!",
                }
            }

            return resultCategory;
        })
        .then(resultCategory => {
            const availableIngredientIds: number[] = resultCategory.ingredients?.map(ingredient => ingredient.ingredientId);

            for (let givenIngredientId of data.ingredientIds) {
                if (!availableIngredientIds.includes(givenIngredientId)) {
                    throw {
                        status: 404,
                        message: `Ingredient ${givenIngredientId} not found in this category!`,
                    }
                }
            }

            return this.services.size.getAll({});
        })
        .then(sizes => {
            const availableSizeIds: number[] = sizes.map(size => size.sizeId);

            for (let givenSizeInformation of data.sizes) {
                if (!availableSizeIds.includes(givenSizeInformation.sizeId)) {
                    throw {
                        status: 404,
                        message: `Size with ID ${givenSizeInformation.sizeId} not found!`,
                    }
                }
            }
        })
        .then(() => {
            return this.services.item.startTransaction();
        })
        .then(() => {
            return this.services.item.add({
                name: data.name,
                category_id: categoryId,
                description: data.description,
            });
        })
        .then(newItem => {
            for (let givenIngredientId of data.ingredientIds) {
                this.services.item.addItemIngredient({
                    item_id: newItem.itemId,
                    ingredient_id: givenIngredientId,
                })
                .catch(error => {
                    throw {
                        status: 500,
                        message: error?.message
                    }
                });
            }

            return newItem;
        })
        .then(newItem => {
            for (let givenSizeInformation of data.sizes) {
                this.services.item.addItemSize({
                    item_id: newItem.itemId,
                    size_id: givenSizeInformation.sizeId,
                    price: givenSizeInformation.price,
                    kcal: givenSizeInformation.kcal,
                    is_active: 1,
                })
                .catch(error => {
                    throw {
                        status: 500,
                        message: error?.message
                    }
                });
            }

            return newItem;
        })
        .then(newItem => {
            return this.services.item.getById(newItem.itemId, {
                loadCategory: true,
                loadIngredients: true,
                loadSizes: true,
                hideInactiveSizes: true,
                loadPhotos: false,
            });
        })
        .then(async result => {
            await this.services.item.commitChanges();
            res.send(result);
        })
        .catch(async error => {
            await this.services.item.rollbackChanges();
            res.status(error?.status ?? 500).send(error?.message);
        })
    }

    async uploadPhoto(req: Request, res: Response) {
        const categoryId: number = +req.params?.cid;
        const itemId: number = +req.params?.iid;

        this.services.category.getById(categoryId, { loadIngredients: false })
        .then(result => {
            if (result === null) throw {
                code: 400,
                message: "Category not found!",
            };

            return result;
        })
        .then(() => {
            return this.services.item.getById(itemId, {
                loadCategory: false,
                loadIngredients: false,
                loadSizes: false,
                hideInactiveSizes: true,
                loadPhotos: false,
            });
        })
        .then(result => {
            if (result === null) throw {
                code: 404,
                message: "Item not found!",
            };

            if (result.categoryId !== categoryId) throw {
                code: 404,
                message: "Item not found in this category!",
            };

            return this.doFileUpload(req);
        })
        .then(async uploadedFiles => {
            const photos: PhotoModel[] = [];

            for (let singleFile of await uploadedFiles) {
                const filename = basename(singleFile);

                const photo = await this.services.photo.add({
                    name: filename,
                    file_path: singleFile,
                    item_id: itemId,
                });

                if (photo === null) {
                    throw {
                        code: 500,
                        message: "Failed to add this photo into the database!",
                    };
                }

                photos.push(photo);
            }

            res.send(photos);
        })
        .catch(error => {
            res.status(error?.code).send(error?.message);
        });
    }

    private async doFileUpload(req: Request): Promise<string[] | null> {
        const config: IConfig = DevConfig;

        if (!req.files || Object.keys(req.files).length === 0) throw {
            code: 400,
            message: "No file were uploaded!",
        };

        const fileFieldNames = Object.keys(req.files);

        const now = new Date();
        const year = now.getFullYear();
        const month = ((now.getMonth() + 1) + "").padStart(2, "0");

        const uploadDestinationRoot = config.server.static.path + "/";
        const destinationDirectory  = config.fileUploads.destinationDirectoryRoot + year + "/" + month + "/";

        mkdirSync(uploadDestinationRoot + destinationDirectory, {
            recursive: true,
            mode: "755",
        });

        const uploadedFiles = [];

        for (let fileFieldName of fileFieldNames) {
            const file = req.files[fileFieldName] as UploadedFile;

            const type = filetype(readFileSync(file.tempFilePath))[0]?.typename;

            if (!config.fileUploads.photos.allowedTypes.includes(type)) {
                unlinkSync(file.tempFilePath);
                throw {
                    code: 415,
                    message: `File ${fileFieldName} - type is not supported!`,
                };
            }

            file.name = file.name.toLocaleLowerCase();

            const declaredExtension = extname(file.name);

            if (!config.fileUploads.photos.allowedExtensions.includes(declaredExtension)) {
                unlinkSync(file.tempFilePath);
                throw {
                    code: 415,
                    message: `File ${fileFieldName} - extension is not supported!`,
                };
            }

            const size = sizeOf(file.tempFilePath);

            if ( size.width < config.fileUploads.photos.width.min || size.width > config.fileUploads.photos.width.max ) {
                unlinkSync(file.tempFilePath);
                throw {
                    code: 415,
                    message: `File ${fileFieldName} - image width is not supported!`,
                };
            }

            if ( size.height < config.fileUploads.photos.height.min || size.height > config.fileUploads.photos.height.max ) {
                unlinkSync(file.tempFilePath);
                throw {
                    code: 415,
                    message: `File ${fileFieldName} - image height is not supported!`,
                };
            }

            const fileNameRandomPart = uuid.v4();

            const fileDestinationPath = uploadDestinationRoot + destinationDirectory + fileNameRandomPart + "-" + file.name;

            file.mv(fileDestinationPath, async error => {
                if (error) {
                    throw {
                        code: 500,
                        message: `File ${fileFieldName} - could not be saved on the server!`,
                    };
                }

                for (let resizeOptions of config.fileUploads.photos.resize) {
                    await this.createResizedPhotos(destinationDirectory, fileNameRandomPart + "-" + file.name, resizeOptions);
                }
            });

            uploadedFiles.push(destinationDirectory + fileNameRandomPart + "-" + file.name);
        }

        return uploadedFiles;
    }

    private async createResizedPhotos(directory: string, filename: string, resizeOptions: IResize) {
        const config: IConfig = DevConfig;

        await sharp(config.server.static.path + "/" + directory + filename)
        .resize({
            width: resizeOptions.width,
            height: resizeOptions.height,
            fit: resizeOptions.fit,
            background: resizeOptions.defaultBackground,
            withoutEnlargement: true,
        })
        .toFile(config.server.static.path + "/" + directory + resizeOptions.prefix + filename);
    }

    async edit(req: Request, res: Response) {
        const categoryId: number = +req.params?.cid;

        const data = req.body as IEditItemDto;

        if (!EditItemValidator(data)) {
            return res.status(400).send(EditItemValidator.errors);
        }

        this.services.category.getById(categoryId, { loadIngredients: true, })
        .then(result => {
            if (result === null) {
                throw {
                    status: 404,
                    message: "Category not found!"
                };
            }

            return result as CategoryModel;
        })
        .then(async category => {
            const itemId: number = +req.params?.iid;

            return this.retrieveItem(category, itemId);
        })
        .then(this.checkItem)
        .then(async result => {
            await this.services.item.startTransaction();
            return result;
        })
        .then(async result => {
            const currentIngredientIds  = result.item.ingredients?.map(ingredient => ingredient.ingredientId);
            const newIngredientIds      = data.ingredientIds;

            const availableIngredientIds = result.category.ingredients?.map(i => i.ingredientId);

            for (let id of data.ingredientIds) {
                if (!availableIngredientIds.includes(id)) {
                    throw {
                        status: 400,
                        message: "Ingredient " + id + " is not available for items in this category!",
                    }
                }
            }

            const ingredientIdsToAdd = newIngredientIds.filter(id => !currentIngredientIds.includes(id));
            for (let id of ingredientIdsToAdd) {
                if (!await this.services.item.addItemIngredient({
                    item_id: result.item.itemId,
                    ingredient_id: id,
                })) {
                    throw {
                        status: 500,
                        message: "Error adding a new ingredient to this item!"
                    }
                };
            }

            const ingredientIdsToDelete = currentIngredientIds.filter(id => !newIngredientIds.includes(id));
            for (let id of ingredientIdsToDelete) {
                if (!await this.services.item.deleteItemIngredient({
                    item_id: result.item.itemId,
                    ingredient_id: id,
                })) {
                    throw {
                        status: 500,
                        message: "Error delete an existing ingredient from this item!"
                    }
                }
            }

            return result;
        })
        .then(async result => {
            const currentSizeIds          = result.item.sizes?.map(sizeInfo => sizeInfo.size.sizeId);
            const currentVisibleSizeIds   = result.item.sizes?.filter(sizeInfo => sizeInfo.isActive).map(sizeInfo => sizeInfo.size.sizeId);
            const currentInvisibleSizeIds = result.item.sizes?.filter(sizeInfo => !sizeInfo.isActive).map(sizeInfo => sizeInfo.size.sizeId);

            const newSizeIds     = data.sizes?.map(size => size.sizeId);

            const sizeIdsToHide = currentVisibleSizeIds.filter(id => !newSizeIds.includes(id));
            const sizeIdsToShow = currentInvisibleSizeIds.filter(id => newSizeIds.includes(id));
            const sizeIdsToAdd  = newSizeIds.filter(id => !currentSizeIds.includes(id));
            const sizeIdsUnion  = [ ... new Set( [ ...newSizeIds, ...sizeIdsToShow ] ) ];
            const sizeIdsToEdit = sizeIdsUnion.filter(id => !sizeIdsToAdd.includes(id));

            for (let id of sizeIdsToHide) {
                await this.services.size.hideItemSize(result.item.itemId, id);
            }

            for (let id of sizeIdsToShow) {
                await this.services.size.showItemSize(result.item.itemId, id);
            }

            for (let id of sizeIdsToAdd) {
                const size = data.sizes?.find(size => size.sizeId === id);

                if (!size) continue;

                await this.services.item.addItemSize({
                    item_id: result.item.itemId,
                    size_id: id,
                    price: size.price,
                    kcal: size.kcal,
                    is_active: 1,
                });
            }

            for (let id of sizeIdsToEdit) {
                const size = data.sizes?.find(size => size.sizeId === id);

                if (!size) continue;

                await this.services.item.editItemSize({
                    item_id: result.item.itemId,
                    size_id: id,
                    price: size.price,
                    kcal: size.kcal,
                });
            }

            await this.services.item.edit(result.item.itemId, {
                name: data.name,
                description: data.description,
                is_active: data.isActive ? 1 : 0,
            }, {
                loadCategory: false,
                loadIngredients: false,
                loadSizes: false,
                hideInactiveSizes: false,
                loadPhotos: false,
            });

            return result;
        })
        .then(async result => {
            await this.services.item.commitChanges();

            res.send(
                await this.services.item.getById(result.item.itemId, {
                    loadCategory: true,
                    loadIngredients: true,
                    loadSizes: true,
                    hideInactiveSizes: true,
                    loadPhotos: true,
                })
            );
        })
        .catch(async error => {
            await this.services.item.rollbackChanges();

            res.status(error?.status ?? 500).send(error?.message);
        });
    }

    private async retrieveItem(category: CategoryModel, itemId: number): Promise<{ category: CategoryModel, item: ItemModel|null }> {
        return {
            category: category,
            item: await this.services.item.getById(itemId, {
                loadCategory: false,
                loadIngredients: true,
                loadSizes: true,
                hideInactiveSizes: false,
                loadPhotos: false,
            })
        }
    }

    private checkItem(result: { category: CategoryModel, item: ItemModel|null }): { category: CategoryModel, item: ItemModel } {
        if (result.item === null) {
            throw {
                status: 404,
                message: "Item not found!"
            };
        }

        if (result.item.categoryId !== result.category.categoryId) {
            throw {
                status: 404,
                message: "Item not found in this category!"
            };
        }

        return result;
    }

    async deletePhoto(req: Request, res: Response) {
        const categoryId: number = +(req.params?.cid);
        const itemId: number = +(req.params?.iid);
        const photoId: number = +(req.params?.pid);

        this.services.category.getById(categoryId, DefaultCategoryAdapterOptions)
        .then(result => {
            if (result === null) throw { status: 404, message: "Category not found!" };
            return result;
        })
        .then(async category => {
            return {
                category: category,
                item: await this.services.item.getById(itemId, {
                    loadPhotos: true,
                    hideInactiveSizes: false,
                    loadCategory: false,
                    loadIngredients: false,
                    loadSizes: false,
                }),
            };
        })
        .then( ({ category, item }) => {
            if (item === null) throw { status: 404, message: "Item not found!" };
            if (item.categoryId !== category.categoryId) throw { status: 404, message: "Item not found in this category!" };
            return item;
        })
        .then(item => {
            const photo = item.photos?.find(photo => photo.photoId === photoId);
            if (!photo) throw { status: 404, message: "Photo not found in this item!" };
            return photo;
        })
        .then(async photo => {
            await this.services.photo.deleteById(photo.photoId);
            return photo;
        })
        .then(photo => {
            const directoryPart = DevConfig.server.static.path + "/" + dirname(photo.filePath);
            const fileName      = basename(photo.filePath);

            for (let resize of DevConfig.fileUploads.photos.resize) {
                const filePath = directoryPart + "/" + resize.prefix + fileName;
                unlinkSync(filePath);
            }

            unlinkSync( DevConfig.server.static.path + "/" + photo.filePath);

            res.send("Deleted!");
        })
        .catch(error => {
            res.status(error?.status ?? 500).send(error?.message ?? "Server side error!");
        });
    }

    async delete(req: Request, res: Response) {
        const categoryId: number = +(req.params?.cid);
        const itemId: number = +(req.params?.iid);

        this.services.category.getById(categoryId, DefaultCategoryAdapterOptions)
        .then(result => {
            if (result === null) throw { status: 404, message: "Category not found!" };
            return result;
        })
        .then(async category => {
            return {
                category: category,
                item: await this.services.item.getById(itemId, DefaultItemAdapterOptions),
            };
        })
        .then( ({ category, item }) => {
            if (item === null) throw { status: 404, message: "Item not found!" };
            if (item.categoryId !== category.categoryId) throw { status: 404, message: "Item not found in this category!" };
            return item;
        })
        .then(item => {
            return this.services.item.deleteById(item.itemId)
        })
        .then(result => {
            for (let filePath of result.filesToDelete) {
                const directoryPart = dirname(filePath);
                const fileName      = basename(filePath);

                for (let resize of DevConfig.fileUploads.photos.resize) {
                    const filePath = directoryPart + "/" + resize.prefix + fileName;
                    unlinkSync(filePath);
                }

                unlinkSync( filePath);
            }
        })
        .then(() => {
            res.send("Deleted!");
        })
        .catch(error => {
            res.status(error?.status ?? 500).send(error?.message ?? "Server side error!");
        });
    }
}
