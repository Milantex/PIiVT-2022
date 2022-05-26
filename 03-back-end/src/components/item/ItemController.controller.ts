import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import { AddItemValidator, IAddItemDto } from "./dto/IAddItem.dto";
import { mkdirSync, readFileSync, unlinkSync } from "fs";
import { UploadedFile } from "express-fileupload";
import filetype from 'magic-bytes.js'
import { extname, basename } from "path";
import sizeOf from "image-size";
import * as uuid from "uuid";
import PhotoModel from "../photo/PhotoModel.model";
import IConfig, { IResize } from "../../common/IConfig.interface";
import { DevConfig } from "../../configs";
import * as sharp from "sharp";

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
                return res.status(404).send("Category not found!");
            }

            const availableIngredientIds: number[] = resultCategory.ingredients?.map(ingredient => ingredient.ingredientId);
            for (let givenIngredientId of data.ingredientIds) {
                if (!availableIngredientIds.includes(givenIngredientId)) {
                    return res.status(404).send(`Ingredient ${givenIngredientId} not found in this category!`);
                }
            }

            this.services.size.getAll({})
            .then(resultSizes => {
                const availableSizeIds: number[] = resultSizes.map(size => size.sizeId);

                for (let givenSizeInformation of data.sizes) {
                    if (!availableSizeIds.includes(givenSizeInformation.sizeId)) {
                        return res.status(404).send(`Size with ID ${givenSizeInformation.sizeId} not found!`);
                    }
                }

                this.services.item.add({
                    name: data.name,
                    category_id: categoryId,
                    description: data.description,
                })
                .then(newItem => {
                    for (let givenIngredientId of data.ingredientIds) {
                        this.services.item.addItemIngredient({
                            item_id: newItem.itemId,
                            ingredient_id: givenIngredientId,
                        })
                        .catch(error => {
                            // TODO: Ovde bi istao rollback!
                            res.status(500).send(error?.message);
                        });
                    }

                    for (let givenSizeInformation of data.sizes) {
                        this.services.item.addItemSize({
                            item_id: newItem.itemId,
                            size_id: givenSizeInformation.sizeId,
                            price: givenSizeInformation.price,
                            kcal: givenSizeInformation.kcal,
                        })
                        .catch(error => {
                            // TODO: Ovde bi istao rollback!
                            res.status(500).send(error?.message);
                        });
                    }

                    this.services.item.getById(newItem.itemId, {
                        loadCategory: true,
                        loadIngredients: true,
                        loadSizes: true,
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
            })
            .catch(error => {
                res.status(500).send(error?.message);
            });
        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
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
}
