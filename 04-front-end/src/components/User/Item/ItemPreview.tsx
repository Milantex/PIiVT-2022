import IItem from "../../../models/IItem.model";
import * as path from "path-browserify";
import './ItemPreview.sass';

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

        return "http://localhost:10000/assets/" + directory + '/' + prefix + filename;
    }

    return (
        <div className="col col-12 col-md-6 col-lg-4">
            <div className="card">
                <img src={ getItemPhotoUrl() } className="card-img-top" alt={ props.item.name } />
                <div className="card-body">
                    <div className="card-title">
                        <h3 className="h6">{ props.item.name }</h3>
                    </div>
                    <div className="card-text">
                        <p>{ props.item.description }</p>
                        <p>
                            { props.item.ingredients.map(ingredient => <span className="ingredient" key={ "ingredient-" + props.item.itemId + "-" + ingredient.ingredientId }>{ ingredient.name }</span>) }
                        </p>
                        <div>
                            { props.item.sizes.map( size =>
                                <button key={ "size-" + props.item.itemId + "-" + size.size.sizeId } className="btn btn-sm btn-secondary mx-2"
                                        title={ "Energy: " + size.kcal + " kcal" }>
                                    { size.size.name }: { Number(size.price).toFixed(2) + " RSD" }
                                </button>
                            ) }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
