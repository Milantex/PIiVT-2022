import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, apiForm } from "../../../api/api";
import ICategory from "../../../models/ICategory.model";
import { ISizeModel } from "../../../models/ISize.model";

export interface IAdminItemAddUrlParams extends Record<string, string | undefined> {
    cid: string
}

interface IAddItemFormState {
    name: string;
    description: string;
    ingredientIds: number[];
    sizes: {
        sizeId: number;
        kcal: number;
        price: number;
    }[];
};

type TSetName          = { type: "addItemForm/setName",          value: string };
type TSetDescription   = { type: "addItemForm/setDescription",   value: string };
type TAddIngredient    = { type: "addItemForm/addIngredient",    value: number };
type TRemoveIngredient = { type: "addItemForm/removeIngredient", value: number };
type TAddSize          = { type: "addItemForm/addSize",          value: number };
type TRemoveSize       = { type: "addItemForm/removeSize",       value: number };
type TSetSizeKCal      = { type: "addItemForm/setSizeKCal",      value: { sizeId: number, kcal: number } };
type TSetSizePrice     = { type: "addItemForm/setSizePrice",     value: { sizeId: number, price: number } };

type AddItemFormAction = TSetName
                       | TSetDescription
                       | TAddIngredient
                       | TRemoveIngredient
                       | TAddSize
                       | TRemoveSize
                       | TSetSizeKCal
                       | TSetSizePrice;

function AddItemFormReducer(oldState: IAddItemFormState, action: AddItemFormAction): IAddItemFormState {
    switch (action.type) {
        case "addItemForm/setName": {
            return {
                ...oldState,
                ingredientIds: [ ...oldState.ingredientIds ],
                sizes: [ ...oldState.sizes.map(size => { return { ...size } }) ],
                // This changes:
                name: action.value,
            }
        }

        case "addItemForm/setDescription": {
            return {
                ...oldState,
                ingredientIds: [ ...oldState.ingredientIds ],
                sizes: [ ...oldState.sizes.map(size => { return { ...size } }) ],
                // This changes:
                description: action.value,
            }
        }

        case "addItemForm/addIngredient": {
            if (oldState.ingredientIds.includes(action.value)) {
                return oldState;
            }

            return {
                ...oldState,
                sizes: [ ...oldState.sizes.map(size => { return { ...size } }) ],
                // This changes:
                ingredientIds: [ ...oldState.ingredientIds, action.value ],
            }
        }

        case "addItemForm/removeIngredient": {
            if (!oldState.ingredientIds.includes(action.value)) {
                return oldState;
            }

            return {
                ...oldState,
                sizes: [ ...oldState.sizes.map(size => { return { ...size } }) ],
                // This changes:
                ingredientIds: [ ...oldState.ingredientIds ].filter( ingredient => ingredient !== action.value ),
            }
        }

        case "addItemForm/addSize": {
            if (oldState.sizes.find(size => size.sizeId === action.value)) {
                return oldState;
            }

            return {
                ...oldState,
                ingredientIds: [ ...oldState.ingredientIds ],
                // This changes:
                sizes: [ ...oldState.sizes.map(size => { return { ...size } }), { sizeId: action.value, kcal: 0, price: 0 } ],
            }
        }

        case "addItemForm/removeSize": {
            if (!oldState.sizes.find(size => size.sizeId === action.value)) {
                return oldState;
            }

            return {
                ...oldState,
                ingredientIds: [ ...oldState.ingredientIds ],
                // This changes:
                sizes: [ ...oldState.sizes.map(size => { return { ...size } }).filter( size => size.sizeId !== action.value ) ],
            }
        }

        case "addItemForm/setSizeKCal": {
            if (!oldState.sizes.find(size => size.sizeId === action.value.sizeId)) {
                return oldState;
            }

            return {
                ...oldState,
                ingredientIds: [ ...oldState.ingredientIds ],
                // This changes:
                sizes: [ ...oldState.sizes.map(size => {
                    if (action.value.sizeId !== size.sizeId) {
                        return { ...size }
                    }

                    return {
                        ...size,
                        kcal: action.value.kcal
                    }
                }) ],
            }
        }

        case "addItemForm/setSizePrice": {
            if (!oldState.sizes.find(size => size.sizeId === action.value.sizeId)) {
                return oldState;
            }

            return {
                ...oldState,
                ingredientIds: [ ...oldState.ingredientIds ],
                // This changes:
                sizes: [ ...oldState.sizes.map(size => {
                    if (action.value.sizeId !== size.sizeId) {
                        return { ...size }
                    }

                    return {
                        ...size,
                        price: action.value.price
                    }
                }) ],
            }
        }

        default: return oldState;
    }
}

export default function AdminItemAdd() {
    const params = useParams<IAdminItemAddUrlParams>();
    const categoryId = params.cid;

    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ category, setCategory ] = useState<ICategory>();
    const [ sizes, setSizes ] = useState<ISizeModel[]>([]);
    const [ file, setFile ] = useState<File>();

    const navigate = useNavigate();

    const [ formState, dispatchFormStateAction ] = useReducer(AddItemFormReducer, {
        name: "",
        description: "",
        ingredientIds: [],
        sizes: [],
    });

    const loadCategory = () => {
        api("get", "/api/category/" + categoryId, "administrator")
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not load this category!");
            }

            return res.data;
        })
        .then(category => {
            setCategory(category);
        })
        .catch(error => {
            setErrorMessage(error?.message ?? "Unknown error!");
        });
    };

    const loadSizes = () => {
        api("get", "/api/size", "administrator")
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not load size information!");
            }

            return res.data;
        })
        .then(sizes => {
            setSizes(sizes);
        })
        .catch(error => {
            setErrorMessage(error?.message ?? "Unknown error!");
        });
    };

    const doAddItem = () => {
        api("post", "/api/category/" + categoryId + "/item", "administrator", formState)
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not add this item! Reason: " + res?.data?.map((error: any) => error?.instancePath + " " + error?.message).join(", "));
            }

            return res.data;
        })
        .then(item => {
            if (!item?.itemId) {
                throw new Error("Could not fetch new item data!");
            }

            return item;
        })
        .then(item => {
            if (!file) {
                throw new Error("No item photo selected!");
            }

            return {
                file,
                item
            };
        })
        .then(({ file, item }) => {
            const data = new FormData();
            data.append("image", file);
            return apiForm("post", "/api/category/" + categoryId + "/item/" + item?.itemId + "/photo", "administrator", data)
        })
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not upload item photo!");
            }

            return res.data;
        })
        .then(() => {
            navigate("/admin/dashboard/category/" + categoryId + "/items/list", {
                replace: true,
            });
        })
        .catch(error => {
            setErrorMessage(error?.message ?? "Unknown error!");
        });
    };

    useEffect(() => {
        loadCategory();
        loadSizes();
    }, [ params.cid ]);

    return (
        <div>
            <div className="card">
                <div className="card-body">
                    <div className="card-title">
                        <h1 className="h5">Add new item</h1>
                    </div>
                    <div className="card-text">
                        { errorMessage && <div className="alert alert-danger mb-3">{ errorMessage }</div> }

                        <div className="form-group mb-3">
                            <label>Name</label>
                            <div className="input-group">
                                <input type="text" className="form-control form-control-sm"
                                    value={ formState.name }
                                    onChange={ e => dispatchFormStateAction({ type: "addItemForm/setName", value: e.target.value }) }
                                    />
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <label>Description</label>
                            <div className="input-group">
                                <textarea className="form-control form-control-sm" rows={ 5 }
                                    value={ formState.description }
                                    onChange={ e => dispatchFormStateAction({ type: "addItemForm/setDescription", value: e.target.value }) }
                                    />
                            </div>
                        </div>

                        <div className="form-froup mb-3">
                            <label>Ingredients</label>

                            { category?.ingredients?.map(ingredient => (
                                <div key={ "ingredient-" + ingredient.ingredientId }>
                                    {
                                        formState.ingredientIds.includes(ingredient.ingredientId)
                                        ? <FontAwesomeIcon onClick={ () => dispatchFormStateAction({ type: "addItemForm/removeIngredient", value: ingredient.ingredientId }) } icon={ faCheckSquare } />
                                        : <FontAwesomeIcon onClick={ () => dispatchFormStateAction({ type: "addItemForm/addIngredient", value: ingredient.ingredientId }) } icon={ faSquare } />
                                    } { ingredient.name }
                                </div>
                            )) }
                        </div>

                        <div className="form-froup mb-3">
                            <label>Sizes</label>

                            { sizes?.map(size => {
                                const sizeData = formState.sizes.find(s => s.sizeId === size.sizeId);

                                return (
                                    <div className="row" key={ "size-" + size.sizeId }>
                                        <div className="col col-3">
                                            {
                                                sizeData
                                                ? <FontAwesomeIcon onClick={ () => dispatchFormStateAction({ type: "addItemForm/removeSize", value: size.sizeId }) } icon={ faCheckSquare } />
                                                : <FontAwesomeIcon onClick={ () => dispatchFormStateAction({ type: "addItemForm/addSize", value: size.sizeId }) } icon={ faSquare } />
                                            } { size.name }
                                        </div>

                                        {
                                            sizeData && (
                                                <>
                                                    <div className="col col-2">
                                                        <div className="input-group input-group-sm">
                                                            <input type="number" min={ 0.01 } step={ 0.01 }
                                                                value={ sizeData.kcal }
                                                                className="form-control form-control-sm"
                                                                onChange={ e => dispatchFormStateAction({ type: "addItemForm/setSizeKCal", value: { sizeId: size.sizeId, kcal: +e.target.value } }) }
                                                                />
                                                            <span className="input-group-text">kcal</span>
                                                        </div>
                                                    </div>
                                                    <div className="col col-2">
                                                        <div className="input-group input-group-sm">
                                                        <input type="number" min={ 0.01 } step={ 0.01 }
                                                            value={ sizeData.price }
                                                            className="form-control form-control-sm"
                                                            onChange={ e => dispatchFormStateAction({ type: "addItemForm/setSizePrice", value: { sizeId: size.sizeId, price: +e.target.value } }) }
                                                            />
                                                            <span className="input-group-text">RSD</span>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        }
                                    </div>
                                );
                            }) }
                        </div>

                        <div className="form-froup mb-3">
                            <label>Item image</label>
                            <div className="input-group">
                                <input type="file" accept=".jpg,.png" className="from-control form-control-sm"
                                     onChange={ e => {
                                        if (e.target.files) {
                                            setFile(e.target.files[0])
                                        }
                                     } }
                                />
                            </div>
                        </div>

                        <div className="form-froup mb-3">
                            <button className="btn btn-primary" onClick={ () => doAddItem() }>
                                Add item
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
