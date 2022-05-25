import IModel from "../../common/IModel.interface";

export default class PhotoModel implements IModel {
    photoId: number;
    name: string;
    filePath: string;
}
