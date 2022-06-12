import { useState } from 'react';
import MenuAdministrator from './MenuAdministrator';
import MenuUser from './MenuUser';
import MenuVisitor from './MenuVisitor';
import AppStore from '../../stores/AppStore';

export default function Menu() {
    const [ role, setRole ] = useState<"visitor" | "user" | "administrator">(AppStore.getState().auth.role);

    AppStore.subscribe(() => {
        setRole(AppStore.getState().auth.role)
    });

    return (
        <>
            { role === "visitor" && <MenuVisitor /> }
            { role === "user" && <MenuUser /> }
            { role === "administrator" && <MenuAdministrator /> }
        </>
    );
}
