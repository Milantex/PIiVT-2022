import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IUser from "../../../models/IUser.model";
import UserAddressChanger from "./UserAddressChanger";

interface IUserAddressManagerProperties {
    user: IUser;
    onAddressChange: (user: IUser) => void;
}

export default function UserAddressManager(props: IUserAddressManagerProperties) {
    return (
        <div className="card">
            <div className="card-body">
                <div className="card-title mb-4">
                    <h2 className="h6">
                        <button className="btn btn-sm btn-primary" style={ { float: "right" } }>
                            <FontAwesomeIcon icon={ faPlusSquare } /> Add new address
                        </button>
                        My addresses
                    </h2>
                </div>

                <div className="card-text">
                    { (!props.user.addresses || props.user.addresses.length === 0) && <p>You have no addresses in your profile. Please add a new address.</p> }
                    { props.user.addresses.map(address => <UserAddressChanger key={ "address-" + address.addressId } address={ address } onAddressChange={ user => props.onAddressChange(user) } /> ) }
                </div>
            </div>
        </div>
    );
}
