import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, apiForm } from "../../../api/api";
import ICategory from "../../../models/ICategory.model";
import IItem from "../../../models/IItem.model";
import { ISizeModel } from "../../../models/ISize.model";

export interface IAdminItemEditUrlParams extends Record<string, string | undefined> {
    cid: string
    iid: string
}

interface IEditItemFormState {
    name: string;
    description: string;
    ingredientIds: number[];
    isActive: boolean;
    sizes: {
        sizeId: number;
        kcal: number;
        price: number;
    }[];
};

type TSetName          = { type: "editItemForm/setName",          value: string };
type TSetDescription   = { type: "editItemForm/setDescription",   value: string };
type TAddIngredient    = { type: "editItemForm/addIngredient",    value: number };
type TRemoveIngredient = { type: "editItemForm/removeIngredient", value: number };
type TAddSize          = { type: "editItemForm/addSize",          value: number };
type TAddSizeFull      = { type: "editItemForm/addSizeFull",      value: { sizeId: number, kcal: number, price: number } };
type TRemoveSize       = { type: "editItemForm/removeSize",       value: number };
type TSetSizeKCal      = { type: "editItemForm/setSizeKCal",      value: { sizeId: number, kcal: number } };
type TSetSizePrice     = { type: "editItemForm/setSizePrice",     value: { sizeId: number, price: number } };
type TToggleIsActive   = { type: "editItemForm/toggleIsActive" };

type EditItemFormAction = TSetName
                        | TSetDescription
                        | TAddIngredient
                        | TRemoveIngredient
                        | TAddSize
                        | TAddSizeFull
                        | TRemoveSize
                        | TSetSizeKCal
                        | TSetSizePrice
                        | TToggleIsActive;

function EditItemFormReducer(oldState: IEditItemFormState, action: EditItemFormAction): IEditItemFormState {
    switch (action.type) {
        case "editItemForm/setName": {
            return {
                ...oldState,
                ingredientIds: [ ...oldState.ingredientIds ],
                sizes: [ ...oldState.sizes.map(size => { return { ...size } }) ],
                // This changes:
                name: action.value,
            }
        }

        case "editItemForm/setDescription": {
            return {
                ...oldState,
                ingredientIds: [ ...oldState.ingredientIds ],
                sizes: [ ...oldState.sizes.map(size => { return { ...size } }) ],
                // This changes:
                description: action.value,
            }
        }

        case "editItemForm/addIngredient": {
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

        case "editItemForm/removeIngredient": {
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

        case "editItemForm/addSize": {
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

        case "editItemForm/addSizeFull": {
            if (oldState.sizes.find(size => size.sizeId === action.value.sizeId)) {
                return oldState;
            }

            return {
                ...oldState,
                ingredientIds: [ ...oldState.ingredientIds ],
                // This changes:
                sizes: [ ...oldState.sizes.map(size => { return { ...size } }), {
                    sizeId: action.value.sizeId,
                    kcal: +action.value.kcal,
                    price: +action.value.price,
                } ],
            }
        }

        case "editItemForm/removeSize": {
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

        case "editItemForm/setSizeKCal": {
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

        case "editItemForm/setSizePrice": {
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

        case "editItemForm/toggleIsActive": {
            return {
                ...oldState,
                ingredientIds: [ ...oldState.ingredientIds ],
                sizes: [ ...oldState.sizes.map(size => { return { ...size } }) ],
                // This changes:
                isActive: !oldState.isActive,
            }
        }

        default: return oldState;
    }
}

export default function AdminItemEdit() {
    const params = useParams<IAdminItemEditUrlParams>();
    const categoryId = params.cid;
    const itemId = params.iid;

    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ category, setCategory ] = useState<ICategory>();
    const [ item, setItem ] = useState<IItem>();
    const [ sizes, setSizes ] = useState<ISizeModel[]>([]);

    const navigate = useNavigate();

    const [ formState, dispatchFormStateAction ] = useReducer(EditItemFormReducer, {
        name: "",
        description: "",
        ingredientIds: [],
        sizes: [],
        isActive: false,
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

    const loadItem = () => {
        api("get", "/api/category/" + categoryId + "/item/" + itemId, "administrator")
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not load this item!");
            }

            return res.data;
        })
        .then(item => {
            setItem(item);
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

    const doEditItem = () => {
        api("put", "/api/category/" + categoryId + "/item/" + itemId, "administrator", formState)
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not edit this item! Reason: " + res?.data?.map((error: any) => error?.instancePath + " " + error?.message).join(", "));
            }

            return res.data;
        })
        .then(item => {
            if (!item?.itemId) {
                throw new Error("Could not fetch the edited item data!");
            }
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
        loadSizes();
    }, [ ]);

    useEffect(() => {
        setErrorMessage("");
        loadCategory();
        loadItem();
    }, [ params.cid, params.iid, ]);

    useEffect(() => {
        dispatchFormStateAction({ type: "editItemForm/setName", value: item?.name ?? '' });
        dispatchFormStateAction({ type: "editItemForm/setDescription", value: item?.description ?? '' });

        for (let ingredient of item?.ingredients ?? []) {
            dispatchFormStateAction({ type: "editItemForm/addIngredient", value: ingredient.ingredientId });
        }

        for (let size of (item?.sizes ?? []).filter(size => size.isActive)) {
            dispatchFormStateAction({ type: "editItemForm/addSizeFull", value: {
                sizeId: size.size.sizeId,
                kcal: size.kcal,
                price: size.price,
            } });
        }

        if (item?.isActive) {
            dispatchFormStateAction({ type: "editItemForm/toggleIsActive" });
        }
    }, [ item ]);

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
                                    onChange={ e => dispatchFormStateAction({ type: "editItemForm/setName", value: e.target.value }) }
                                    />
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <label>Description</label>
                            <div className="input-group">
                                <textarea className="form-control form-control-sm" rows={ 5 }
                                    value={ formState.description }
                                    onChange={ e => dispatchFormStateAction({ type: "editItemForm/setDescription", value: e.target.value }) }
                                    />
                            </div>
                        </div>

                        <div className="form-froup mb-3">
                            <label>Ingredients</label>

                            { category?.ingredients?.map(ingredient => (
                                <div key={ "ingredient-" + ingredient.ingredientId }>
                                    {
                                        formState.ingredientIds.includes(ingredient.ingredientId)
                                        ? <FontAwesomeIcon onClick={ () => dispatchFormStateAction({ type: "editItemForm/removeIngredient", value: ingredient.ingredientId }) } icon={ faCheckSquare } />
                                        : <FontAwesomeIcon onClick={ () => dispatchFormStateAction({ type: "editItemForm/addIngredient", value: ingredient.ingredientId }) } icon={ faSquare } />
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
                                                ? <FontAwesomeIcon onClick={ () => dispatchFormStateAction({ type: "editItemForm/removeSize", value: size.sizeId }) } icon={ faCheckSquare } />
                                                : <FontAwesomeIcon onClick={ () => dispatchFormStateAction({ type: "editItemForm/addSize", value: size.sizeId }) } icon={ faSquare } />
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
                                                                onChange={ e => dispatchFormStateAction({ type: "editItemForm/setSizeKCal", value: { sizeId: size.sizeId, kcal: +e.target.value } }) }
                                                                />
                                                            <span className="input-group-text">kcal</span>
                                                        </div>
                                                    </div>
                                                    <div className="col col-2">
                                                        <div className="input-group input-group-sm">
                                                        <input type="number" min={ 0.01 } step={ 0.01 }
                                                            value={ sizeData.price }
                                                            className="form-control form-control-sm"
                                                            onChange={ e => dispatchFormStateAction({ type: "editItemForm/setSizePrice", value: { sizeId: size.sizeId, price: +e.target.value } }) }
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
                            <label>Status</label>
                            <div className="input-group">
                                <div onClick={ () => dispatchFormStateAction({ type: "editItemForm/toggleIsActive" }) }>
                                    <FontAwesomeIcon icon={ formState.isActive ? faCheckSquare : faSquare } /> { formState.isActive ? "Active" : "Inactive" }
                                </div>
                            </div>
                        </div>

                        <div className="form-froup mb-3">
                            <button className="btn btn-primary" onClick={ () => doEditItem() }>
                                Edit item
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
