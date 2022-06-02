import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import AuthMiddleware from "../../middlewares/AuthMiddleware";
import UserController from "./UserController.controller";

class UserRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const userController: UserController = new UserController(resources.services);

        application.get("/api/user",                AuthMiddleware.getVerifier("administrator"),         userController.getAll.bind(userController));
        application.get("/api/user/:id",            AuthMiddleware.getVerifier("administrator", "user"), userController.getById.bind(userController));
        application.post("/api/user/register",                                                           userController.register.bind(userController));
        application.put("/api/user/:aid",           AuthMiddleware.getVerifier("administrator", "user"), userController.editById.bind(userController));
        application.get("/api/user/activate/:code",                                                      userController.activate.bind(userController));
        application.post('/api/user/address',       AuthMiddleware.getVerifier("user"),                  userController.addAddress.bind(userController));
        application.put('/api/user/address/:aid',   AuthMiddleware.getVerifier("user"),                  userController.editAddress.bind(userController));
    }
}

export default UserRouter;
