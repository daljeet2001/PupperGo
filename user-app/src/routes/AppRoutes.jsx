import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserHome from '../screens/UserHome'
import LandingPage from '../screens/LandingPage'






const AppRoutes = () => {
  return (
    <>
    
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<UserHome />} />
      </Routes>
    </>
  );
}

export default AppRoutes;