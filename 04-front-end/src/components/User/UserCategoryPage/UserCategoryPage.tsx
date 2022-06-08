import { useEffect, useState } from "react";
import ICategory from "../../../models/ICategory.model";
import IItem from "../../../models/IItem.model";
import ItemPreview from "../Item/ItemPreview";
import { useParams } from "react-router-dom";
import { api } from "../../../api/api";

export interface IUserCategoryPageUrlParams extends Record<string, string | undefined> {
    id: string
}

export default function UserCategoryPage() {
    const [ category, setCategory ]         = useState<ICategory|null>(null);
    const [ items, setItems ]               = useState<IItem[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ loading, setLoading ]           = useState<boolean>(false);

    const params = useParams<IUserCategoryPageUrlParams>();

    useEffect(() => {
        setLoading(true);

        api("get", "/api/category/" + params.id, "user")
        .then(res => {
            if (res.status === 'error') {
                throw new Error('Could not get catgory data!');
            }

            setCategory(res.data);
        })
        .then(() => {
            return api("get", "/api/category/" + params.id + "/item", "user")
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
    }, [ params.id ]);

    return (
        <div>
            { loading && <p>Loading...</p> }
            { errorMessage && <p>Error: { errorMessage }</p> }

            { category && (
                <div>
                    <h1>{ category?.name }</h1>

                    { items && (
                        <div>
                            { items.map(item => <ItemPreview key={ "item-" + item.itemId } item={ item } /> ) }
                        </div>
                    ) }
                </div>
            ) }
        </div>
    );
}
