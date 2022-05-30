import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import { IAdministratorLoginDto } from "./dto/IAdministratorLogin.dto";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import ITokenData from "./dto/ITokenData";
import { DevConfig } from "../../configs";

export default class AuthController extends BaseController {
    public async administratorLogin(req: Request, res: Response) {
        const data = req.body as IAdministratorLoginDto;

        this.services.administrator.getByUsername(data.username)
        .then(result => {
            if (result === null) {
                throw {
                    status: 404,
                    message: "Administrator account not found!"
                };
            }

            return result;
        })
        .then(administrator => {
            if (!bcrypt.compareSync(data.password, administrator.passwordHash)) {
                throw {
                    status: 404,
                    message: "Administrator account not found!"
                };
            }

            return administrator;
        })
        .then(administrator => {
            const tokenData: ITokenData = {
                role: "administrator",
                id: administrator.administratorId,
                identity: administrator.username,
            };

            const authToken = jwt.sign(tokenData, DevConfig.auth.administrator.tokens.auth.keys.private, {
                algorithm: DevConfig.auth.administrator.algorithm,
                issuer: DevConfig.auth.administrator.issuer,
                expiresIn: DevConfig.auth.administrator.tokens.auth.duration,
            });

            const refreshToken = jwt.sign(tokenData, DevConfig.auth.administrator.tokens.refresh.keys.private, {
                algorithm: DevConfig.auth.administrator.algorithm,
                issuer: DevConfig.auth.administrator.issuer,
                expiresIn: DevConfig.auth.administrator.tokens.refresh.duration,
            });

            res.send({
                authToken: authToken,
                refreshToken: refreshToken,
            });
        })
        .catch(error => {
            setTimeout(() => {
                res.status(error?.status ?? 500).send(error?.message);
            }, 1500);
        });
    }

    administratorRefresh(req: Request, res: Response) {
        const refreshTokenHeader: string = req.headers?.authorization ?? ""; // "Bearer TOKEN"

        try {
            const tokenData = this.validateTokenAs(refreshTokenHeader, "administrator", "refresh");
    
            const authToken = jwt.sign(tokenData, DevConfig.auth.administrator.tokens.auth.keys.private, {
                algorithm: DevConfig.auth.administrator.algorithm,
                issuer: DevConfig.auth.administrator.issuer,
                expiresIn: DevConfig.auth.administrator.tokens.auth.duration,
            });
    
            res.send({
                authToken: authToken,
            });
        } catch (error) {
            res.status(error?.status ?? 500).send(error?.message);
        }
    }

    private validateTokenAs(tokenString: string, role: "user" | "administrator", type: "auth" | "refresh"): ITokenData {
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
