import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPaw, faStar, faBell } from '@fortawesome/free-solid-svg-icons';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../context/SocketContext';
import { Link } from 'react-router-dom';
import Appbar from '../components/AppBar';
import Footer from '../components/Footer';
import {ProfileCard} from '../components/ProfileCard';
import UpcomingWalks from '../components/UpcomingWalks'
import RouteToUser from '../components/RouteToUser';
import AvailabilityCalendar from '../components/AvailabilityCalendar'
import InviteAFriend from '../components/InviteAFriend'
import EarnMoreCard from '../components/EarnMoreCard'
import NewMessageCard from '../components/NewMessageCard'
import WalletCard from '../components/WalletCard'



const DogwalkerHome = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const { socket } = useContext(SocketContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]); 
  const [buttonClicked, setButtonClicked] = useState(false);
  const { user, isSignedIn, isLoaded } = useUser();
  const [userRoute, setUserRoute] = useState(false);
  const [clientId, setClientId] = React.useState(null);
  const [userLocation, setUserLocation] = useState(null);
  // console.log('User:', user);
  const navigate=useNavigate()

useEffect(() => {
    const checkProfileComplete = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/dogwalker/profile/${user.id}`);
        const walker = res.data;
        console.log('inside useeffecr of checkprofile complete?',walker)
        

        if (!walker.hourlyRate || !walker.description) {
          navigate("/edit");
        }
      } catch (err) {
        console.error("Error fetching walker data", err);
     
      }
    };

    checkProfileComplete();
  }, [user,isLoaded]); 

useEffect(() => {
    if(!isLoaded) return; 
  const fetchUpcomingBookings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/dogwalker/upcoming-bookings`, { 
        params: { clerkId: user.id },
      });
      setUpcomingBookings(response.data);
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


  useEffect(() => {
    if (!isLoaded) return;
    socket.emit('join', {
      clerkId: user.id,
      userType: 'dogwalker',
    });

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          socket.emit('update-location-dogwalker', {
            clerkId: user.id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        });
      }
    };

    const locationInterval = setInterval(updateLocation, 10000);
    updateLocation();
    console.log('Socket connected for dogwalker:', user.id);

    return () => {
      clearInterval(locationInterval);
    };
  }, [user, isLoaded,isSignedIn, socket]);

  useEffect(() => {
  if (!user || !isLoaded) return;

  const syncDogwalker = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/dogwalker/sync`, {
        clerkId: user.id,
        username: user.username || user.firstName,
        email: user.emailAddresses[0].emailAddress,
        profileImage: user.imageUrl,
      });
      console.log("Dogwalker synced with backend:", res.data);
    } catch (error) {
      console.error("Error syncing dogwalker:", error.response?.data || error.message);
    }
  };

  syncDogwalker();
}, [user, isLoaded]);

  const toggleDateSelection = (date) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };
  const handleDeleteNotification = (index) => {
    setNotifications((prevNotifications) => {
      const newNotifications = [...prevNotifications];
      newNotifications.splice(index, 1);
      return newNotifications;
    });
  }

  const confirmAvailability = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/dogwalker/availability`,
        {
          dates: selectedDates,
          clerkId: user.id,
        },
      );
      console.log('Availability confirmed:', response.data);
    } catch (error) {
      console.error('Error confirming availability:', error);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/dogwalker/update-booking-status`,
        { bookingId, status, clerkId: user.id },
      );
      console.log('Booking status updated:', response.data);
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

const fetchClientLocation = async (id) => {
  try {
    const res = await axios.get(  `${import.meta.env.VITE_BASE_URL}/user/location/${id}`);
    return res.data.location; // { lat, lng }
  } catch (error) {
    console.error('Error fetching client location:', error.response?.data?.error || error.message);
  }
};

useEffect(() => {
  console.log('Fetching client location for ID:', clientId);
  const getLocation = async () => {
    const location = await fetchClientLocation(clientId); // assuming client = clientId
    if (location) {
      setUserLocation(location);
    }
  };

  getLocation();
}, [clientId, isLoaded, isSignedIn]);




  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Please sign in</div>;

 return (
  <div className="flex flex-col min-h-screen bg-gray-100">
    <Appbar
      showNotifications={showNotifications}
      setShowNotifications={setShowNotifications}
      notifications={notifications}
    />

    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        <ProfileCard user={user} />
        <NewMessageCard />
        <WalletCard />
      </div>

      {/* Right Column - spans 2 columns */}
      <div className="lg:col-span-2 space-y-6">
        <AvailabilityCalendar
          selectedDates={selectedDates}
          toggleDateSelection={toggleDateSelection}
          confirmAvailability={confirmAvailability}
          buttonClicked={buttonClicked}
          setButtonClicked={setButtonClicked}
        />
        <InviteAFriend />
        <EarnMoreCard />
      </div>
    </div>

    <div className="mt-4">
      <Footer />
    </div>
  </div>
);

};

export default DogwalkerHome;