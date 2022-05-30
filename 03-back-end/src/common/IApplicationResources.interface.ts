import * as mysql2 from "mysql2/promise";
import AdministratorService from "../components/administrator/AdministratorService.service";
import CategoryService from "../components/category/CategoryService.service";
import IngredientService from "../components/ingredient/IngredientService.service";
import ItemService from "../components/item/ItemService.service";
import PhotoService from "../components/photo/PhotoService.service";
import SizeService from "../components/size/SizeService.service";
import UserService from "../components/user/UserService.service";

export interface IServices {
    category: CategoryService;
    ingredient: IngredientService;
    administrator: AdministratorService;
    size: SizeService;
    item: ItemService;
    photo: PhotoService;
    user: UserService;
}

export default interface IApplicationResources {
    databaseConnection: mysql2.Connection;
    services: IServices;
}
