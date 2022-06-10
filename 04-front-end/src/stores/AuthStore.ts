import { configureStore } from "@reduxjs/toolkit";

export interface IAuthStoreData {
    role: "visitor" | "user" | "administrator";
    identity: string;
    id: number;
    authToken: string;
    refreshToken: string;
}

let InitialAuthStoreData: IAuthStoreData = {
    role: "visitor",
    identity: "",
    id: 0,
    authToken: "",
    refreshToken: "",
};

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

type TAuthStoreAction = TUpdateRole | TUpdateId | TUpdateStrings;

function AuthStoreReducer(state: IAuthStoreData = InitialAuthStoreData, action: TAuthStoreAction): IAuthStoreData {
    switch (action.type) {
        case "update": return { ...state, [ action.key ]: action.value } as IAuthStoreData;
        default: return { ...state } as IAuthStoreData;
    }
}

const AuthStore = configureStore({ reducer: AuthStoreReducer });

AuthStore.subscribe(() => {
    localStorage.setItem('app-auth-store-data', JSON.stringify(AuthStore.getState()));
});

export type TAuthStoreDispatch = typeof AuthStore.dispatch;

export default AuthStore;
