import './App.css';
import Header from "./component/layout/Header/Header.js"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import WebFont from "webfontloader";
import React from 'react';
import Footer from './component/layout/Footer/Footer';
import Home from "./component/Home/Home.js"
import ProductDetails from "./component/Product/ProductDetails.js"
import LoginSignUp from './component/User/LoginSignUp';



function App() {
  React.useEffect(()=>{
    WebFont.load({
      google: {
        families: ["Roboto","Droid Sans","Chilanka"]
      }
    })

  },[])

  return (
    <Router>
      <Header/>
      <Routes>
      <Route exact path='/' Component={Home} />
      
      <Route exact path='/product/:id' Component={ProductDetails} />
      <Route exact path='/login' Component={LoginSignUp} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
