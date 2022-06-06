import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from "@fortawesome/free-regular-svg-icons";
import { api } from "../../../api/api";
import { useNavigate } from "react-router-dom";

export default function AdminAdministratorAdd() {
    const [ username, setUsername ] = useState<string>("");
    const [ password, setPassword ] = useState<string>("");
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    const navigate = useNavigate();

    function doAddAdministrator() {
        api("post", "/api/administrator", "administrator", { username, password })
        .then(res => {
            if (res.status === 'error') {
                return setErrorMessage(res.data + "");
            }

            navigate("/admin/dashboard/administrator/list", {
                replace: true,
            });
        });
    }

    return (
        <div className="row">
            <div className="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title">
                            <h1 className="h5">Add new administrator</h1>
                        </div>
                        <div className="card-text p-2">
                            <div className="form-group mb-2">
                                <label htmlFor="input-username">Username</label>
                                <input type="text" id="input-username" className="form-control"
                                       value={ username }
                                       onChange={ e => setUsername(e.target.value) } />
                            </div>

                            <div className="form-group mb-4">
                                <label htmlFor="input-password">Password</label>
                                <input type="password" id="input-password" className="form-control"
                                       value={ password }
                                       onChange={ e => setPassword(e.target.value) } />
                            </div>

                            <div className="form-group">
                                <button className="btn btn-primary" onClick={ () => doAddAdministrator() }>
                                    <FontAwesomeIcon icon={ faSave } />
                                    &nbsp; Add new administrator
                                </button>
                            </div>

                            { errorMessage && <p className="mt-4 alert alert-danger">{ errorMessage }</p> }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
