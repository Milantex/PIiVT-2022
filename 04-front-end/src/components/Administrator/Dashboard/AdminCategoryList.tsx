import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../api/api";
import ICategory from "../../../models/ICategory.model";
import './AdminCategoryList.sass';

interface IAdminCategoryListRowProperties {
    category: ICategory,
}

export default function AdminCategoryList() {
    const [ categories, setCategories ] = useState<ICategory[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    function AdminCategoryListRow(props: IAdminCategoryListRowProperties) {
        const [ name, setName ] = useState<string>(props.category.name);

        const nameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
            setName( e.target.value );
        }

        const doEditCategory = (e: any) => {
            api("put", "/api/category/" + props.category.categoryId, "administrator", { name })
            .then(res => {
                if (res.status === 'error') {
                    return setErrorMessage("Could not edit this category!");
                }

                loadCategories();
            })
        }

        return (
            <tr>
                <td>{ props.category.categoryId }</td>
                <td>
                    <div className="input-group">
                        <input className="form-control form-control-sm"
                               type="text"
                               onChange={ e => nameChanged(e) }
                               value={ name } />
                        { props.category.name !== name
                            ? <button className="btn btn-primary btn-sm" onClick={ e => doEditCategory(e) }>
                                  Save
                              </button>
                            : ''
                        }
                    </div>
                </td>
                <td>
                    <Link className="btn btn-primary btn-sm" to={ "/admin/dashboard/category/" + props.category.categoryId + "/ingredients" }>
                        List ingredients
                    </Link>
                </td>
            </tr>
        );
    }

    const loadCategories = () => {
        api("get", "/api/category", "administrator")
        .then(apiResponse => {
            if (apiResponse.status === 'ok') {
                return setCategories(apiResponse.data);
            }

            throw { message: 'Unknown error while loading categories...', }
        })
        .catch(error => {
            setErrorMessage(error?.message ?? 'Unknown error while loading categories...');
        });
    }

    useEffect(() => {
        loadCategories();
    }, [ ]);

    return (
        <div>
            { errorMessage && <p>Error: { errorMessage }</p> }
            { !errorMessage &&
                <table className="table table-bordered table-striped table-hover table-sm">
                    <thead>
                        <tr>
                            <th className="category-row-id">ID</th>
                            <th>Name</th>
                            <th className="category-row-options">Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        { categories.map(category => <AdminCategoryListRow key={ "category-row-" + category.categoryId } category={ category } />) }
                    </tbody>
                </table>
            }
        </div>
    );
}
