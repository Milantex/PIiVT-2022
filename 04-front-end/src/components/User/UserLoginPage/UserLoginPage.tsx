import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api";
import AuthStore from "../../../stores/AuthStore";

export default function UserLoginPage() {
    const [ email, setEmail ]       = useState<string>("");
    const [ password, setPassword ] = useState<string>("");
    const [ error, setError ] = useState<string>("");

    const navigate = useNavigate();

    const doLogin = () => {
        api("post", "/api/auth/user/login", "user", { email, password })
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not log in. Reason: " + JSON.stringify(res.data));
            }

            return res.data;
        })
        .then(data => {
            AuthStore.dispatch( { type: "update", key: "authToken", value: data?.authToken } );
            AuthStore.dispatch( { type: "update", key: "refreshToken", value: data?.refreshToken } );
            AuthStore.dispatch( { type: "update", key: "identity", value: email } );
            AuthStore.dispatch( { type: "update", key: "id", value: +(data?.id) } );
            AuthStore.dispatch( { type: "update", key: "role", value: "user" } );

            navigate("/categories", {
                replace: true,
            });
        })
        .catch(error => {
            setError(error?.message ?? "Could not log in!");

            setTimeout(() => {
                setError("");
            }, 3500);
        });
    };

    return (
        <div className="row">
            <div className="col col-xs-12 col-md-6 offset-md-3">
                <h1 className="h5 mb-3">Log into your account</h1>

                <div className="form-group mb-3">
                    <div className="input-group">
                        <input className="form-control" type="text" placeholder="Enter your email" value={ email }
                               onChange={ e => setEmail(e.target.value) } />
                    </div>
                </div>

                <div className="form-group mb-3">
                    <div className="input-group">
                        <input className="form-control" type="password" placeholder="Enter your password" value={ password }
                               onChange={ e => setPassword(e.target.value) }/>
                    </div>
                </div>

                <div className="form-group mb-3">
                    <button className="btn btn-primary px-5" onClick={ () => doLogin() }>
                        Log in
                    </button>
                </div>

                { error && <p className="alert alert-danger">{ error }</p> }
            </div>
        </div>
    );
}
