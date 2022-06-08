import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import { localDateFormat } from "../../../helpers/helpers";
import { formatAddress } from "../../../models/IAddress.model";
import IOrder from "../../../models/IOrder.model";
import CartPreview from "../../Cart/CartPreview";
import './AdminOrderList.sass';

export interface IAdminOrderListProperties {
    filter: "new" | "archived";
}

export default function AdminOrderList(props: IAdminOrderListProperties) {
    const [ orders, setOrders ] = useState<IOrder[]>([]);

    const reloadOrders = () => {
        api("get", "/api/order", "administrator")
        .then(res => {
            if (res.status === "ok") {
                setOrders(res.data);
            }
        });
    };

    useEffect(reloadOrders, [ ]);

    const orderFilter = (order: IOrder): boolean => {
        if (props.filter === "new") {
            return order.status === "pending" || order.status === "accepted";
        }

        return !(order.status === "pending" || order.status === "accepted");
    }

    function AdminOrderListRow(props: { order: IOrder }) {
        const [ showCart, setShowCart ] = useState<boolean>(false);

        const markAs = (status: "accepted" | "rejected" | "sent") => {
            api("put", "/api/order/" + props.order.orderId + "/status", "administrator", { status })
            .then(res => {
                if (res.status === "ok") {
                    reloadOrders();
                }
            });
        }

        return (
            <>
                <tr>
                    <td>{ props.order.orderId }</td>
                    <td>{ localDateFormat(props.order.createdAt) }</td>
                    <td>{ localDateFormat(props.order.deliverAt) }</td>
                    <td style={ { textAlign: "center" } }>{ props.order.status }</td>
                    <td>
                        { props.order.address.user?.forename + " " + props.order.address.user?.surname }, { formatAddress(props.order.address) }
                    </td>
                    <td>
                        { !showCart && <button className="btn btn-primary btn-sm" onClick={ () => { setShowCart(true) } }>Show content</button> }
                        {  showCart && <button className="btn btn-primary btn-sm" onClick={ () => { setShowCart(false) } }>Hide content</button> }

                        &nbsp;&nbsp;

                        { props.order.status === "pending" && (
                            <>
                                <button className="btn btn-sm btn-primary" onClick={ () => markAs("accepted") }>Accept</button>
                                &nbsp;&nbsp;
                                <button className="btn btn-sm btn-danger" onClick={ () => markAs("rejected") }>Reject</button>
                            </>
                        ) }

                        { props.order.status === "accepted" && (
                            <>
                                <button className="btn btn-sm btn-success"  onClick={ () => markAs("sent") }>Mark as sent</button>
                            </>
                        ) }
                    </td>
                </tr>
                { showCart && (
                    <tr>
                        <td></td>
                        <td colSpan={4}>
                            <CartPreview cart={ props.order.cart } />
                        </td>
                        <td></td>
                    </tr>
                ) }
            </>
        );
    }

    return (
        <div>
            <h1 className="h4">Order list (showing { props.filter } orders)</h1>

            <table className="table table-sm table-hover">
                <thead className="order-table-heade">
                    <tr>
                        <th rowSpan={2} className="order-id-column-header">ID</th>
                        <th colSpan={2}>Dates</th>
                        <th rowSpan={2} className="order-status-column-header">Status</th>
                        <th rowSpan={2}>Client information</th>
                        <th rowSpan={2}>Options</th>
                    </tr>
                    <tr>
                        <th className="order-created-at-column-header">Created at</th>
                        <th className="order-deliver-at-column-header">Delivery time</th>
                    </tr>
                </thead>
                <tbody>
                    { orders.filter(order => orderFilter(order)).map(order => <AdminOrderListRow key={ "order-" + order.orderId } order={ order } />) } 
                </tbody>
            </table>
        </div>
    );
}
