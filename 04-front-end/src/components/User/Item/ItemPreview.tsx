import IItem from "../../../models/IItem.model";
import * as path from "path-browserify";
import './ItemPreview.sass';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import ISize from "../../../models/ISize.model";
import { useState } from "react";
import { api } from "../../../api/api";
import { Config } from "../../../config";
import AppStore from "../../../stores/AppStore";
import { motion } from "framer-motion";

export interface IItemPreviewProperties {
    item: IItem;
}

export default function ItemPreview(props: IItemPreviewProperties) {
    function getItemPhotoUrl() {
        if (props.item.photos.length === 0) {
            return "PLACEHOLDER";
        }

        const fullFilePath = props.item.photos[0].filePath;

        const directory = path.dirname(fullFilePath);
        const filename  = path.basename(fullFilePath);
        const prefix    = 'small-';

        return Config.API_PATH + "/assets/" + directory + '/' + prefix + filename;
    }

    interface ISizeCartAdderProperties {
        itemId: number;
        size: ISize;
    };

    function SizeCartAdder(props: ISizeCartAdderProperties) {
        const [ quantity, setQuantity ] = useState<number>(1);
        const [ error, setError ] = useState<string>("");
        const [ message, setMessage ] = useState<string>("");

        function addToCart() {
            api("post", "/api/cart", "user", {
                itemId: props.itemId,
                sizeId: props.size.size.sizeId,
                quantity,
            })
            .then(res => {
                if (res.status !== "ok") {
                    throw new Error("Could not add this item!");
                }

                return res.data;
            })
            .then(cart => {
                setMessage("Added to cart!");

                AppStore.dispatch( { type: "cart.update", value: cart } );

                setTimeout(() => {
                    setMessage("");
                }, 5000);
            })
            .catch(e => {
                setError(e?.message);

                setTimeout(() => {
                    setError("");
                }, 5000);
            });
        }

        return (
            <motion.div className="form-group"
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
                <div className="input-group input-group-sm">
                    <span className="input-group-text w-50" title={ "Energy: " + props.size.kcal + " kcal" }>
                        { props.size.size.name } ({ Number(props.size.price).toFixed(2) + " RSD" })
                    </span>
                    <input className="form-control form-control-sm" type="number"
                        min={ 1 } step={ 1 } value={ quantity }
                        onChange={ e => setQuantity(+e.target.value) } />
                    <button className="btn btn-sm btn-primary input-group-btn"
                        onClick={ () => addToCart() }>
                        <FontAwesomeIcon icon={ faPlusSquare } /> <span className="d-none d-lg-inline-block">Add</span>
                    </button>
                </div>
                { error   && <p className="alert alert-danger mt-3">{ error }</p> }
                { message && <p className="alert alert-success mt-3">{ message }</p> }
            </motion.div>
        );
    }

    return (
        <div className="col col-12 col-md-6 col-lg-4 item">
            <div className="card">
                <img className="card-img-top item-image"
                    src={ getItemPhotoUrl() }
                    alt={ props.item.name }
                    onError={ e => (e.target as HTMLImageElement).src = Config.API_PATH + '/assets/placeholder.png' } />
                <div className="card-body">
                    <div className="card-title">
                        <h3 className="h6">{ props.item.name }</h3>
                    </div>
                    <div className="card-text">
                        <p className="item-description">{ props.item.description }</p>
                        <p>
                            { props.item.ingredients.map(ingredient => <span className="ingredient" key={ "ingredient-" + props.item.itemId + "-" + ingredient.ingredientId }>{ ingredient.name }</span>) }
                        </p>
                        <div className="d-grid gap-3">
                            { props.item.sizes.map( size =>
                                <SizeCartAdder key={ "size-" + props.item.itemId + "-" + size.size.sizeId }
                                    size={ size } itemId={ props.item.itemId } />
                            ) }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
