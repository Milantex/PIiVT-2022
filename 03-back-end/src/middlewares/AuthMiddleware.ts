import { NextFunction, Request, Response } from "express";
import ITokenData from "../components/auth/dto/ITokenData";
import * as jwt from "jsonwebtoken";
import { DevConfig } from "../configs";

export default class AuthMiddleware {
    public static getVerifier(... allowedRoles: ("user"|"administrator")[]): (req: Request, res: Response, next: NextFunction) => void {
        return (req: Request, res: Response, next: NextFunction) => {
            this.verifyAuthToken(req, res, next, allowedRoles);
        }
    }

    private static verifyAuthToken(req: Request, res: Response, next: NextFunction, allowedRoles: ("user"|"administrator")[]) {
        const tokenHeader: string = req.headers?.authorization ?? ""; // "Bearer TOKEN"

        try {
            const checks = [];

            for (let role of allowedRoles) {
                try {
                    const check = this.validateTokenAs(tokenHeader, role, "auth");

                    if (check) {
                        checks.push(check);
                    }
                } catch (error) {
                    
                }
            }

            if (checks.length === 0) {
                throw {
                    status: 403,
                    message: "You are not authorised to access this resource!",
                }
            }

            next();
        } catch (error) {
            res.status(error?.status ?? 500).send(error?.message);
        }
    }

    public static validateTokenAs(tokenString: string, role: "user" | "administrator", type: "auth" | "refresh"): ITokenData {
        if (tokenString === "") {
            throw {
                status: 400,
                message: "No token specified!",
            };
        }

        const [ tokenType, token ] = tokenString.trim().split(" ");

        if ( tokenType !== "Bearer" ) {
            throw {
                status: 401,
                message: "Invalid token type!",
            };
        }

        if ( typeof token !== "string" || token.length === 0 ) {
            throw {
                status: 401,
                message: "Token not specified!",
            };
        }

        try {
            const tokenVerification = jwt.verify(token, DevConfig.auth[role].tokens[type].keys.public);

            if (!tokenVerification) {
                throw {
                    status: 401,
                    message: "Invalid token specified!",
                };
            }
    
            const originalTokenData = tokenVerification as ITokenData;

            const tokenData: ITokenData = {
                role: originalTokenData.role,
                id: originalTokenData.id,
                identity: originalTokenData.identity,
            };
    
            if (tokenData.role !== role) {
                throw {
                    status: 401,
                    message: "Invalid token role!",
                };
            }
    
            return tokenData;
        } catch (error) {
            const message: string = (error?.message ?? "");

            if (message.includes("jwt expired")) {
                throw {
                    status: 401,
                    message: "This token has expired!",
                };
            }

            throw {
                status: 500,
                message: error?.message,
            };
        }
    }
}
