import { faSave, faSquareMinus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { api } from "../../../api/api";
import IUser from "../../../models/IUser.model";
import { motion } from "framer-motion";

export interface IUserPasswordChangerProperties {
    user: IUser;
    onPasswordChange: (user: IUser) => void;
}

interface IInputData {
    value: string;
    isValid: boolean;
}

export default function UserPasswordChanger(props: IUserPasswordChangerProperties) {
    const [ newPassword1, setNewPassword1 ] = useState<IInputData>({ value: "", isValid: true });
    const [ newPassword2, setNewPassword2 ] = useState<IInputData>({ value: "",  isValid: true });
    const [ error,    setError    ] = useState<string>("");
    const [ message,  setMessage  ] = useState<string>("");

    function reset() {
        setNewPassword1({
            value: "",
            isValid: true,
        });

        setNewPassword2({
            value: "",
            isValid: true,
        });
    }

    function newPassword1Changed(e: React.ChangeEvent<HTMLInputElement>) {
        setNewPassword1({
            value: e.target.value,
            isValid: true,
        });

        if (!e.target.value.trim().match(/^.{6,32}$/)) {
            setNewPassword1({
                value: e.target.value,
                isValid: false,
            });
        }
    }

    function newPassword2Changed(e: React.ChangeEvent<HTMLInputElement>) {
        setNewPassword2({
            value: e.target.value,
            isValid: true,
        });

        if (!e.target.value.trim().match(/^.{6,32}$/)) {
            setNewPassword2({
                value: e.target.value,
                isValid: false,
            });
        }
    }

    function doSaveDetails() {
        if (!newPassword1.isValid || !newPassword2.isValid) {
            setError('The new password is not valid. Must have at least 6 characters, and must have uppercase letters, lowercase letters, digits and at least one symbol.');
            setTimeout(() => setError(''), 10000);
            return;
        }

        if (newPassword1.value !== newPassword2.value) {
            setError('The passwords in both input fields must match!');
            setTimeout(() => setError(''), 5000);
            return;
        }

        api("put", "/api/user/" + props.user.userId, "user", { password: newPassword1.value })
        .then(res => {
            if (res.status !== 'ok') {
                throw new Error("Could not change the password! Reason: " + JSON.stringify(res.data));
            }

            return res.data;
        })
        .then(user => {
            props.onPasswordChange(user);

            setMessage("The password has been saved!");

            setTimeout(() => setMessage(''), 5000);

            setNewPassword1({ value: '', isValid: true });
            setNewPassword2({ value: '', isValid: true });
        })
        .catch(error => {
            setError(error?.message ?? 'Unknown error!');

            setTimeout(() => setError(''), 5000);
        });
    }

    return (
        <motion.div className="card"
            initial={{
                position: "relative",
                top: 20,
                scale: 0.75,
                opacity: 0,
            }}
            animate={{
                top: 0,
                scale: 1,
                opacity: 1,
            }}
            transition={{
                delay: 0.125,
            }}>
            <div className="card-body">
                <div className="card-title">
                    <h2 className="h6">Account password</h2>
                </div>

                <div className="card-text">
                    <div className="form-group mb-3">
                        <label>New password</label>
                        <div className="input-group">
                            <input type="password" className={ "form-control" + (!newPassword1.isValid ? " is-invalid": '') } maxLength={ 128 } value={ newPassword1.value }
                                onChange={ e => newPassword1Changed(e) } />
                        </div>
                    </div>

                    <div className="form-group mb-3">
                        <label>Repeat the new password</label>
                        <div className="input-group">
                            <input type="password" className={ "form-control" + (!newPassword2.isValid ? " is-invalid": '') } maxLength={ 128 } value={ newPassword2.value }
                                onChange={ e => newPassword2Changed(e) } />
                        </div>
                    </div>

                    <div className="form-group">
                        <button className="btn btn-primary" onClick={ () => doSaveDetails() }>
                            <FontAwesomeIcon icon={ faSave} /> Change the password
                        </button> <button className="btn btn-secondary" onClick={ () => reset() }>
                            <FontAwesomeIcon icon={ faSquareMinus } /> Clear the fields
                        </button>
                    </div>

                    { error && <div className="mt-3 alert alert-danger">{ error }</div> }
                    { message && <div className="mt-3 alert alert-success">{ message }</div> }
                </div>
            </div>
        </motion.div>
    );
}
