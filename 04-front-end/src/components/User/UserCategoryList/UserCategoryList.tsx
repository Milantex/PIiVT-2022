import { useEffect, useState } from "react";
import ICategory from "../../../models/ICategory.model";
import { Link } from 'react-router-dom';
import { api } from "../../../api/api";
import UserCategoryPage from "../UserCategoryPage/UserCategoryPage";

export default function UserCategoryList() {
    const [ categories, setCategories ] = useState<ICategory[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    useEffect(() => {
        api("get", "/api/category", "user")
        .then(apiResponse => {
            if (apiResponse.status === 'ok') {
                return setCategories(apiResponse.data);
            }

            throw new Error('Unknown error while loading categories...');
        })
        .catch(error => {
            setErrorMessage(error?.message ?? 'Unknown error while loading categories...');
        });
    }, [ ]);

    return (
        <div>
            { errorMessage && <p>Error: { errorMessage }</p> }
            { !errorMessage && categories.map(
                category =>
                <UserCategoryPage key={ "category-" + category.categoryId } categoryId={ category.categoryId } /> )
            }
        </div>
    );
}
