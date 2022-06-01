import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import AuthMiddleware from "../../middlewares/AuthMiddleware";
import SizeController from "./SizeController.controller";

class SizeRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const sizeController: SizeController = new SizeController (resources.services);

        application.get("/api/size",     AuthMiddleware.getVerifier("administrator", "user"), sizeController.getAll.bind(sizeController));
        application.get("/api/size/:id", AuthMiddleware.getVerifier("administrator", "user"), sizeController.getById.bind(sizeController));
        application.post("/api/size",    AuthMiddleware.getVerifier("administrator"),         sizeController.add.bind(sizeController));
        application.put("/api/size/:id", AuthMiddleware.getVerifier("administrator"),         sizeController.edit.bind(sizeController));
    }
}

export default SizeRouter;
