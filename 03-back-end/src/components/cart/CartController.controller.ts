import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import { AddToCartValidator, IAddToCartDto } from "./dto/IAddToCart.dto";
import { EditInCartValidator, IEditInCartDto } from "./dto/IEditInCart.dto";

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
        const data = req.body as IAddToCartDto;

        if (!AddToCartValidator(data)) {
            return res.status(400).send(AddToCartValidator.errors);
        }

        this.services.cart.getUserCart(req.authorisation?.id)
        .then(cart => {
            const found = cart.content.find(cartContentItem => {
                return cartContentItem.item.itemId === data.itemId && cartContentItem.size.size.sizeId === data.sizeId
            });

            if (found) {
                this.services.cart.editCartContentItemQuantity(cart.cartId, found.item.itemId, found.size.size.sizeId, found.quantity + data.quantity)
                .then(cart => {
                    return res.send(cart);
                })
                .catch(error => {
                    throw error;
                });
            } else {
                this.services.cart.addCartContentItem(cart.cartId, data.itemId, data.sizeId, data.quantity)
                .then(cart => {
                    return res.send(cart);
                })
                .catch(error => {
                    throw error;
                });
            }
        })
        .catch(error => {
            res.status(error?.status ?? 500).send(error?.message);
        });
    }

    editInCart(req: Request, res: Response) {
        const data = req.body as IEditInCartDto;

        if (!EditInCartValidator(data)) {
            return res.status(400).send(EditInCartValidator.errors);
        }

        this.services.cart.getUserCart(req.authorisation?.id)
        .then(cart => {
            const found = cart.content.find(cartContentItem => {
                return cartContentItem.item.itemId === data.itemId && cartContentItem.size.size.sizeId === data.sizeId
            });

            if (!found) {
                return res.status(404).send("An item of that size is not in you cart!");
            }

            if (data.quantity > 0) {
                this.services.cart.editCartContentItemQuantity(cart.cartId, found.item.itemId, found.size.size.sizeId, data.quantity)
                .then(cart => {
                    return res.send(cart);
                })
                .catch(error => {
                    throw error;
                });
            } else {
                this.services.cart.deleteCartContentItem(cart.cartId, found.item.itemId, found.size.size.sizeId)
                .then(cart => {
                    return res.send(cart);
                })
                .catch(error => {
                    throw error;
                });
            }
        })
        .catch(error => {
            res.status(error?.status ?? 500).send(error?.message);
        });
    }

    makeOrder(req: Request, res: Response) {

    }
}
