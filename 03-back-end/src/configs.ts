import IConfig from "./common/IConfig.interface";
import AdministratorRouter from "./components/administrator/AdministratorRouter.router";
import AuthRouter from "./components/auth/AuthRouter.router";
import CategoryRouter from "./components/category/CategoryRouter.router";
import SizeRouter from "./components/size/SizeRouter.router";
import UserRouter from "./components/user/UserRouter.router";
import { MailConfigurationParameters } from "./config.mail";
import { readFileSync } from "fs";
import CartRouter from "./components/cart/CartRouter.router";

const DevConfig: IConfig = {
    server: {
        port: 10000,
        static: {
            index: false,
            dotfiles: "deny",
            cacheControl: true,
            etag: true,
            maxAge: 1000 * 60 * 60 * 24,
            path: "./static",
            route: "/assets",
        },
    },
    logging: {
        path: "./logs",
        format: ":date[iso]\t:remote-addr\t:method\t:url\t:status\t:res[content-length] bytes\t:response-time ms",
        filename: "access.log",
    },
    database: {
        host: "localhost",
        port: 3306,
        user: "aplikacija",
        password: "aplikacija",
        database: "piivt_app",
        charset: "utf8",
        timezone: "+01:00",
        supportBigNumbers: true,
    },
    routers: [
        new CategoryRouter(),
        new AdministratorRouter(),
        new SizeRouter(),
        new UserRouter(),
        new AuthRouter(),
        new CartRouter(),
    ],
    fileUploads: {
        maxFiles: 5,
        maxFileSize: 5 * 1024 * 1024, // 5MB
        temporaryFileDirecotry: "../temp/",
        destinationDirectoryRoot: "uploads/",
        photos: {
            allowedTypes: [ "png", "jpg" ],
            allowedExtensions: [ ".png", ".jpg" ],
            width: {
                min: 320,
                max: 1920,
            },
            height: {
                min: 240,
                max: 1080,
            },
            resize: [
                {
                    prefix: "small-",
                    width: 320,
                    height: 240,
                    fit: "cover",
                    defaultBackground: { r: 0, g: 0, b: 0, alpha: 1, }
                },
                {
                    prefix: "medium-",
                    width: 640,
                    height: 480,
                    fit: "cover",
                    defaultBackground: { r: 0, g: 0, b: 0, alpha: 1, }
                },
            ],
        },
    },
    mail: {
        host: "smtp.office365.com",
        port: 587,
        email: "",
        password: "",
        debug: true,
    },
    auth: {
        administrator: {
            algorithm: "RS256",
            issuer: "PIiVT",
            tokens: {
                auth: {
                    duration: 60 * 60 * 24,
                    keys: {
                        public: readFileSync("./.keystore/app.public", "ascii"),
                        private: readFileSync("./.keystore/app.private", "ascii"),
                    },
                },
                refresh: {
                    duration: 60 * 60 * 24 * 60, // Za dev: 60 dana - inace treba oko mesec dana
                    keys: {
                        public: readFileSync("./.keystore/app.public", "ascii"),
                        private: readFileSync("./.keystore/app.private", "ascii"),
                    },
                },
            },
        },
        user: {
            algorithm: "RS256",
            issuer: "PIiVT",
            tokens: {
                auth: {
                    duration: 60 * 60 * 24,
                    keys: {
                        public: readFileSync("./.keystore/app.public", "ascii"),
                        private: readFileSync("./.keystore/app.private", "ascii"),
                    },
                },
                refresh: {
                    duration: 60 * 60 * 24 * 60, // Za dev: 60 dana - inace treba oko mesec dana
                    keys: {
                        public: readFileSync("./.keystore/app.public", "ascii"),
                        private: readFileSync("./.keystore/app.private", "ascii"),
                    },
                },
            },
        },
        allowAllRoutesWithoutAuthTokens: false, // Samo dok traje razvoj front-end dela bez mogucnosti prijave
    },
};

DevConfig.mail = MailConfigurationParameters;

export { DevConfig };
