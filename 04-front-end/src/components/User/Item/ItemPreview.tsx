import IItem from "../../../models/IItem.model";

export interface IItemPreviewProperties {
    item: IItem;
}

export default function ItemPreview(props: IItemPreviewProperties) {
    console.log(props.item);

    return (
        <div>
            <h2>{ props.item.name }</h2>
            <p>{ props.item.description }</p>
            <p>Ingredients:</p>
            <ul>
                { props.item.ingredients.map(ingredient => <span className="d-inline-block px-2" key={ "ingredient-" + props.item.itemId + "-" + ingredient.ingredientId }>{ ingredient.name }</span>) }
            </ul>
            <p>Order in size:</p>
            <ul>
                { props.item.sizes.map( size =>
                    <button key={ "size-" + props.item.itemId + "-" + size.size.sizeId } className="btn btn-sm btn-secondary mx-2"
                            title={ "Energy: " + size.kcal + " kcal" }>
                        { size.size.name }: { Number(size.price).toFixed(2) + " RSD" }
                    </button>
                ) }
            </ul>
        </div>
    );
}
