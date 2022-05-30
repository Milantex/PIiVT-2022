import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import AuthController from "./AuthController.controller";

class AuthRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const authController: AuthController = new AuthController(resources.services);

        application.post("/api/auth/administrator/login",         authController.administratorLogin.bind(authController));
    }
}

export default AuthRouter;
