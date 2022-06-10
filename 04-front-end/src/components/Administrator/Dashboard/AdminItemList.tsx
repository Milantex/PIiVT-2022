import { faCheckSquare, faEdit, faPlusSquare, faSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../../api/api";
import { Config } from "../../../config";
import IItem from "../../../models/IItem.model";

export interface IAdminItemListUrlParams extends Record<string, string | undefined> {
    cid: string
}

export default function AdminItemList() {
    const params = useParams<IAdminItemListUrlParams>();

    const [ items, setItems ] = useState<IItem[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    const loadItems = () => {
        api("get", "/api/category/" + params.cid + "/item", "administrator")
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not load items for this category!");
            }

            return res.data;
        })
        .then(items => {
            setItems(items);
        })
        .catch(error => {
            setErrorMessage(error?.message ?? "Unknown error!");
        });
    };

    useEffect(loadItems, [ params.cid ]);

    return (
        <div className="card">
            <div className="card-body">
                <div className="card-title">
                    <h1 className="h5">List of category items</h1>
                </div>
                <div className="card-text">
                    { errorMessage && <div className="alern alert-danger">{ errorMessage }</div> }

                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th colSpan={5}></th>
                                <th colSpan={2}>
                                    <Link className="btn btn-sm btn-primary" to={ "/admin/dashboard/category/" + params.cid + "/items/add" }>
                                        <FontAwesomeIcon icon={ faPlusSquare } /> Add new item
                                    </Link>
                                </th>
                            </tr>
                            <tr>
                                <th>Photo</th>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Ingredients</th>
                                <th>Sizes</th>
                                <th>State</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            { items.length === 0 && <tr><td colSpan={7}>No items</td></tr> }

                            { items.map(item => (
                                <tr key={ "item-" + item.itemId }>
                                    <td>
                                        {
                                            item.photos.length > 0
                                            ? <img alt={ item.name }
                                                   src={ Config.API_PATH + "/assets/" + item.photos[0].filePath }
                                                   style={ { width: "150px" } } />
                                            : <p>No image</p>
                                        }
                                    </td>
                                    <td>{ item.itemId }</td>
                                    <td>{ item.name }</td>
                                    <td>{ item.ingredients.map(i => i.name).join(", ") }</td>
                                    <td>
                                        <table className="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>kcal</th>
                                                    <th>Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                { item.sizes.map(size => (
                                                    <tr key={ "item-" + item.itemId + "-size-" + size.size.sizeId }>
                                                        <td>{ size.size.name }</td>
                                                        <td>{ size.kcal } kcal</td>
                                                        <td>{ size.price } RSD</td>
                                                    </tr>
                                                )) }
                                            </tbody>
                                        </table>
                                    </td>
                                    <td>
                                        {
                                            item.isActive
                                            ? <><FontAwesomeIcon icon={ faCheckSquare } /> Active</>
                                            : <><FontAwesomeIcon icon={ faSquare } /> Inactive</>
                                        }
                                    </td>
                                    <td>
                                        <Link to={ "/admin/dashboard/category/" + params.cid + "/items/edit/" + item.itemId }
                                            className="btn btn-sm btn-primary">
                                            <FontAwesomeIcon icon={ faEdit } /> Edit
                                        </Link>
                                    </td>
                                </tr>
                            )) }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
