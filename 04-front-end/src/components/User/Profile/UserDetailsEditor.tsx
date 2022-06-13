import { faSave, faSquareMinus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { api } from "../../../api/api";
import IUser from "../../../models/IUser.model";

export interface IUserDetailsEditorProperties {
    user: IUser;
    onDataChanged: (user: IUser) => void;
}

interface IInputData {
    value: string;
    isValid: boolean;
}

export default function UserDetailsEditor(props: IUserDetailsEditorProperties) {
    const [ forename, setForename ] = useState<IInputData>({ value: props.user.forename, isValid: true });
    const [ surname,  setSurname  ] = useState<IInputData>({ value: props.user.surname,  isValid: true });
    const [ error,    setError    ] = useState<string>("");
    const [ message,  setMessage  ] = useState<string>("");

    function reset() {
        setForename({
            value: props.user.forename,
            isValid: true,
        });

        setSurname({
            value: props.user.surname,
            isValid: true,
        });
    }

    function forenameChanged(e: React.ChangeEvent<HTMLInputElement>) {
        setForename({
            value: e.target.value,
            isValid: true,
        });

        if (!e.target.value.trim().match(/^.{2,32}$/)) {
            setForename({
                value: e.target.value,
                isValid: false,
            });
        }
    }

    function surnameChanged(e: React.ChangeEvent<HTMLInputElement>) {
        setSurname({
            value: e.target.value,
            isValid: true,
        });

        if (!e.target.value.trim().match(/^.{2,32}$/)) {
            setSurname({
                value: e.target.value,
                isValid: false,
            });
        }
    }

    function doSaveDetails() {
        if (!forename.isValid || !surname.isValid) {
            return;
        }

        api("put", "/api/user/" + props.user.userId, "user", { forename: forename.value, surname: surname.value })
        .then(res => {
            if (res.status !== 'ok') {
                throw new Error("Could not edit user data! Reason: " + JSON.stringify(res.data));
            }

            return res.data;
        })
        .then(user => {
            props.onDataChanged(user);

            setMessage("New user data saved!");

            setTimeout(() => setMessage(''), 5000);
        })
        .catch(error => {
            setError(error?.message ?? 'Unknown error!');

            setTimeout(() => setError(''), 5000);
        });
    }

    return (
        <div className="card">
            <div className="card-body">
                <div className="card-title">
                    <h2 className="h6">Account details</h2>
                </div>

                <div className="card-text">
                    <div className="form-group mb-3">
                        <label>Forename</label>
                        <div className="input-group">
                            <input className={ "form-control" + (!forename.isValid ? " is-invalid": '') } maxLength={ 32 } value={ forename.value }
                                onChange={ e => forenameChanged(e) } />
                        </div>
                    </div>

                    <div className="form-group mb-3">
                        <label>Surname</label>
                        <div className="input-group">
                            <input className={ "form-control" + (!surname.isValid ? " is-invalid": '') } maxLength={ 32 } value={ surname.value }
                                onChange={ e => surnameChanged(e) } />
                        </div>
                    </div>

                    <div className="form-group">
                        <button className="btn btn-primary" onClick={ () => doSaveDetails() }>
                            <FontAwesomeIcon icon={ faSave} /> Save new details
                        </button> <button className="btn btn-secondary" onClick={ () => reset() }>
                            <FontAwesomeIcon icon={ faSquareMinus } /> Reset changes
                        </button>
                    </div>

                    { error && <div className="mt-3 alert alert-danger">{ error }</div> }
                    { message && <div className="mt-3 alert alert-success">{ message }</div> }
                </div>
            </div>
        </div>
    );
}
