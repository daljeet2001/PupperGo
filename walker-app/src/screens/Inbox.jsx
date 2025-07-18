import Appbar from '../components/Appbar'
import Footer from '../components/Footer'
import RouteToUser from '../components/RouteToUser'
import { useState,useEffect } from 'react'
import { useUser } from '@clerk/clerk-react';
import {useNavigate} from 'react-router-dom';
import { useLocation, useParams } from "react-router-dom";
import InboxComponent from '../components/Inbox'
import axios from 'axios';





const Inbox = () => {
   const navigate = useNavigate();
   const [showNotifications, setShowNotifications] = useState(false);
   const [notifications, setNotifications] = useState([]);
   const [Bookings, setBookings] = useState([]);
   const { user, isSignedIn, isLoaded } = useUser();
   const [live,setLive]=useState();
   const [startJourney,setStartJourney]=useState(false);

   useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

   useEffect(() => {
    if(!isLoaded) return; 
  const fetchUpcomingBookings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/dogwalker/upcoming-bookings`, { 
        params: { clerkId: user.id },
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching upcoming bookings:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/dogwalker/notifications`, {
        params: { clerkId: user.id },
      });
      setNotifications(response.data);
      console.log('Notifications fetched:', response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Call once immediately
  fetchUpcomingBookings();
  fetchNotifications();

  // Poll every 3 seconds
  const interval = setInterval(() => {
    fetchUpcomingBookings();
    fetchNotifications();
  }, 3000);

  // Cleanup on unmount
  return () => clearInterval(interval);
}, [user, isLoaded]);
  

  return (
    <div>
    <Appbar showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            notifications={notifications} /> 

    <div className="flex flex-col md:flex-row justify-center">  
        <div className=""><InboxComponent Bookings={Bookings} setLive={setLive} setStartJourney={setStartJourney}/></div>
        <div className="h-[700px] w-full md:max-w-sm">  <RouteToUser userLocation={live} startJourney={startJourney} /> </div>
    </div>   
  
    <Footer/>
    </div>
  )
}

export default Inbox