import { useEffect, useState } from "react";
import ICategory from "../../../models/ICategory.model";
import IItem from "../../../models/IItem.model";
import ItemPreview from "../Item/ItemPreview";
import { useParams } from "react-router-dom";
import { api } from "../../../api/api";

export interface IUserCategoryPageUrlParams extends Record<string, string | undefined> {
    id: string
}

export interface IUserCategoryProperties {
    categoryId?: number;
}

export default function UserCategoryPage(props: IUserCategoryProperties) {
    const [ category, setCategory ]         = useState<ICategory|null>(null);
    const [ items, setItems ]               = useState<IItem[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ loading, setLoading ]           = useState<boolean>(false);

    const params = useParams<IUserCategoryPageUrlParams>();

    const categoryId = props?.categoryId ?? params.id;

    useEffect(() => {
        setLoading(true);

        api("get", "/api/category/" + categoryId, "user")
        .then(res => {
            if (res.status === 'error') {
                throw new Error('Could not get catgory data!');
            }

            setCategory(res.data);
        })
        .then(() => {
            return api("get", "/api/category/" + categoryId + "/item", "user")
        })
        .then(res => {
            if (res.status === 'error') {
                throw new Error('Could not get catgory items!');
            }

            setItems(res.data);
        })
        .catch(error => {
            setErrorMessage(error?.message ?? 'Unknown error while loading this category!');
        })
        .finally(() => {
            setLoading(false);
        });
    }, [ categoryId ]);

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="card mb-4">
            <div className="card-body">
                <div className="card-title">{ loading ? <p>Loading...</p> : <h2 className="h4">{ category?.name }</h2> }</div>
                <div className="card-text">
                    { errorMessage && <p className="alert alert-danger">Error: { errorMessage }</p> }

                    <div className="row">
                        { items.map(item => <ItemPreview key={ "item-" + item.itemId } item={ item } /> ) }
                    </div>
                </div>
            </div>
        </div>
    );
}
