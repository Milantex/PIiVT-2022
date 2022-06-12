import { configureStore , combineReducers } from "@reduxjs/toolkit";
import { AuthStoreReducer, DefaultAuthStoreData } from "./AuthReducer";
import { CartStoreReducer, CartStoreUpdateRequest, DefaultCartStoreData } from "./CartReducer";

const reducer = combineReducers({
    auth: AuthStoreReducer,
    cart: CartStoreReducer,
});

function getStoredApPStoreData(): object {
    if (!localStorage.getItem('app-store-data')) {
        return {};
    }

    const data = JSON.parse(localStorage.getItem('app-store-data') ?? '{}');

    if (typeof data !== "object") {
        return {};
    }

    return data;
}

const AppStore = configureStore({
    reducer: reducer,
    preloadedState: {
        auth: {
            ...JSON.parse(JSON.stringify(DefaultAuthStoreData)),
        },
        cart: {
            ...JSON.parse(JSON.stringify(DefaultCartStoreData)),
        },
        ...getStoredApPStoreData(),
    },
});

AppStore.subscribe(() => {
    localStorage.setItem('app-store-data', JSON.stringify(AppStore.getState()));
});

CartStoreUpdateRequest();

export type TAuthStoreDispatch = typeof AppStore.dispatch;

export default AppStore;
