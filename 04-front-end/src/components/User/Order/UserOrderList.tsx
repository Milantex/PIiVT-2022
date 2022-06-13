import { faNoteSticky, faStar as regularFaStar, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faArrowDown, faArrowUp, faStar as solidFaStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import { localDateFormat } from "../../../helpers/helpers";
import { formatAddress } from "../../../models/IAddress.model";
import IOrder from "../../../models/IOrder.model";
import CartPreview from "../../Cart/CartPreview";

export default function UserOrderList() {
    const [ orders, setOrders ] = useState<IOrder[]>([]);

    function loadOrders() {
        api("get", "/api/order", "user")
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not get your orders!");
            }

            return res.data;
        })
        .then(orders => {
            setOrders(orders);
        })
        .catch(e => {
            // ...
        });
    }

    function cancelOrder(orderId: number) {
        api("put", "/api/order/" + orderId + "/status", "user", {
            status: "canceled"
        })
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not cancel your order!");
            }
        })
        .then(() => {
            loadOrders();
        })
        .catch(e => {
            // ...
        });
    }

    useEffect(() => {
        loadOrders();
    }, [ ]);

    interface IOrderRateFormProperties {
        orderId: number;
    }

    function OrderRateForm(props: IOrderRateFormProperties) {
        const [ value, setValue ] = useState<number>(3);
        const [ note, setNote ]   = useState<string>("");

        function doRateOrder() {
            api("post", "/api/order/" + props.orderId + "/rate", "user", { value, note })
            .then(res => {
                if (res.status !== "ok") {
                    throw new Error("Could not rate your order!");
                }
            })
            .then(() => {
                loadOrders();
            })
            .catch(e => {
                // ...
            });
        }

        return (
            <div className="row">
                <div className="col col-12 mb-2">
                    <div style={{ color: value < 3 ? "red": (value > 4 ? "green" : "orange"), zoom: 2, }}>
                        <FontAwesomeIcon icon={ value >= 1 ? solidFaStar : regularFaStar } onClick={ () => setValue(1) } />
                        <FontAwesomeIcon icon={ value >= 2 ? solidFaStar : regularFaStar } onClick={ () => setValue(2) } />
                        <FontAwesomeIcon icon={ value >= 3 ? solidFaStar : regularFaStar } onClick={ () => setValue(3) } />
                        <FontAwesomeIcon icon={ value >= 4 ? solidFaStar : regularFaStar } onClick={ () => setValue(4) } />
                        <FontAwesomeIcon icon={ value >= 5 ? solidFaStar : regularFaStar } onClick={ () => setValue(5) } />
                    </div>
                </div>

                <div className="col col-12 mb-2">
                    <div className="form-group">
                        <div className="input-group">
                            <textarea className="form-control" rows={ 4 } maxLength={ 500 } value={ note }
                                onChange={ e => setNote(e.target.value ) }
                                placeholder="Enter your rating note here..."
                                />
                        </div>
                    </div>
                </div>

                <div className="col col-12 mb-2">
                    <div className="form-group">
                        <div className="input-group">
                            <button className="btn btn-primary" onClick={ () => doRateOrder() }>
                                <FontAwesomeIcon icon={ faNoteSticky } /> Rate order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    interface ISingleOrderRowProperties {
        order: IOrder;
    }

    function SingleOrderRow(props: ISingleOrderRowProperties) {
        const [ showingCart, setShowingCart ] = useState<boolean>(false);

        return (
            <>
                <tr key={ "order-" + props.order.orderId + '-data' }>
                    <td>{ props.order.orderId }</td>
                    <td>{ localDateFormat(props.order.createdAt) }</td>
                    <td>{ localDateFormat(props.order.deliverAt) }</td>
                    <td>{ props.order.status }</td>
                    <td>{ formatAddress(props.order.address) }</td>
                    <td>
                        { !showingCart && <button className="btn btn-primary btn-sm" onClick={ () => setShowingCart(true) }>
                            <FontAwesomeIcon icon={ faArrowDown } />
                        </button> }

                        { showingCart && <button className="btn btn-primary btn-sm" onClick={ () => setShowingCart(false) }>
                            <FontAwesomeIcon icon={ faArrowUp } />
                        </button> }

                        &nbsp;

                        { props.order.status === "pending" && <button className="btn btn-sm btn-danger"
                            onClick={ () => cancelOrder(props.order.orderId) }>
                            <FontAwesomeIcon icon={ faTrashCan } />
                        </button> }
                    </td>
                </tr>

                {
                    showingCart &&
                    <tr key={ "order-" + props.order.orderId + '-cart' }>
                        <td></td>
                        <td colSpan={5}>
                            <CartPreview cart={ props.order.cart } />
                        </td>
                    </tr>
                }

                { (props.order.status === "sent" && !props.order.markValue) && <tr key={ "order-" + props.order.orderId + '-rate' }>
                    <td colSpan={5}></td>
                    <td>
                        <OrderRateForm orderId={ props.order.orderId } />
                    </td>
                </tr> }
            </>
        );
    }

    return (
        <table className="table table-sm table-borderd">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Created at</th>
                    <th>Deliver at</th>
                    <th>Status</th>
                    <th>Address</th>
                    <th>Options</th>
                </tr>
            </thead>
            <tbody>
                { orders.length === 0 && <tr>
                    <td colSpan={ 6 }>You haven't made any orders yet!</td>
                </tr> }

                { orders.map(order => <SingleOrderRow key={ "order-" + order.orderId } order={ order } />) }
            </tbody>
        </table>
    );
}
