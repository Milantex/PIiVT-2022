import React from 'react';
import './Application.sass';
import { Container } from 'react-bootstrap';
import UserLoginPage from '../User/UserLoginPage/UserLoginPage';
import ContactPage from '../Pages/ContactPage/ContactPage';
import { Routes, Route } from 'react-router-dom';
import Menu from '../Menu/Menu';
import UserCategoryList from '../User/UserCategoryList/UserCategoryList';
import UserCategoryPage from '../User/UserCategoryPage/UserCategoryPage';
import AdminDashboard from '../Administrator/Dashboard/AdminDashboard';
import AdminCategoryList from '../Administrator/Dashboard/AdminCategoryList';
import AdminCategoryIngredientsList from '../Administrator/Dashboard/AdminCategoryIngredientsList';
import AdminSizeList from '../Administrator/Dashboard/AdminSizeList';
import AdminAdministratorList from '../Administrator/Dashboard/AdminAdministratorList';
import AdminAdministratorAdd from '../Administrator/Dashboard/AdminAdministratorAdd';
import AdminUserList from '../Administrator/Dashboard/AdminUserList';
import AdminOrderList from '../Administrator/Dashboard/AdminOrderList';
import AdminItemAdd from '../Administrator/Dashboard/AdminItemAdd';
import AdminItemList from '../Administrator/Dashboard/AdminItemList';
import AdminItemEdit from '../Administrator/Dashboard/AdminItemEdit';
import { Provider } from 'react-redux';
import AuthStore from '../../stores/AuthStore';
import AdministratorLoginPage from '../Administrator/AdministratorLoginPage/AdministratorLoginPage';
import UserRegisterPage from '../User/UserRegisterPage/UserRegisterPage';
import UserCart from '../User/Cart/UserCart';
import UserOrderList from '../User/Order/UserOrderList';

function Application() {
  return (
    <Provider store={ AuthStore }>
      <Container className="mt-4">
        <Menu />

        <Routes>
          <Route path="/" element={ <div></div> } />
          <Route path='/contact' element={ <ContactPage /> } />
          <Route path='/cart' element={ <UserCart /> } />
          <Route path='/orders' element={ <UserOrderList /> } />
          <Route path='/auth/user/login' element={ <UserLoginPage /> } />
          <Route path='/auth/user/register' element={ <UserRegisterPage /> } />
          <Route path='/auth/administrator/login' element={ <AdministratorLoginPage /> } />
          <Route path="/categories" element={ <UserCategoryList /> } />
          <Route path="/category/:id" element={ <UserCategoryPage /> } />

          <Route path="/admin/dashboard" element={ <AdminDashboard /> } />
          <Route path="/admin/dashboard/category/list" element={ <AdminCategoryList /> } />
          <Route path="/admin/dashboard/category/:cid/ingredients" element={ <AdminCategoryIngredientsList /> } />
          <Route path="/admin/dashboard/category/:cid/items/list" element={ <AdminItemList /> } />
          <Route path="/admin/dashboard/category/:cid/items/add" element={ <AdminItemAdd /> } />
          <Route path="/admin/dashboard/category/:cid/items/edit/:iid" element={ <AdminItemEdit /> } />

          <Route path="/admin/dashboard/size/list" element={ <AdminSizeList /> } />

          <Route path="/admin/dashboard/administrator/list" element={ <AdminAdministratorList /> } />
          <Route path="/admin/dashboard/administrator/add" element={ <AdminAdministratorAdd /> } />

          <Route path="/admin/dashboard/user/list" element={ <AdminUserList /> } />

          <Route path="/admin/dashboard/order/list/new" element={ <AdminOrderList filter='new' /> } />
          <Route path="/admin/dashboard/order/list/archive" element={ <AdminOrderList filter='archived' /> } />
        </Routes>
      </Container>
    </Provider>
  );
}

export default Application;
