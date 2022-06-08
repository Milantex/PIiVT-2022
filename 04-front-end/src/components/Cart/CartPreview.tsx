import ICart from "../../models/ICart.model";

export interface ICartPreviewProperties {
    cart: ICart;
}

export default function CartPreview(props: ICartPreviewProperties) {
    return (
        <div className="row">
            <div className="col col-12">
                <div className="card">
                    <div className="card-body">
                        <div className="card-text">
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Unit size</th>
                                        <th>Price per unit</th>
                                        <th>Quantity</th>
                                        <th>Total price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { props.cart.content.map((item, index) => (
                                        <tr key={ "cart-item-" + item.item.categoryId + "-" + item.item.itemId }>
                                            <td style={{ textAlign: "right" }}>{ index + 1 }.</td>
                                            <td>{ item.item.name }</td>
                                            <td>{ item.item.category?.name }</td>
                                            <td>{ item.size.size.name }</td>
                                            <td style={{ textAlign: "right" }}>{ (+item.size.price).toFixed(2) + " RSD" }</td>
                                            <td style={{ textAlign: "right" }}>{ "x " + (+item.quantity).toFixed(0) }</td>
                                            <td style={{ textAlign: "right" }}>{ (+item.size.price * +item.quantity).toFixed(2) + " RSD" }</td>
                                        </tr>
                                    )) }
                                </tbody>
                                <tfoot>
                                    <th colSpan={6}></th>
                                    <th style={{ textAlign: "right" }}>
                                        { props.cart.content.map( item => +item.size.price * +item.quantity ).reduce((sum, item) => sum + item, 0).toFixed(2) + " RSD" }
                                    </th>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
