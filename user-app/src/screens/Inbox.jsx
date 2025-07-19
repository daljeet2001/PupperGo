import Appbar from '../components/Appbar'
import Footer from '../components/Footer'
import LiveMapPopup from '../components/LiveMapPopup'
import { useState,useEffect,useContext } from 'react'
import { useUser } from '@clerk/clerk-react';
import {useNavigate} from 'react-router-dom';
import { useLocation, useParams } from "react-router-dom";
import InboxComponent from '../components/InboxComponent'
import axios from 'axios';
import { SocketContext } from '../context/SocketContext';





const Inbox = () => {
   const navigate = useNavigate();
   const [showNotifications, setShowNotifications] = useState(false);
   const [notifications, setNotifications] = useState([]);
   const [Bookings, setBookings] = useState([]);
   const { user, isSignedIn, isLoaded } = useUser();
   const [live,setLive]=useState();
   const [startJourney,setStartJourney]=useState(false);
   const [dogwalkerLocation, setDogwalkerLocation] = useState(null);
   const [upcomingDogwalkerId, setUpcomingDogwalkerId] = useState(null);
   const { socket } = useContext(SocketContext);


   useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);



   useEffect(() => {
   if (!upcomingDogwalkerId) return;

   const fetchDogwalkerLocation = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/dogwalker/location/${upcomingDogwalkerId}`
      );
      setDogwalkerLocation(res.data.location); // Make sure location is { lat, lng }
    } catch (err) {
      console.error('Error fetching dogwalker location:', err);
    }
    };

  // Fetch immediately
  fetchDogwalkerLocation();

  // Set interval for polling every 5 seconds
  const interval = setInterval(fetchDogwalkerLocation, 5000);

  return () => clearInterval(interval); // Cleanup
}, [upcomingDogwalkerId]);

   useEffect(() => {
    if(!isLoaded) return; 
    const fetchUpcomingBookings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/dogwalker/upcoming-bookings-user`, { 
        params: { clerkId: user.id },
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching upcoming bookings:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/notifications`, {
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
        <div className=""><InboxComponent Bookings={Bookings} setUpcomingDogwalkerId={setUpcomingDogwalkerId}/></div>
        <div className="h-[700px] w-full md:max-w-sm">  
          
          <LiveMapPopup dogwalkerLocation={dogwalkerLocation}/> </div>
    </div>   
  
    <Footer/>
    </div>
  )
}

export default Inbox