import { IEditAddress } from './dto/IEditAddress.dto';
import { IAddAddress } from './dto/IAddAddress.dto';
import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import AddressModel from "./AddressModel.model";

export interface IAddressAdapterOptions extends IAdapterOptions {
    loadUserData: boolean;
}

export default class AddressService extends BaseService<AddressModel, IAddressAdapterOptions> {
    tableName(): string {
        return "address";
    }

    protected adaptToModel(data: any, options: IAddressAdapterOptions = { loadUserData: false }): Promise<AddressModel> {
        return new Promise(async resolve => {
            const address = new AddressModel();

            address.addressId = +data?.address_id;
            address.userId    = +data?.user_id;

            address.streetAndNmber = data?.street_and_nmber;
            address.floor          = data?.floor ?? null;
            address.apartment      = data?.apartment ?? null;
            address.city           = data?.city;
            address.phoneNumber    = data?.phone_number;

            address.isActive       = +data?.is_active === 1;

            if (options.loadUserData) {
                address.user = await this.services.user.getById(address.userId, {
                    removeActivationCode: true,
                    removePassword: true,
                });
            }

            resolve(address);
        });
    }

    public async getAllByUserId(userId: number, options: IAddressAdapterOptions): Promise<AddressModel[]> {
        return this.getAllByFieldNameAndValue("user_id", userId, options);
    }

    public async add(data: IAddAddress, options: IAddressAdapterOptions): Promise<AddressModel> {
        return this.baseAdd(data, options);
    }

    public async editById(addressId: number, data: IEditAddress, options: IAddressAdapterOptions): Promise<AddressModel> {
        return this.baseEditById(addressId, data, options);
    }
}
