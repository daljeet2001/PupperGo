import React from 'react'
import { Route, BrowserRouter, Routes } from 'react-router-dom'

import DogwalkerHome from '../screens/DogwalkerHome'
import LandingPage from '../screens/LandingPage'



const AppRoutes = () => {
    return (
            <Routes>
                           
                <Route path="/home" element={<DogwalkerHome />} />
                <Route path="/" element={<LandingPage />} />
                
          
            </Routes>
    )
}

export default AppRoutes