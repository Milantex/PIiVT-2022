import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import { IRegisterUserDto, RegisterUserValidator } from "./dto/IRegisterUser.dto";
import * as bcrypt from "bcrypt";
import IEditUser, { EditUserValidator, IEditUserDto } from "./dto/IEditUser.dto";
import * as uuid from "uuid";
import UserModel from "./UserModel.model";
import * as nodemailer from "nodemailer";
import * as Mailer from "nodemailer/lib/mailer";
import { DevConfig } from "../../configs";

export default class UserController extends BaseController {
    getAll(req: Request, res: Response) {
        this.services.user.getAll({
            removePassword: true,
            removeActivationCode: true,
        })
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
    }

    getById(req: Request, res: Response) {
        const id: number = +req.params?.id;

        this.services.user.getById(id, {
            removePassword: true,
            removeActivationCode: true,
        })
        .then(result => {
            if (result === null) {
                res.status(404).send('User not found!');
            }
    
            res.send(result);
        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
    }

    register(req: Request, res: Response) {
        const body = req.body as IRegisterUserDto;

        if (!RegisterUserValidator(body)) {
            return res.status(400).send(RegisterUserValidator.errors);
        }

        const passwordHash = bcrypt.hashSync(body.password, 10);

        this.services.user.add({
            email: body.email,
            password_hash: passwordHash,
            forename: body.forename,
            surname: body.surname,
            activation_code: uuid.v4(),
        })
        .then(user => {
            return this.sendRegistrationEmail(user);
        })
        .then(user => {
            res.send(user);
        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
    }

    private async sendRegistrationEmail(user: UserModel): Promise<UserModel> {
        return new Promise((resolve, reject) => {
            const transport = nodemailer.createTransport(
                {
                    from: DevConfig.mail.email,
                },
                {
                    host: DevConfig.mail.host,
                    port: DevConfig.mail.port,
                    secure: false,
                    tls: {
                        ciphers: "SSLv3",
                    },
                    debug: DevConfig.mail.debug,
                    auth: {
                        user: DevConfig.mail.email,
                        pass: DevConfig.mail.password,
                    },
                },
            );

            const mailOptions: Mailer.Options = {
                to: user.email,
                subject: "Account registration",
                html: `<!dcotype html>
                        <html>
                            <head><meta charset="utf-8"></head>
                            <body>
                                <p>
                                    Dear ${ user.forename } ${ user.surname },<br>
                                    Your account was successfully created.
                                </p>
                                <p>
                                    You must activate you account by clicking on the following link:
                                </p>
                                <p style="text-align: center; padding: 10px;">
                                    <a href="http://localhost:10000/api/user/activate/${ user.activationCode }">Activate</a>
                                </p>
                            </body>
                        </html>`
            };

            transport.sendMail(mailOptions)
            .then(() => {
                transport.close();

                user.activationCode = null;

                resolve(user);
            })
            .catch(error => {
                transport.close();

                reject({
                    message: error?.message,
                });
            });
        });
    }

    activate(req: Request, res: Response) {
        const code: string = req.params?.code;

        this.services.user.getUserByActivateionCode(code, {
            removeActivationCode: true,
            removePassword: true,
        })
        .then(result => {
            if (result === null) {
                throw {
                    status: 404,
                    message: "User not found!",
                }
            }

            return result;
        })
        .then(result => {
            const user = result as UserModel;

            return this.services.user.edit(user.userId, {
                is_active: 1,
                activation_code: null,
            });
        })
        .then(user => {
            res.send(user);
        })
        .catch(error => {
            setTimeout(() => {
                res.status(error?.status ?? 500).send(error?.message);
            }, 500);
        });
    }

    editById(req: Request, res: Response) {
        const id: number = +req.params?.aid;
        const data = req.body as IEditUserDto;

        if (!EditUserValidator(data)) {
            return res.status(400).send(EditUserValidator.errors);
        }

        const serviceData: IEditUser = { };

        if (data.password !== undefined) {
            const passwordHash = bcrypt.hashSync(data.password, 10);
            serviceData.password_hash = passwordHash;
        }

        // TODO: allow only for administrator role:
        if (data.isActive !== undefined) {
            serviceData.is_active = data.isActive ? 1 : 0;
        }

        if (data.forename !== undefined) {
            serviceData.forename = data.forename;
        }

        if (data.surname !== undefined) {
            serviceData.surname = data.surname;
        }

        this.services.user.edit(id, serviceData)
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
    }
}
