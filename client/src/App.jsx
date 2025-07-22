// import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Footer from './components/Footer';
import CreateAsset from './pages/CreateAsset';
import ScrollToTop from './components/ScrollToTop';
import Search from './pages/Search';
import Dashboard from './pages/Dashboard';
import AssetDetail from './pages/AssetDetail';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop/>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/sign-in" element={<SignIn/>}/>
        <Route path='/search' element={<Search />} />
        <Route path="/create-asset" element={<CreateAsset/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/asset/:id" element={<AssetDetail/>}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}


