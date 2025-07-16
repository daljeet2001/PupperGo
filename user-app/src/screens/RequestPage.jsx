import Appbar from '../components/Appbar'
import Footer from '../components/Footer'
import { useState,useEffect } from 'react'
import { useUser } from '@clerk/clerk-react';
import {useNavigate} from 'react-router-dom';
import RequestForm from '../components/RequestForm'
import { useLocation, useParams } from "react-router-dom";




const RequestPage = () => {
   const [showNotifications, setShowNotifications] = useState(false);
   const [notifications, setNotifications] = useState([]);
   const { id } = useParams();
   const location = useLocation();
   const walkerName = location.state?.walkerName;

   useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);
  

  return (
    <div>
    <Appbar showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            notifications={notifications} /> 

    <RequestForm walkerName={walkerName}/>
    <Footer/>
    </div>
  )
}

export default RequestPage