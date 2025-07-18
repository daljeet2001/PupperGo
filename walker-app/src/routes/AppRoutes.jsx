import React from 'react'
import { Route, BrowserRouter, Routes } from 'react-router-dom'

import DogwalkerHome from '../screens/DogwalkerHome'
import LandingPage from '../screens/LandingPage'
import Edit from '../screens/Edit'
import Inbox from '../screens/Inbox'




const AppRoutes = () => {
    return (
            <Routes>
                           
                <Route path="/home" element={<DogwalkerHome />} />
                <Route path="/" element={<LandingPage />} />
                <Route path="/edit" element={<Edit/>}/>
                <Route path="/inbox" element={<Inbox/>}/>
                
          
            </Routes>
    )
}

export default AppRoutes