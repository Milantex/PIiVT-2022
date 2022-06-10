import { faNoteSticky, faTrashCan } from "@fortawesome/free-regular-svg-icons";
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
                <div className="col col-12 col-md-3">
                    <div className="form-group">
                        <div className="input-group">
                            <input className="form-control" type="number" min={1} max={5} step={1} value={ value } onChange={ e => setValue(+(e.target.value)) } />
                        </div>
                    </div>
                </div>
                
                <div className="col col-12 col-md-7">
                    <div className="form-group">
                        <div className="input-group">
                            <textarea className="form-control" rows={ 4 } maxLength={ 500 } value={ note } onChange={ e => setNote(e.target.value ) } />
                        </div>
                    </div>
                </div>
                
                <div className="col col-12 col-md-2">
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

                { orders.map(order => (
                    <>
                        <tr key={ "order-" + order.orderId + '-data' }>
                            <td>{ order.orderId }</td>
                            <td>{ localDateFormat(order.createdAt) }</td>
                            <td>{ localDateFormat(order.deliverAt) }</td>
                            <td>{ order.status }</td>
                            <td>{ formatAddress(order.address) }</td>
                            <td>
                                { order.status === "pending" && <button className="btn btn-sm btn-danger"
                                    onClick={ () => cancelOrder(order.orderId) }>
                                    <FontAwesomeIcon icon={ faTrashCan } />
                                </button> }
                            </td>
                        </tr>
                        <tr key={ "order-" + order.orderId + '-cart' }>
                            <td></td>
                            <td colSpan={5}>
                                <CartPreview cart={ order.cart } />
                            </td>
                        </tr>
                        { (order.status === "sent" && !order.markValue) && <tr key={ "order-" + order.orderId + '-rate' }>
                            <td></td>
                            <td colSpan={5}>
                                <OrderRateForm orderId={ order.orderId } />
                            </td>
                        </tr> }
                    </>
                )) }
            </tbody>
        </table>
    );
}
