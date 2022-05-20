import { Request, Response } from "express";
import IAddIngredient, { AddIngredientValidator } from "../ingredient/dto/IAddIngredient.dto";
import IngredientService from "../ingredient/IngredientService.service";
import CategoryService, { DefaultCategoryAdapterOptions } from "./CategoryService.service";
import IAddCategory, { AddCategoryValidator } from "./dto/IAddCategory.dto";

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

    async addIngredient(req: Request, res: Response) {
        const categoryId: number = +req.params?.cid;
        const data               =  req.body as IAddIngredient;

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
                    categoryId: categoryId
                })
                    .then(result => {
                        res.send(result);
                    })
                    .catch(error => {
                        res.status(400).send(error?.message);
                    });
            })
            .catch(error => {
                res.status(500).send(error?.message);
            });
    }
}

export default CategoryController;
