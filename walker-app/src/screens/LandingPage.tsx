import Appbar from '../components/Appbar'
import Footer from '../components/Footer'
import { useState } from 'react'
import { useUser } from '@clerk/clerk-react';
import {useNavigate} from 'react-router-dom';


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
    landingPage
    <Footer/>
    </div>
  )
}

export default LandingPage