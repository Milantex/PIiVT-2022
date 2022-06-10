import { configureStore } from "@reduxjs/toolkit";

export interface IAuthStoreData {
    role: "visitor" | "user" | "administrator";
    identity: string;
    id: number;
    authToken: string;
    refreshToken: string;
}

const DefaultAuthStoreData: IAuthStoreData = {
    role: "visitor",
    identity: "",
    id: 0,
    authToken: "",
    refreshToken: "",
}

let InitialAuthStoreData: IAuthStoreData = DefaultAuthStoreData;

(() => {
    if (!localStorage.getItem("app-auth-store-data")) {
        return;
    }

    const storedData = JSON.parse(localStorage.getItem("app-auth-store-data") ?? "{}");

    if (typeof storedData !== "object") {
        return;
    }

    InitialAuthStoreData = { ...InitialAuthStoreData, ...storedData };
})();

type TUpdateRole    = { type: "update", key: "role", value: "visitor" | "user" | "administrator" };
type TUpdateId      = { type: "update", key: "id", value: number };
type TUpdateStrings = { type: "update", key: "identity" | "authToken" | "refreshToken", value: string };
type TReset         = { type: "reset" };

type TAuthStoreAction = TUpdateRole | TUpdateId | TUpdateStrings | TReset;

function AuthStoreReducer(state: IAuthStoreData = InitialAuthStoreData, action: TAuthStoreAction): IAuthStoreData {
    switch (action.type) {
        case "update": return { ...state, [ action.key ]: action.value } as IAuthStoreData;
        case "reset": return { ...DefaultAuthStoreData };
        default: return { ...state } as IAuthStoreData;
    }
}

const AuthStore = configureStore({ reducer: AuthStoreReducer });

AuthStore.subscribe(() => {
    localStorage.setItem('app-auth-store-data', JSON.stringify(AuthStore.getState()));
});

export type TAuthStoreDispatch = typeof AuthStore.dispatch;

export default AuthStore;
