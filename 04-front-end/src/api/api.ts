import axios, { AxiosResponse } from "axios";

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
            data: data ? JSON.stringify(data) : "",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + "TOKEN WILL GO HERE LATER", // TODO
            },
        })
        .then(res => handleApiResponse(res, resolve))
        .catch(err => handleApiError(err, resolve, {
            method, path, role, data, attemptToRefreshToken: false,
        }));
    });
}

function handleApiError(err: any, resolve: (value: IApiResponse | PromiseLike<IApiResponse>) => void, args: IApiArguments) {
    if (err?.response?.status === 401 && args.attemptToRefreshToken) {
        const refreshedToken = "REFRESH TOKEN CALL LOGIN WILL GO HERE LATER"; // TODO

        if (refreshedToken) {
            api(args.method, args.path, args.role, args.data, args.attemptToRefreshToken)
            .then(res => resolve(res))
            .catch(() => {
                resolve({
                    status: 'login',
                    data: 'You must log in again!',
                });
            });
        }

        return resolve({
            status: 'login',
            data: 'You must log in again!',
        });
    }

    if (err?.response?.status === 401 && !args.attemptToRefreshToken) {
        return resolve({
            status: 'login',
            data: 'You are not logged in!',
        });
    }

    if (err?.response?.status === 403) {
        return resolve({
            status: 'login',
            data: 'Wrong role!',
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
