import { faBell, faContactCard, faListAlt, faRectangleList, faUser, faWindowClose } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import ICart from "../../models/ICart.model";
import AppStore from "../../stores/AppStore";

export default function MenuUser() {
    const [ cartItemCount, setCartItemCount ] = useState<number>(0);
    const [ highlightCart, setHighlightCart ] = useState<boolean>(false);
    const navigate = useNavigate();

    function doUserLogout() {
        AppStore.dispatch( { type: "auth.reset" } );
        navigate("/auth/user/login");
    }

    const loadCartItemCount = () => {
        api("get", "/api/cart", "user")
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not fetch the cart data.");
            }

            return res.data;
        })
        .then((cart: ICart) => {
            if (cart?.content.length === 0) {
                return setCartItemCount(0);
            }

            updateCartItemCount(cart);
        })
        .catch(error => {});
    };

    const updateCartItemCount = (cart: ICart) => {
        const allItemCount = cart?.content.map(item => item.quantity).reduce((sum, quantity) => sum + quantity, 0);
        setCartItemCount(allItemCount);
    }

    useEffect(() => {
        loadCartItemCount();
    }, [ ])

    AppStore.subscribe(() => {
        if (AppStore.getState().cart.cart) {
            return updateCartItemCount(AppStore.getState().cart.cart as ICart);
        }

        loadCartItemCount();

        setHighlightCart(true);

        setTimeout(() => setHighlightCart(false), 4000);
    });

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
            <Link className="navbar-brand" to="/">Hi, { AppStore.getState().auth.identity }</Link>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    <Link className="nav-item nav-link" to="/categories">
                        <FontAwesomeIcon icon={ faListAlt } /> Categories
                    </Link>

                    <Link className="nav-item nav-link" to="/contact">
                        <FontAwesomeIcon icon={ faContactCard } /> Contact
                    </Link>

                    <Link className="nav-item nav-link" to="/profile">
                        <FontAwesomeIcon icon={ faUser } /> My profile
                    </Link>

                    <Link className="nav-item nav-link" to="/orders">
                        <FontAwesomeIcon icon={ faRectangleList } /> My orders
                    </Link>

                    <Link className="nav-item nav-link" to="/cart"
                        style={{ fontWeight: highlightCart ? "bold" : "normal" }}>
                        <FontAwesomeIcon icon={ faBell } /> Cart ({ cartItemCount }) { highlightCart ? "Cart updated!" : "" }
                    </Link>

                    <div className="nav-item nav-link" style={{ cursor: "pointer" }} onClick={ () => doUserLogout() }>
                        <FontAwesomeIcon icon={ faWindowClose } /> Logout
                    </div>
                </div>
            </div>
        </nav>
    );
}
