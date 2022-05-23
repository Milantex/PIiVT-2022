import { Request, response, Response } from "express";
import IAddIngredient, { AddIngredientValidator, IAddIngredientDto } from "../ingredient/dto/IAddIngredient.dto";
import { EditIngredientValidator, IEditIngredientDto } from "../ingredient/dto/IEditIngredient.dto";
import IngredientService from "../ingredient/IngredientService.service";
import CategoryService, { DefaultCategoryAdapterOptions } from "./CategoryService.service";
import IAddCategory, { AddCategoryValidator } from "./dto/IAddCategory.dto";
import IEditCategory, { EditCategoryValidator, IEditCategoryDto } from "./dto/IEditCategory.dto";

class CategoryController {
    private categoryService: CategoryService;
    private ingredientService: IngredientService;

    constructor(categoryService: CategoryService, ingredientService: IngredientService) {
        this.categoryService = categoryService;
        this.ingredientService = ingredientService;
    }

    async getAll(req: Request, res: Response) {
        this.categoryService.getAll(DefaultCategoryAdapterOptions)
            .then(result => {
                res.send(result); 
            })
            .catch(error => {
                res.status(500).send(error?.message);
            });
    }

    async getById(req: Request, res: Response) {
        const id: number = +req.params?.id;

        this.categoryService.getById(id, {
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

        this.categoryService.add(data)
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

        this.categoryService.getById(id, { loadIngredients: false })
        .then(result => {
            if (result === null) {
                return res.sendStatus(404);
            }

            this.categoryService.editById(
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

        this.categoryService.getById(categoryId, { loadIngredients: false })
            .then(result => {
                if (result === null) {
                    return res.sendStatus(404);
                }

                this.ingredientService.add({
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

        this.categoryService.getById(categoryId, { loadIngredients: false })
        .then(result => {
            if (result === null) {
                return res.status(404).send('Category not found!');
            }

            this.ingredientService.getById(ingredientId, {})
            .then(result => {
                if (result === null) {
                    return res.status(404).send('Ingredient not found!');
                }

                if (result.categoryId !== categoryId) {
                    return res.status(400).send('This ingredient does not belong to this category!');
                }

                this.ingredientService.editById(ingredientId, data)
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

        this.categoryService.getById(categoryId, { loadIngredients: false })
        .then(result => {
            if (result === null) {
                return res.status(404).send('Category not found!');
            }

            this.ingredientService.getById(ingredientId, {})
            .then(result => {
                if (result === null) {
                    return res.status(404).send('Ingredient not found!');
                }

                if (result.categoryId !== categoryId) {
                    return res.status(400).send('This ingredient does not belong to this category!');
                }

                this.ingredientService.deleteById(ingredientId)
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
}

export default CategoryController;
