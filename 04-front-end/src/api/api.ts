import axios, { AxiosResponse } from "axios";
import AuthStore from "../stores/AuthStore";

export type TApiMethod = "get" | "post" | "put" | "delete";
export type TApiRole = "user" | "administrator";
export type TApiResponse = "ok" | "error" | "login";

export interface IApiResponse {
    status: TApiResponse;
    data: any;
}

interface IApiArguments {
    method: TApiMethod,
    path: string,
    role: TApiRole,
    data: any | undefined,
    attemptToRefreshToken: boolean,
}

export function api(
    method: TApiMethod,
    path: string,
    role: TApiRole,
    data: any | undefined = undefined,
    attemptToRefreshToken: boolean = true,
): Promise<IApiResponse> {
    return new Promise(resolve => {
        axios({
            method: method,
            baseURL: "http://localhost:10000",
            url: path,
            data: data ? JSON.stringify(data) : undefined,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + AuthStore.getState().authToken,
            },
        })
        .then(res => handleApiResponse(res, resolve))
        .catch(err => handleApiError(err, resolve, {
            method, path, role, data, attemptToRefreshToken,
        }));
    });
}

export function apiForm(
    method: TApiMethod,
    path: string,
    role: TApiRole,
    data: FormData,
    attemptToRefreshToken: boolean = true,
): Promise<IApiResponse> {
    return new Promise(resolve => {
        axios({
            method: method,
            baseURL: "http://localhost:10000",
            url: path,
            data: data,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + AuthStore.getState().authToken,
            },
        })
        .then(res => handleApiResponse(res, resolve))
        .catch(err => handleApiError(err, resolve, {
            method, path, role, data, attemptToRefreshToken,
        }));
    });
}

function handleApiError(err: any, resolve: (value: IApiResponse | PromiseLike<IApiResponse>) => void, args: IApiArguments) {
    if (err?.response?.status === 401 || err?.response?.status === 403) {
        if (args.attemptToRefreshToken) {
            refreshToken()
            .then(token => {
                if (!token) {
                    throw {
                        status: 'login',
                        data: 'You must log in again!',
                    };
                }
    
                return token;
            })
            .then(token => {
                AuthStore.dispatch({ type: "update", key: "authToken", value: token });
    
                return api(args.method, args.path, args.role, args.data, false);
            })
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                resolve(error);
            });
        } else {
            return resolve({
                status: 'login',
                data: 'Wrong role!',
            });
        }
    } else {
        resolve({
            status: 'error',
            data: err?.response?.data,
        });
    }
}

function handleApiResponse(res: AxiosResponse<any, any>, resolve: (value: IApiResponse | PromiseLike<IApiResponse>) => void) {
    if (res?.status < 200 || res?.status >= 300) {
        return resolve({
            status: 'error',
            data: res + '',
        });
    }

    resolve({
        status: 'ok',
        data: res.data,
    });
}

function refreshToken(): Promise<string|null> {
    return new Promise(resolve => {
        const role = AuthStore.getState().role;

        if ( role === "visitor" ) {
            return resolve(null);
        }

        axios({
            method: "post",
            baseURL: "http://localhost:10000",
            url: "/api/auth/" + role + "/refresh",
            headers: {
                "Authorization": "Bearer " + AuthStore.getState().refreshToken,
            },
        })
        .then(res => refreshTokenResponseHandler(res, resolve))
        .catch(() => {
            resolve(null);
        });
    });
}

function refreshTokenResponseHandler(res: AxiosResponse<any>, resolve: (value: string | PromiseLike<string | null> | null) => void) {
    if (res.status !== 200) {
        return resolve(null);
    }

    resolve(res.data?.authToken);
}
