import { Request, Response } from "express";
import BaseController from "../../common/BaseController";

export default class CartController extends BaseController {
    getCart(req: Request, res: Response) {
        this.services.cart.getUserCart(req.authorisation?.id)
        .then(cart => {
            res.send(cart);
        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
    }

    addToCart(req: Request, res: Response) {

    }

    editInCart(req: Request, res: Response) {

    }

    makeOrder(req: Request, res: Response) {

    }
}
