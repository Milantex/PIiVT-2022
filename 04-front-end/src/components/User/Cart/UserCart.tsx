import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api";
import { formatAddress } from "../../../models/IAddress.model";
import ICart from "../../../models/ICart.model";
import IUser from "../../../models/IUser.model";
import AppStore from "../../../stores/AppStore";
import CartPreview from "../../Cart/CartPreview";

export default function UserCart() {
    const [ cart, setCart ] = useState<ICart>();
    const [ user, setUser ] = useState<IUser>();
    const [ selectedAddress, setSelectedAddress ] = useState<number>();
    const [ deliveryTime, setDeliveryTime ] = useState<string>("");

    const navigator = useNavigate();

    function loadUserData() {
        api("get", "/api/user/" + AppStore.getState().auth.id, "user")
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not load user data!");
            }

            return res.data;
        })
        .then(userData => {
            setUser(userData);
            setSelectedAddress(userData.addresses[0].addressId);
        })
        .catch(() => {
            // Show errors
        });
    }

    function loadCartData() {
        api("get", "/api/cart", "user")
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not load cart data!");
            }

            return res.data;
        })
        .then(cartData => {
            setCart(cartData);
        })
        .catch(() => {
            // Show errors
        });
    }

    function doSendOrder() {
        if (deliveryTime.match(/^[0-9]{2}:[0-9]{2}$/) === null) {
            return;
        }

        // Jos validacija... npr. da li je vreme u buducnosti minimum 45 minuta itd...

        api("post", "/api/cart/order", "user", {
            addressId: selectedAddress,
            deliverAt: deliveryTime,
        })
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not make this order!");
            }
        })
        .then(() => {
            return api("get", "/api/cart", "user");
        })
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not make this order!");
            }

            return res.data;
        })
        .then(newCart => {
            navigator("/orders");
            AppStore.dispatch( { type: "cart.update", value: newCart } );
        })
        .catch(() => {
            // Show errors
        });
    }

    useEffect(() => {
        loadCartData();
        loadUserData();
    }, []);

    return (
        <div>
            <h1 className="h4 mb-3">My cart</h1>
            { cart && <CartPreview cart={ cart } /> }

            { (cart?.content.length ?? 0) > 0 &&
                <div className="mt-3 card">
                    <div className="card-body">
                        <div className="card-title">
                            <h2 className="h6">Make an order</h2>
                        </div>
                        <div className="card-text">
                            <div className="form-group mb-3">
                                <label>Select the delivery address:</label>
                                <div className="input-group">
                                    <select className="form-control" value={ selectedAddress } onChange={ e => setSelectedAddress(+(e.target.value)) }>
                                        { user?.addresses.map(address => <option key={ "address-" + address.addressId } value={ address.addressId }>
                                            { formatAddress(address) }
                                        </option>) }
                                    </select>
                                </div>
                            </div>

                            <div className="form-group mb-3">
                                <label>Select the delivery time:</label>
                                <div className="input-group">
                                    <input type="time" className="form-control" value={ deliveryTime }
                                        onChange={ e => setDeliveryTime(e.target.value) } />
                                </div>
                            </div>

                            <div className="form-group mb-3">
                                <button className="btn btn-primary" onClick={ () => doSendOrder() }>
                                    <FontAwesomeIcon icon={ faPaperPlane } /> Send order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                }           
        </div>
    );
}
