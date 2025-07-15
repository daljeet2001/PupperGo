import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserHome from '../screens/UserHome'
import LandingPage from '../screens/LandingPage'
import Demo from '../screens/demo'







const AppRoutes = () => {
  return (
    <>
    
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<UserHome />} />
        <Route path="/demo" element={<Demo/>}/>
      </Routes>
    </>
  );
}

export default AppRoutes;