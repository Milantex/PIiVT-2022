import { IMailConfiguration } from "./common/IConfig.interface"

const MailConfigurationParameters: IMailConfiguration = {
    host: "smtp.office365.com",
    port: 587,
    email: "",
    password: "",
    debug: true,
}

export { MailConfigurationParameters };
