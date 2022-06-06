export default interface ISize {
    size: ISizeModel;
    price: number;
    kcal: number;
    isActive: boolean;
}

export interface ISizeModel {
    sizeId: number;
    name: string;
}
