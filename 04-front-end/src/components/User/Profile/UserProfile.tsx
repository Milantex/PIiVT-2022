import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import IUser from "../../../models/IUser.model";
import AppStore from "../../../stores/AppStore";
import UserAddressManager from "./UserAddressManager";
import UserDetailsEditor from "./UserDetailsEditor";
import UserPasswordChanger from "./UserPasswordChanger";

export default function UserProfile() {
    const [ user, setUser ] = useState<IUser>();

    function loadUserData() {
        if ( AppStore.getState().auth.role !== "user" ) {
            return;
        }

        api("get", "/api/user/" + AppStore.getState().auth.id, "user")
        .then(res => {
            if (res.status !== 'ok') {
                throw new Error("Coudl not fetch this data. Reason: " + JSON.stringify(res.data));
            }

            return res.data;
        })
        .then(user => {
            setUser(user);
        })
        .catch(error => {

        });
    };

    useEffect(loadUserData, []);

    if (AppStore.getState().auth.role !== "user") {
        return null;
    }

    return (
        <div className="card">
            <div className="card-body">
                <div className="card-title mb-3">
                    <h1 className="h5">My profile</h1>
                </div>
                <div className="card-text">
                    <div className="row mb-4">
                        <div className="col col-12 col-lg-6">
                            { user && <UserDetailsEditor   user={ user } onDataChanged={ user => setUser(user) } /> }
                        </div>

                        <div className="col col-12 col-lg-6">
                            { user && <UserPasswordChanger user={ user } onPasswordChange={ user => setUser(user) } /> }
                        </div>
                    </div>

                    <div className="row">
                        <div className="col col-12">
                            { user && <UserAddressManager user={ user } onAddressChange={ user => setUser(user) } /> }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
