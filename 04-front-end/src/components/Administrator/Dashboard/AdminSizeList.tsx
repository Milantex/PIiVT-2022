import React, { useEffect, useState } from "react";
import { api } from "../../../api/api";
import { ISizeModel } from "../../../models/ISize.model";

interface IAdminSizeListRowProperties {
    size: ISizeModel,
}

export default function AdminSizeList() {
    const [ sizes, setCategories ] = useState<ISizeModel[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ showAddNewSize, setShowAddNewSize ] = useState<boolean>(false);

    function AdminSizeListRow(props: IAdminSizeListRowProperties) {
        const [ name, setName ] = useState<string>(props.size.name);

        const nameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
            setName( e.target.value );
        }

        const doEditSize = (e: any) => {
            api("put", "/api/size/" + props.size.sizeId, "administrator", { name })
            .then(res => {
                if (res.status === 'error') {
                    return setErrorMessage("Could not edit this size!");
                }

                loadSizes();
            })
        }

        return (
            <tr>
                <td>{ props.size.sizeId }</td>
                <td>
                    <div className="input-group">
                        <input className="form-control form-control-sm"
                               type="text"
                               onChange={ e => nameChanged(e) }
                               value={ name } />
                        { props.size.name !== name
                            ? <button className="btn btn-primary btn-sm" onClick={ e => doEditSize(e) }>
                                  Save
                              </button>
                            : ''
                        }
                    </div>
                </td>
                <td>
                    
                </td>
            </tr>
        );
    }

    function AdminSizeListAddRow() {
        const [ name, setName ] = useState<string>("");

        const nameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
            setName( e.target.value );
        }

        const doAddSize = (e: any) => {
            api("post", "/api/size", "administrator", { name })
            .then(res => {
                if (res.status === 'error') {
                    return setErrorMessage("Could not add this size!");
                }

                loadSizes();

                setName("");
                setShowAddNewSize(false);
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
                            ? <button className="btn btn-primary btn-sm" onClick={ e => doAddSize(e) }>
                                  Save
                              </button>
                            : ''
                        }
                    </div>
                </td>
                <td>
                    <button className="btn btn-danger btn-sm" onClick={ () => {
                        setShowAddNewSize(false);
                        setName("");
                    } }>
                        Cancel
                    </button>
                </td>
            </tr>
        );
    }

    const loadSizes = () => {
        api("get", "/api/size", "administrator")
        .then(apiResponse => {
            if (apiResponse.status === 'ok') {
                return setCategories(apiResponse.data);
            }

            throw new Error('Unknown error while loading sizes...');
        })
        .catch(error => {
            setErrorMessage(error?.message ?? 'Unknown error while loading sizes...');
        });
    }

    useEffect(() => {
        loadSizes();
    }, [ ]);

    return (
        <div>
            { errorMessage && <p>Error: { errorMessage }</p> }
            { !errorMessage &&
                <div>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowAddNewSize(true)}>Add new size</button>

                    <table className="table table-bordered table-striped table-hover table-sm mt-3">
                        <thead>
                            <tr>
                                <th className="size-row-id">ID</th>
                                <th>Name</th>
                                <th className="size-row-options">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            { showAddNewSize && <AdminSizeListAddRow /> }
                            { sizes.map(size => <AdminSizeListRow key={ "size-row-" + size.sizeId } size={ size } />) }
                        </tbody>
                    </table>
                </div>
            }
        </div>
    );
}
