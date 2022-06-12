import { api } from "../api/api";
import ICart from "../models/ICart.model";
import AppStore from "./AppStore";

export interface ICartStoreData {
    cart?: ICart;
}

export const DefaultCartStoreData: ICartStoreData = {
    
}

let InitialCartStoreData: ICartStoreData = DefaultCartStoreData;

type IUpdateCart = { type: "cart.update", value: ICart };

type TCartStoreAction = IUpdateCart;

export function CartStoreReducer(state: ICartStoreData = InitialCartStoreData, action: TCartStoreAction): ICartStoreData {
    switch (action.type) {
        case "cart.update": return JSON.parse(JSON.stringify(action.value)); // Deep copy
        default: return { ...state } as ICartStoreData;
    }
}

export function CartStoreUpdateRequest() {
    api("get", "/api/cart", "user")
    .then(res => {
        if (res.status !== "ok") {
            throw new Error("Could not fetch the cart data.");
        }

        return res.data;
    })
    .then((cart: ICart) => {
        AppStore.dispatch({ type: "cart.update", value: cart });
    })
    .catch(error => {});
}
