import { faCheckSquare, faEdit, faSave, faSquare, faWindowClose } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { api } from "../../../api/api";
import IAddress, { formatAddress } from "../../../models/IAddress.model";
import IUser from "../../../models/IUser.model";
import { motion } from "framer-motion";

export interface IUserAddressChangerProperties {
    address: IAddress;
    onAddressChange: (user: IUser) => void;
}

export default function UserAddressChanger(props: IUserAddressChangerProperties) {
    const [ editing, setEditing ] = useState<boolean>(false);

    interface IUserAddressEditorProperties {
        address: IAddress,
        onAddressChange: (user: IUser) => void;
    }

    function UserAddressEditor(props: IUserAddressEditorProperties) {
        const [ streetAndNumber, setStreetAndNumber ] = useState<string>(props.address.streetAndNmber);
        const [ floor, setFloor ]                     = useState<string>(props.address.floor ? "" + props.address.floor : '');
        const [ apartement, setApartement ]           = useState<string>(props.address.apartment ? "" + props.address.apartment : '');
        const [ city, setCity ]                       = useState<string>(props.address.city);
        const [ phoneNumber, setPhoneNumber ]         = useState<string>(props.address.phoneNumber);
        const [ isActive, setIsActive ]               = useState<boolean>(props.address.isActive);
        const [ error, setError ]                     = useState<string>('');

        function resetAndClose() {
            setStreetAndNumber(props.address.streetAndNmber);
            setFloor(props.address.floor ? "" + props.address.floor : '');
            setApartement(props.address.apartment ? "" + props.address.apartment : '');
            setCity(props.address.city);
            setPhoneNumber(props.address.phoneNumber);
            setIsActive(props.address.isActive);
            
            setEditing(false);
        }

        function saveChanges() {
            const data = {
                streetAndNmber: streetAndNumber,
                floor: floor === '' ? undefined : +floor,
                apartment: apartement === '' ? undefined : +apartement,
                city: city,
                phoneNumber: phoneNumber,
                isActive: isActive
            };

            if (floor === '') {
                delete data['floor'];
            }

            if (apartement === '') {
                delete data['apartment'];
            }

            api("put", "/api/user/address/" + props.address.addressId, "user", data)
            .then(res => {
                if (res.status !== 'ok') {
                    throw new Error('Error chaging address. Reason: ' + JSON.stringify(res.data));
                }

                return res.data;
            })
            .then(address => {
                props.onAddressChange(address.user);
                setEditing(false);
            })
            .catch(error => {
                setError(error?.message);
                setTimeout(() => setError(''), 5000);
            })
        }

        return (
            <motion.div className="row"
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
                <div className="col col-10">
                    <div className="row mb-3">
                        <div className="col col-12 col-lg-6 form-group">
                            <label>Street and number</label>
                            <div className="input-group">
                                <input className="form-control" value={ streetAndNumber } onChange={ e => setStreetAndNumber(e.target.value) } />
                            </div>
                        </div>

                        <div className="col col-12 col-lg-3 form-group">
                            <label>Floor</label>
                            <div className="input-group">
                                <input className="form-control" value={ floor } onChange={ e => setFloor(e.target.value) } />
                            </div>
                        </div>

                        <div className="col col-12 col-lg-3 form-group">
                            <label>Appartement</label>
                            <div className="input-group">
                                <input className="form-control" value={ apartement } onChange={ e => setApartement(e.target.value) } />
                            </div>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col col-12 col-lg-3 form-group">
                            <label>City</label>
                            <div className="input-group">
                                <input className="form-control" value={ city } onChange={ e => setCity(e.target.value) } />
                            </div>
                        </div>

                        <div className="col col-12 col-lg-4 form-group">
                            <label>Phone number</label>
                            <div className="input-group">
                                <input className="form-control" value={ phoneNumber } onChange={ e => setPhoneNumber(e.target.value) } />
                            </div>
                        </div>

                        <div className="col col-12 col-lg-2 form-group">
                            <label>Status</label>
                            <div className="input-group d-block">
                                <div onClick={ () => setIsActive(!isActive) }>
                                    <FontAwesomeIcon icon={ isActive ? faCheckSquare : faSquare } /> {isActive ? "Active" : "Inactive" }
                                </div>
                            </div>
                        </div>

                        <div className="col col-12 col-lg-3 form-group">
                            <div className="row mt-4">
                                <div className="col col-6">
                                    <button className="btn btn-sm btn-primary w-100" onClick={ () => saveChanges() }>
                                        <FontAwesomeIcon icon={ faSave } /> Save
                                    </button>
                                </div>

                                <div className="col col-6">
                                    <button className="btn btn-sm btn-secondary w-100" onClick={ () => resetAndClose() }>
                                        <FontAwesomeIcon icon={ faWindowClose } /> Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    { error && <p className="alert alert-danger">{ error }</p> }
                </div>
            </motion.div>
        );
    }

    return (
        <>
            { editing && <UserAddressEditor address={ props.address } onAddressChange={ props.onAddressChange } /> }

            { !editing && <div className="row mb-1">
                <div className="col col-10">
                    { formatAddress(props.address) }
                </div>
                <div className="col col-1">
                    <FontAwesomeIcon icon={ props.address.isActive ? faCheckSquare : faSquare } /> { props.address.isActive ? "Active" : "Inactive" }
                </div>
                <div className="col col-1">
                    <button className="btn btn-sm btn-primary" onClick={ () => setEditing(true) }>
                        <FontAwesomeIcon icon={ faEdit } /> Edit
                    </button>
                </div>
            </div> }
        </>
    );
}
