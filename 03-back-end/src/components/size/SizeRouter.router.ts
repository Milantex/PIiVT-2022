import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import SizeController from "./SizeController.controller";

class SizeRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const sizeController: SizeController = new SizeController (resources.services);

        application.get("/api/size",                         sizeController.getAll.bind(sizeController));
        application.get("/api/size/:id",                     sizeController.getById.bind(sizeController));
        application.post("/api/size",                        sizeController.add.bind(sizeController));
        application.put("/api/size/:id",                     sizeController.edit.bind(sizeController));
    }
}

export default SizeRouter;
