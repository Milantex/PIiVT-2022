import { Link, useNavigate } from "react-router-dom";
import AppStore from "../../stores/AppStore";

export default function MenuAdministrator() {
    const navigate = useNavigate();

    function doAdministratorLogout() {
        AppStore.dispatch( { type: "auth.reset" } );
        navigate("/auth/administrator/login");
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
            <Link className="navbar-brand" to="/">Good day, { AppStore.getState().auth.identity }</Link>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    <Link className="nav-item nav-link" to="/admin/dashboard">Dashboard</Link>
                    <div className="nav-item nav-link" style={{ cursor: "pointer" }} onClick={ () => doAdministratorLogout() }>Logout</div>
                </div>
            </div>
        </nav>
    );
}
