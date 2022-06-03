import { Application } from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import AuthMiddleware from "../../middlewares/AuthMiddleware";
import CartController from "./CartController.controller";

export default class CartRouter implements IRouter {
    public setupRoutes(application: Application, resources: IApplicationResources) {
        const cartController: CartController = new CartController(resources.services);

        application.get("/api/cart",        AuthMiddleware.getVerifier("user"), cartController.getCart.bind(cartController));
        application.post("/api/cart",       AuthMiddleware.getVerifier("user"), cartController.addToCart.bind(cartController));
        application.put("/api/cart",        AuthMiddleware.getVerifier("user"), cartController.editInCart.bind(cartController));
        application.post("/api/cart/order", AuthMiddleware.getVerifier("user"), cartController.makeOrder.bind(cartController));
        application.get("/api/order",       AuthMiddleware.getVerifier("user"), cartController.getMyOrders.bind(cartController));
        application.post("/api/order/:oid/rate", AuthMiddleware.getVerifier("user"), cartController.rateOrder.bind(cartController));
        application.put("/api/order/:oid/status", AuthMiddleware.getVerifier("user"), cartController.changeOrderStatus.bind(cartController));
    }
}
