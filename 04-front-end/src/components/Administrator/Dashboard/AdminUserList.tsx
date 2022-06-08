import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faSquareCheck } from "@fortawesome/free-regular-svg-icons";
import './AdminUserList.sass';
import IUser from "../../../models/IUser.model";
import { formatAddress } from "../../../models/IAddress.model";

interface IAdminUserRowProperties {
    user: IUser;
}

export default function AdminUserList() {
    const [ users, setUsers ] = useState<IUser[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    function loadUsers() {
        api("get", "/api/user", "administrator")
        .then(res => {
            if (res.status === 'error') {
                return setErrorMessage(res.data + "");
            }

            setUsers(res.data);
        });
    }

    useEffect(loadUsers, [ ]);

    function AdminUserRow(props: IAdminUserRowProperties) {
        const [ editPasswordVisible, setEditPasswordVisible ] = useState<boolean>(false);
        const [ editNamePartsVisible, setEditNamePartsVisible ] = useState<boolean>(false);
        const [ newPassword, setNewPassword ] = useState<string>("");
        const [ newForename, setNewForename ] = useState<string>(props.user.forename);
        const [ newSurname, setNewSurname ] = useState<string>(props.user.surname);
        const [ showAddresses, setShowAddresses ] = useState<boolean>(false);

        const activeSideClass   = props.user.isActive  ? " btn-primary" : " btn-light";
        const inactiveSideClass = !props.user.isActive ? " btn-primary" : " btn-light";

        function doToggleUserActiveState() {
            api("put", "/api/user/" + props.user.userId, "administrator", {
                isActive: !props.user.isActive,
            })
            .then(res => {
                if (res.status === 'error') {
                    return setErrorMessage(res.data + "");
                }

                loadUsers();
            });
        }

        function doChangePassword() {
            api("put", "/api/user/" + props.user.userId, "administrator", {
                password: newPassword,
            })
            .then(res => {
                if (res.status === 'error') {
                    return setErrorMessage(res.data + "");
                }

                loadUsers();
            });
        }

        function doEditNameParts() {
            api("put", "/api/user/" + props.user.userId, "administrator", {
                forename: newForename,
                surname: newSurname,
            })
            .then(res => {
                if (res.status === 'error') {
                    return setErrorMessage(res.data + "");
                }

                loadUsers();
            });
        }

        return (
            <>
                <tr>
                    <td>{ props.user.userId }</td>
                    <td>{ props.user.email }</td>
                    <td>
                        { !editNamePartsVisible &&
                            <div className="row">
                                <span className="col col-9">{ props.user.forename + " " + props.user.surname }</span>
                                <div className="col col-3">
                                    <button className="btn btn-primary btn-sm" onClick={ () => setEditNamePartsVisible(true) }>
                                        Edit
                                    </button>
                                </div>
                            </div>
                        }
                        { editNamePartsVisible && <div>
                            <div className="form-group mb-3">
                                <input type="text" className="form-control form-control-sm" value={ newForename } onChange={ e => setNewForename(e.target.value) } />
                            </div>

                            <div className="form-group mb-3">
                                <input type="text" className="form-control form-control-sm" value={ newSurname } onChange={ e => setNewSurname(e.target.value) } />
                            </div>

                            { (newForename !== props.user.forename || newSurname !== props.user.surname) &&
                            ( <button className="btn btn-sm btn-primary" onClick={ () => doEditNameParts() }>
                                Edit
                            </button> ) }

                            <button className="btn btn-sm btn-danger" onClick={ () => {
                                setNewForename(props.user.forename);
                                setNewSurname(props.user.surname);
                                setEditNamePartsVisible(false);
                            } }>
                                Cancel
                            </button>
                        </div> }
                    </td>
                    <td>
                        <div className="btn-group" onClick={() => { doToggleUserActiveState() }}>
                            <div className={"btn btn-sm" + activeSideClass}>
                                <FontAwesomeIcon icon={ faSquareCheck } />
                            </div>
                            <div className={"btn btn-sm" + inactiveSideClass}>
                                <FontAwesomeIcon icon={ faSquare } />
                            </div>
                        </div>
                    </td>
                    <td>
                        { !editPasswordVisible && <button className="btn btn-primary btn-sm" onClick={() => { setEditPasswordVisible(true); }}>Change password</button> }
                        { editPasswordVisible && <div className="input-group">
                            <input type="password" className="form-control form-control-sm" value={ newPassword } onChange={ e => setNewPassword(e.target.value) } />
                            <button className="btn btn-success btn-sm" onClick={() => doChangePassword()}>Save</button>
                            <button className="btn btn-danger btn-sm" onClick={() => { setEditPasswordVisible(false); setNewPassword(""); }}>Cancel</button>
                        </div> }
                        { props.user.addresses?.filter(address => address.isActive).length > 0 && (
                            <>
                                &nbsp;&nbsp;
                                { (!editPasswordVisible && !showAddresses) && <button className="btn btn-primary btn-sm" onClick={() => { setShowAddresses(true); }}>Show addresses</button> }
                                { (!editPasswordVisible &&  showAddresses) && <button className="btn btn-primary btn-sm" onClick={() => { setShowAddresses(false); }}>Hide addresses</button> }
                            </>
                        ) }
                    </td>
                </tr>
                { showAddresses &&
                    props.user.addresses
                    ?.filter(address => address.isActive)
                    .map(address => (
                        <tr key={ "address-" + address.addressId }>
                            <td></td>
                            <td colSpan={3}>{ formatAddress(address) }</td>
                            <td></td>
                        </tr>
                    ))
                }
            </>
        );
    }

    return (
        <div>
            { errorMessage && <p className="alert aler-danger">{ errorMessage }</p> }
            { !errorMessage &&
                <table className="table table-sm table-hover user-list">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Full name</th>
                            <th>Status</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        { users.map(user => <AdminUserRow key={ "user" + user.userId } user={ user } />) }
                    </tbody>
                </table>
            }
        </div>
    );
}
