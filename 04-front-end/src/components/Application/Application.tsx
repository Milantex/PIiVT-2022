import React from 'react';
import './Application.sass';
import { Container } from 'react-bootstrap';
import UserLoginPage from '../User/UserLoginPage/UserLoginPage';
import ContactPage from '../Pages/ContactPage/ContactPage';
import { Routes, Route } from 'react-router-dom';
import Menu from '../Menu/Menu';
import UserCategoryList from '../User/UserCategoryList/UserCategoryList';
import UserCategoryPage from '../User/UserCategoryPage/UserCategoryPage';

function Application() {
  return (
    <Container className="mt-4">
      <Menu />

      <Routes>
        <Route path="/" element={ <div></div> } />
        <Route path='/contact' element={ <ContactPage /> } />
        <Route path='/auth/user/login' element={ <UserLoginPage /> } />
        <Route path="/categories" element={ <UserCategoryList /> } />
        <Route path="/category/:id" element={ <UserCategoryPage /> } />

      </Routes>
    </Container>
  );
}

export default Application;
