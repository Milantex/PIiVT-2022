import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../../api/api";
import ICategory from "../../../models/ICategory.model";
import IIngredient from "../../../models/IIngredient.model";

export interface IAdminCategoryIngredientsListUrlParams extends Record<string, string | undefined> {
    cid: string
}

interface IAdminIngredientListRowProperties {
    ingredient: IIngredient;
}

export default function AdminCategoryIngredientsList() {
    const params = useParams<IAdminCategoryIngredientsListUrlParams>();

    const [ category, setCategory ] = useState<ICategory>();
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ showAddNewIngredient, setShowAddNewIngredient ] = useState<boolean>(false);

    useEffect(() => {
        loadCategoryData(+(params.cid ?? 0));
    }, [ ]);

    function loadCategoryData(categoryId: number) {
        if (!categoryId) {
            return;
        }

        api("get", "/api/category/" + categoryId, "administrator")
        .then(res => {
            if (res.status === 'error') {
                return setErrorMessage(res.data + "");
            }

            setCategory(res.data);

            setShowAddNewIngredient(false);
        });
    }

    function AdminIngredientListRow(props: IAdminIngredientListRowProperties) {
        const [ name, setName ] = useState<string>(props.ingredient.name);

        const nameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
            setName( e.target.value );
        }

        const doEditIngredient = (e: any) => {
            api("put", "/api/category/" + category?.categoryId + "/ingredient/" + props.ingredient.ingredientId, "administrator", { name })
            .then(res => {
                if (res.status === 'error') {
                    return setErrorMessage("Could not edit this ingredient!");
                }

                loadCategoryData(+(params.cid ?? 0));
            })
        }

        const doDeleteIngredient = (e: any) => {
            api("delete", "/api/category/" + category?.categoryId + "/ingredient/" + props.ingredient.ingredientId, "administrator")
            .then(res => {
                if (res.status === 'error') {
                    return setErrorMessage("Could not delete this ingredient!");
                }

                loadCategoryData(+(params.cid ?? 0));
            })
        }

        return (
            <tr>
                <td>{ props.ingredient.ingredientId }</td>
                <td>
                    <div className="input-group">
                        <input className="form-control form-control-sm"
                               type="text"
                               onChange={ e => nameChanged(e) }
                               value={ name } />
                        { props.ingredient.name !== name
                            ? <button className="btn btn-primary btn-sm" onClick={ e => doEditIngredient(e) }>
                                  Save
                              </button>
                            : ''
                        }
                    </div>
                </td>
                <td>
                    <button className="btn btn-danger btn-sm" onClick={ e => doDeleteIngredient(e) }>
                        Delete
                    </button>
                </td>
            </tr>
        );
    }

    function AdminIngredientAddRow() {
        const [ name, setName ] = useState<string>("");

        const nameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
            setName( e.target.value );
        }

        const doAddIngredient = (e: any) => {
            api("post", "/api/category/" + category?.categoryId + "/ingredient", "administrator", { name })
            .then(res => {
                if (res.status === 'error') {
                    return setErrorMessage("Could not add this ingredient!");
                }

                loadCategoryData(+(params.cid ?? 0));

                setName("");
                setShowAddNewIngredient(false);
            });
        }

        return (
            <tr>
                <td> </td>
                <td>
                    <div className="input-group">
                        <input className="form-control form-control-sm"
                               type="text"
                               onChange={ e => nameChanged(e) }
                               value={ name } />
                        { name.trim().length >= 4 && name.trim().length <= 32
                            ? <button className="btn btn-primary btn-sm" onClick={ e => doAddIngredient(e) }>
                                  Save
                              </button>
                            : ''
                        }
                    </div>
                </td>
                <td>
                    <button className="btn btn-danger btn-sm" onClick={ () => {
                        setShowAddNewIngredient(false);
                        setName("");
                    } }>
                        Cancel
                    </button>
                </td>
            </tr>
        );
    }

    function renderIngredientTable(category: ICategory) {
        return (
            <div>
                <div className="btn-group">
                    <Link className="btn btn-secondary btn-sm" to="/admin/dashboard/category/list">
                        &laquo; Back to category &quot;{ category.name }&quot;
                    </Link>
                    <button className="btn btn-primary btn-sm" onClick={() => { setShowAddNewIngredient(true) }}>Add new ingredient</button>
                </div>

                <table className="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        { showAddNewIngredient && <AdminIngredientAddRow /> }

                        { category.ingredients?.map(ingredient => <AdminIngredientListRow key={ "ingredient-" + ingredient.ingredientId } ingredient={ ingredient } />) }
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div>
            { errorMessage && <p className="alert alert-danger mb-3">{ errorMessage }</p> }
            { category && renderIngredientTable(category) }
        </div>
    );
}
