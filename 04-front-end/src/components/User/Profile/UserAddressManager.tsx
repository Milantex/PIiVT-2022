import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import IUser from "../../../models/IUser.model";
import UserAddressAdder from "./UserAddressAdder";
import UserAddressChanger from "./UserAddressChanger";
import { motion } from "framer-motion";

interface IUserAddressManagerProperties {
    user: IUser;
    onAddressChange: (user: IUser) => void;
}

export default function UserAddressManager(props: IUserAddressManagerProperties) {
    const [ newAddressFormShowing, setNewAddressFormShowing ] = useState<boolean>(false);

    return (
        <motion.div className="card"
            initial={{
                position: "relative",
                top: 20,
                scale: 0.75,
                opacity: 0,
            }}
            animate={{
                top: 0,
                scale: 1,
                opacity: 1,
            }}
            transition={{
                delay: 0.125,
            }}>
            <div className="card-body">
                <div className="card-title mb-4">
                    <h2 className="h6">
                        { !newAddressFormShowing && <button className="btn btn-sm btn-primary" style={ { float: "right" } }
                            onClick={ () => setNewAddressFormShowing(true) }>
                            <FontAwesomeIcon icon={ faPlusSquare } /> Add new address
                        </button> }
                        My addresses
                    </h2>
                </div>

                <div className="card-text">
                    {
                        newAddressFormShowing
                        ? <UserAddressAdder onClose={ () => setNewAddressFormShowing(false) } onAddressChange={ user => {
                            props.onAddressChange(user);
                            setNewAddressFormShowing(false);
                        } } />
                        : <>
                            { (!props.user.addresses || props.user.addresses.length === 0) && <p>You have no addresses in your profile. Please add a new address.</p> }
                            { props.user.addresses.map(address => <UserAddressChanger key={ "address-" + address.addressId } address={ address } onAddressChange={ user => props.onAddressChange(user) } /> ) }
                          </>
                    }
                </div>
            </div>
        </motion.div>
    );
}
