import Appbar from '../components/Appbar'
import Footer from '../components/Footer'
import { useState } from 'react'
import { useUser } from '@clerk/clerk-react';
import {useNavigate} from 'react-router-dom';
import GetStarted from '../components/GetStarted'
import Testimonials from '../components/Testimonials'
import CallToAction from '../components/CallToAction'
import HowItWorksTimeline from '../components/HowItWorksTimeline'




const LandingPage = () => {
   const [showNotifications, setShowNotifications] = useState(false);
   const [notifications, setNotifications] = useState([]);
   const navigate = useNavigate();
   const { user, isSignedIn, isLoaded } = useUser();
   if(isSignedIn) { navigate('/home')
   }
  return (
    <div>
    <Appbar showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            notifications={notifications} /> 
    <div className="">
      <GetStarted/>   
    </div>    
  
   
  
    <Testimonials/> 
    <CallToAction/>
    <HowItWorksTimeline/>
    <Footer/>
    </div>
  )
}

export default LandingPage
