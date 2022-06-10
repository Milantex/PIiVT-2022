import { Link } from "react-router-dom";
import AuthStore from "../../stores/AuthStore";

export default function MenuAdministrator() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
            <Link className="navbar-brand" to="/">Good day, { AuthStore.getState().identity }</Link>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    <Link className="nav-item nav-link" to="/admin/dashboard">Dashboard</Link>
                    <Link className="nav-item nav-link" to="/auth/administrator/logout">Logout</Link>
                </div>
            </div>
        </nav>
    );
}
