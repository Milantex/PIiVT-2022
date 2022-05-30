import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import AdministratorModel from "./AdministratorModel.model";
import IAddAdministrator from "./dto/IAddAdministrator.dto";
import IEditAdministrator from "./dto/IEditAdministrator.dto";

export class AdministratorAdapterOptions implements IAdapterOptions {
    removePassword: boolean;
}

export const DefaultAdministratorAdapterOptions: AdministratorAdapterOptions = {
    removePassword: false,
}

export default class AdministratorService extends BaseService<AdministratorModel, AdministratorAdapterOptions> {
    tableName(): string {
        return "administrator";
    }

    protected async adaptToModel(data: any, options: AdministratorAdapterOptions = DefaultAdministratorAdapterOptions): Promise<AdministratorModel> {
        const administrator = new AdministratorModel();

        administrator.administratorId = +data?.administrator_id;
        administrator.username        = data?.username;
        administrator.passwordHash    = data?.password_hash;
        administrator.createdAt       = data?.created_at;
        administrator.isActive        = +data?.is_active === 1;

        if (options.removePassword) {
            administrator.passwordHash = null;
        }

        return administrator;
    }

    public async add(data: IAddAdministrator): Promise<AdministratorModel> {
        return this.baseAdd(data, DefaultAdministratorAdapterOptions);
    }

    public async edit(id: number, data: IEditAdministrator): Promise<AdministratorModel> {
        return this.baseEditById(id, data, {
            removePassword: true,
        });
    }

    public async getByUsername(username: string): Promise<AdministratorModel|null> {
        return new Promise((resolve, reject) => {
            this.getAllByFieldNameAndValue("username", username, {
                removePassword: false,
            })
            .then(result => {
                if (result.length === 0) {
                    return resolve(null);
                }

                resolve(result[0]);
            })
            .catch(error => {
                reject(error);
            });
        });
    }
}
