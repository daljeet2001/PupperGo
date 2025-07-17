import Appbar from '../components/Appbar'
import Footer from '../components/Footer'
import { useState,useEffect } from 'react'
import { useUser } from '@clerk/clerk-react';
import {useNavigate} from 'react-router-dom';
import {EditProfileModal} from '../components/EditProfileModal'
import { useLocation, useParams } from "react-router-dom";




const Edit = () => {
   const navigate = useNavigate();
   const [showNotifications, setShowNotifications] = useState(false);
   const [notifications, setNotifications] = useState([]);
   const { id } = useParams();
   const location = useLocation();
   const { user, isSignedIn, isLoaded } = useUser();

   useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);
  

  return (
    <div>
    <Appbar showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            notifications={notifications} /> 

    <EditProfileModal user={user}/>
    <Footer/>
    </div>
  )
}

export default Edit