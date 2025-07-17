import Appbar from '../components/Appbar'
import Footer from '../components/Footer'
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

  // Poll every 5 seconds
  const interval = setInterval(() => {
    fetchUpcomingBookings();
    fetchNotifications();
  }, 5000);

  // Cleanup on unmount
  return () => clearInterval(interval);
}, [user, isLoaded]);
  

  return (
    <div>
    <Appbar showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            notifications={notifications} /> 
       
        <InboxComponent Bookings={Bookings}/>
  
    <Footer/>
    </div>
  )
}

export default Inbox