import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserHome from '../screens/UserHome'
import LandingPage from '../screens/LandingPage'
import RequestPage from '../screens/RequestPage'
import Inbox from '../screens/Inbox'

import Test from '../screens/test'






const AppRoutes = () => {
  return (
    <>
    
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<UserHome />} />
        <Route path="/request/:id" element={<RequestPage/>}/>
        <Route path="/inbox" element={<Inbox/>}/>
        <Route path="/test" element={<Test/>}/>
      </Routes>
    </>
  );
}

export default AppRoutes;