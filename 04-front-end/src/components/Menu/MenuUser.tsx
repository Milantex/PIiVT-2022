import { Link, useNavigate } from "react-router-dom";
import AuthStore from "../../stores/AuthStore";

export default function MenuUser() {
    const navigate = useNavigate();

    function doUserLogout() {
        AuthStore.dispatch( { type: "reset" } );
        navigate("/auth/user/login");
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
            <Link className="navbar-brand" to="/">Hi, { AuthStore.getState().identity }</Link>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    <Link className="nav-item nav-link" to="/categories">Categories</Link>
                    <Link className="nav-item nav-link" to="/contact">Contact</Link>
                    <Link className="nav-item nav-link" to="/orders">My orders</Link>
                    <Link className="nav-item nav-link" to="/cart">Cart</Link>
                    <div className="nav-item nav-link" style={{ cursor: "pointer" }} onClick={ () => doUserLogout() }>Logout</div>
                </div>
            </div>
        </nav>
    );
}
