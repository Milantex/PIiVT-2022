import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import { AddIngredientValidator, IAddIngredientDto } from "../ingredient/dto/IAddIngredient.dto";
import { EditIngredientValidator, IEditIngredientDto } from "../ingredient/dto/IEditIngredient.dto";
import { DefaultCategoryAdapterOptions } from "./CategoryService.service";
import IAddCategory, { AddCategoryValidator } from "./dto/IAddCategory.dto";
import { EditCategoryValidator, IEditCategoryDto } from "./dto/IEditCategory.dto";

class CategoryController extends BaseController {
    async getAll(req: Request, res: Response) {
        this.services.category.getAll(DefaultCategoryAdapterOptions)
        .then(result => {
            res.send(result); 
        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
    }

    async getById(req: Request, res: Response) {
        const id: number = +req.params?.id;

        this.services.category.getById(id, {
            loadIngredients: true
        })
        .then(result => {
            if (result === null) {
                return res.sendStatus(404);
            }

            res.send(result);
        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
    }

    async add(req: Request, res: Response) {
        const data = req.body as IAddCategory;

        if (!AddCategoryValidator(data)) {
            return res.status(400).send(AddCategoryValidator.errors);
        }

        this.services.category.add(data)
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(400).send(error?.message);
        });
    }

    async edit(req: Request, res: Response) {
        const id: number = +req.params?.cid;
        const data = req.body as IEditCategoryDto;

        if (!EditCategoryValidator(data)) {
            return res.status(400).send(EditCategoryValidator.errors);
        }

        this.services.category.getById(id, { loadIngredients: false })
        .then(result => {
            if (result === null) {
                return res.sendStatus(404);
            }

            this.services.category.editById(
                id,
                {
                    name: data.name
                },
                {
                    loadIngredients: true,
                }
            )
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                res.status(400).send(error?.message);
            })
        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
    }

    async addIngredient(req: Request, res: Response) {
        const categoryId: number = +req.params?.cid;
        const data               =  req.body as IAddIngredientDto;

        if (!AddIngredientValidator(data)) {
            return res.status(400).send(AddIngredientValidator.errors);
        }

        this.services.category.getById(categoryId, { loadIngredients: false })
        .then(result => {
            if (result === null) {
                return res.sendStatus(404);
            }

            this.services.ingredient.add({
                name: data.name,
                category_id: categoryId
            })
            .then(result => {
                res.send(result);
            });
        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
    }

    async editIngredient(req: Request, res: Response) {
        const categoryId: number       = +req.params?.cid;
        const ingredientId: number     = +req.params?.iid;
        const data: IEditIngredientDto =  req.body as IEditIngredientDto;

        if (!EditIngredientValidator(data)) {
            return res.status(400).send(EditIngredientValidator.errors);
        }

        this.services.category.getById(categoryId, { loadIngredients: false })
        .then(result => {
            if (result === null) {
                return res.status(404).send('Category not found!');
            }

            this.services.ingredient.getById(ingredientId, {})
            .then(result => {
                if (result === null) {
                    return res.status(404).send('Ingredient not found!');
                }

                if (result.categoryId !== categoryId) {
                    return res.status(400).send('This ingredient does not belong to this category!');
                }

                this.services.ingredient.editById(ingredientId, data)
                .then(result => {
                    res.send(result);
                })
                .catch(error => {
                    res.status(500).send(error?.message);
                });
            });
        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
    }

    async deleteIngredient(req: Request, res: Response) {
        const categoryId: number       = +req.params?.cid;
        const ingredientId: number     = +req.params?.iid;

        this.services.category.getById(categoryId, { loadIngredients: false })
        .then(result => {
            if (result === null) {
                return res.status(404).send('Category not found!');
            }

            this.services.ingredient.getById(ingredientId, {})
            .then(result => {
                if (result === null) {
                    return res.status(404).send('Ingredient not found!');
                }

                if (result.categoryId !== categoryId) {
                    return res.status(400).send('This ingredient does not belong to this category!');
                }

                this.services.ingredient.deleteById(ingredientId)
                .then(result => {
                    res.send('This ingredient has been deleted!');
                })
                .catch(error => {
                    res.status(406).send('Could not delete this ingredient due to an integrity constraint check.');
                })
            })
            .catch(error => {
                res.status(500).send(error?.message);
            });
        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
    }

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
}

export default CategoryController;
