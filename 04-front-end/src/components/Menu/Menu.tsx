import { useState } from 'react';
import AuthStore from '../../stores/AuthStore';
import MenuAdministrator from './MenuAdministrator';
import MenuUser from './MenuUser';
import MenuVisitor from './MenuVisitor';

export default function Menu() {
    const [ role, setRole ] = useState<"visitor" | "user" | "administrator">(AuthStore.getState().role);

    AuthStore.subscribe(() => {
        setRole(AuthStore.getState().role)
    });

    return (
        <>
            { role === "visitor" && <MenuVisitor /> }
            { role === "user" && <MenuUser /> }
            { role === "administrator" && <MenuAdministrator /> }
        </>
    );
}
