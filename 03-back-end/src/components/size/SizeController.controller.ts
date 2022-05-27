import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import { AddSizeValidator, IAddSizeDto } from "./dto/IAddSize.dto";
import { EditSizeValidator, IEditSizeDto } from "./dto/IEditSize.dto";

export default class SizeController extends BaseController {
    getAll(req: Request, res: Response) {
        this.services.size.getAll({})
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(500).send(error?.message ?? "Internal server error!");
        });
    }

    getById(req: Request, res: Response) {
        const sizeId: number = +(req.params?.id);

        this.services.size.getById(sizeId, {})
        .then(result => {
            if (result === null) {
                return res.status(404).send("Size not found!");
            }

            res.send(result);
        })
        .catch(error => {
            res.status(500).send(error?.message ?? "Internal server error!");
        });
    }

    add(req: Request, res: Response) {
        const data = req.body as IAddSizeDto;

        if (!AddSizeValidator(data)) {
            return res.status(400).send(AddSizeValidator.errors);
        }

        this.services.size.add(data)
        .then(result => {
            if (result === null) {
                return res.status(400).send("Bad size data given!");
            }

            res.send(result);
        })
        .catch(error => {
            res.status(500).send(error?.message ?? "Internal server error!");
        });
    }

    edit(req: Request, res: Response) {
        const sizeId: number = +(req.params?.id);
        const data = req.body as IEditSizeDto;

        if (!EditSizeValidator(data)) {
            return res.status(400).send(EditSizeValidator.errors);
        }

        this.services.size.getById(sizeId, {})
        .then(result => {
            if (result === null) {
                throw {
                    status: 404,
                    message: "Size not found!",
                }
            }
        })
        .then(() => {
            return this.services.size.editById(sizeId, data);
        })
        .then(size => {
            res.send(size);
        })
        .catch(error => {
            res.status(error?.status ?? 500).send(error?.message ?? "Internal server error!");
        });
    }
}
