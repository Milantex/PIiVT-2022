import CategoryController from "./CategoryController.controller";
import CategoryService from "./CategoryService.service";
import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import IngredientService from "../ingredient/IngredientService.service";

class CategoryRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const categoryService: CategoryService = new CategoryService(resources.databaseConnection);
        const ingredientService: IngredientService = new IngredientService(resources.databaseConnection);

        const categoryController: CategoryController = new CategoryController(categoryService, ingredientService);

        application.get("/api/category",                  categoryController.getAll.bind(categoryController));
        application.get("/api/category/:id",              categoryController.getById.bind(categoryController));
        application.post("/api/category",                 categoryController.add.bind(categoryController));
        application.put("/api/category/:cid",             categoryController.edit.bind(categoryController));
        application.post("/api/category/:cid/ingredient", categoryController.addIngredient.bind(categoryController));
    }
}

export default CategoryRouter;
