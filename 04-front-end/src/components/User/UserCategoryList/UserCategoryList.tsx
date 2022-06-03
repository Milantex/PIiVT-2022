import { useEffect, useState } from "react";
import ICategory from "../../../models/ICategory.model";
import { Link } from 'react-router-dom';

export default function UserCategoryList() {
    const [ categories, setCategories ] = useState<ICategory[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    useEffect(() => {
        fetch("http://localhost:10000/api/category")
        .then(res => res.json())
        .then(data => {
            setCategories(data);
        })
        .catch(error => {
            setErrorMessage(error?.message ?? 'Unknown error while loading categories...');
        });
    }, [ ]);

    return (
        <div>
            { errorMessage && <p>Error: { errorMessage }</p> }
            { !errorMessage &&
                <ul>
                    { categories.map(category =>
                        <li key={ "category-" + category.categoryId }>
                            <Link to={ "/category/" + category.categoryId }>{ category.name }</Link>
                        </li>
                    ) }
                </ul>
            }
        </div>
    );
}
