import CategoryController from "./CategoryController.controller";
import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import ItemController from "../item/ItemController.controller";

class CategoryRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const categoryController: CategoryController = new CategoryController(resources.services);
        const itemController: ItemController = new ItemController(resources.services);

        application.get("/api/category",                         categoryController.getAll.bind(categoryController));
        application.get("/api/category/:id",                     categoryController.getById.bind(categoryController));
        application.post("/api/category",                        categoryController.add.bind(categoryController));
        application.put("/api/category/:cid",                    categoryController.edit.bind(categoryController));
        application.get("/api/category/:cid/item",               itemController.getAllItemsByCategoryId.bind(itemController));
        application.post("/api/category/:cid/item",              itemController.add.bind(itemController));
        application.post("/api/category/:cid/item/:iid/photo",   itemController.uploadPhoto.bind(itemController));
        application.get("/api/category/:cid/item/:iid",          itemController.getItemById.bind(itemController));
        application.post("/api/category/:cid/ingredient",        categoryController.addIngredient.bind(categoryController));
        application.put("/api/category/:cid/ingredient/:iid",    categoryController.editIngredient.bind(categoryController));
        application.delete("/api/category/:cid/ingredient/:iid", categoryController.deleteIngredient.bind(categoryController));
    }
}

export default CategoryRouter;
