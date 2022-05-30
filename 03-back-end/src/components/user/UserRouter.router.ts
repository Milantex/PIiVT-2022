import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import UserController from "./UserController.controller";

class UserRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const userController: UserController = new UserController(resources.services);

        application.get("/api/user",                         userController.getAll.bind(userController));
        application.get("/api/user/:id",                     userController.getById.bind(userController));
        application.post("/api/user/register",               userController.register.bind(userController));
        application.put("/api/user/:aid",                    userController.editById.bind(userController));
        application.get("/api/user/activate/:code",          userController.activate.bind(userController));
    }
}

export default UserRouter;
