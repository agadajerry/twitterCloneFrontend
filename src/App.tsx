import React from 'react';
import { BrowserRouter, Routes,Route} from "react-router-dom"
import './App.css';
import Home from './pages/home/Home';
import Login from './pages/authentication/Login/Login';
import Signup from './pages/authentication/Signup/Signup';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/'  element={ <Home/> }/>
      <Route path='/login'  element={ <Login />} />
      <Route path='/signup'  element={ <Signup />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
