import React, { useState, useContext, useEffect } from 'react';
import LiveTracking from '../components/LiveTracking';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { SocketContext } from '../context/SocketContext';
import { Link } from 'react-router-dom';
import Appbar from '../components/Appbar';
import Footer from '../components/Footer';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import LiveMapPopup from '../components/LiveMapPopup';
import WalkerFilterForm from '../components/WalkerFilterForm'
import WalkerList from '../components/WalkerList'
import FinalForm from '../components/FinalForm'
import CallToAction from '../components/CallToAction'
import Loader from '../components/Loader'
import Card from '../components/Card'

const UserHome = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate,setEndDate] =useState(null);
  const [filters, setFilters] = useState({
    location: '',
    service: 'Dog walking',
    timeNeeded: '',
  });

  const { socket } = useContext(SocketContext);
  const [filterdogwalkers, setFilterDogWalkers] = useState([]);
  const [value, setValue] = useState([100, 1000]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [addresses, setAddresses] = useState({});
  const [requestingIds, setRequestingIds] = useState([]); 
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]); 
  const [upcomingDogwalkerId, setUpcomingDogwalkerId] = useState(null);
  const [dogwalkerLocation, setDogwalkerLocation] = useState(null);
  const navigate = useNavigate();
  const { user, isSignedIn, isLoaded } = useUser();
  // console.log('User:', user);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);
 
  useEffect(() => {
      const fetchAddresses = async () => {
        const newAddresses = {};
        for (let walker of filterdogwalkers) {
          const address = await getAddressFromCoordinates(walker.location.ltd, walker.location.lng);
          newAddresses[walker._id] = address;
        }
        setAddresses(newAddresses);
      };
      fetchAddresses();
    }, [filterdogwalkers]);


  useEffect(() => {
      if (user?.id) {
        socket.emit('register-user', { clerkId: user.id });
      }
    }, [user, isLoaded, isSignedIn]);

  useEffect(() => {
      socket.on('upcoming-dogwalker', (data) => {
        console.log('Received upcoming dogwalker:', data.dogwalkerId);
        setUpcomingDogwalkerId(data.dogwalkerId); 
      });

      return () => {
        socket.off('upcoming-dogwalker');
      };
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
      if (!isLoaded || !isSignedIn || !user?.id) return;
      socket.emit('join', {
        clerkId: user.id,
        userType: 'user',
      });
      const updateLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            socket.emit('update-location-user', {
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

      fetchNotifications();

      // Poll every 5 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000);

    // Cleanup on unmount
    return () => clearInterval(interval);



    }, [user, isLoaded, isSignedIn, socket]);

  useEffect(() => {
    if (!user || !isLoaded) return;

    const syncUser = async () => {
      try {
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/sync`, {
          clerkId: user.id,
          username: user.username || user.firstName,
          email: user.emailAddresses[0].emailAddress,
          profileImage: user.imageUrl,
        });
        console.log("User synced with backend:", res.data);
      } catch (error) {
        console.error("Error syncing user:", error.response?.data || error.message);
      }
    };

    syncUser();
  }, [user, isLoaded]);


  useEffect(() => {
      const fetchAllDogwalkers = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/dogwalker/all`, {
          });
          setFilterDogWalkers(response.data); // Set the fetched dogwalkers
        } catch (error) {
          console.error('Error fetching all dogwalkers:', error);
        }
      };

      fetchAllDogwalkers();
    }, []);

 
  const handleChange2 = (event, newValue) => {
    setValue(newValue);
  };
  function valuetext(value) {
    return `₹${value}`; // for aria
  }
  const handleDeleteNotification = (index) => {
    setNotifications((prevNotifications) => {
      const newNotifications = [...prevNotifications];
      newNotifications.splice(index, 1);
      return newNotifications;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleRateChange = (e) => {
    setFilters({ ...filters, ratePerWalk: e.target.value });
  };

  const fetchSuggestions = async (input) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/map/get-suggestions`, {
        params: { input },
      });
      setLocationSuggestions(response.data || []);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
    }
  };

  const handleLocationChange = (e) => {
    const { value } = e.target;
    setFilters({ ...filters, location: value });
    if (value.length >= 3) {
      fetchSuggestions(value);
    } else {
      setLocationSuggestions([]);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setFilters({ ...filters, location: suggestion });
    setLocationSuggestions([]);
  };

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/map/get-address`, {
        params: { ltd: latitude, lng: longitude },
      });
      return response.data.address;
    } catch (error) {
      console.error('Error fetching address:', error);
      return null;
    }
  };

  function getDateRangeStrings(startDate, endDate) {
    const dates = [];
    let current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      const day = String(current.getDate()).padStart(2, '0');
      const month = String(current.getMonth() + 1).padStart(2, '0');
      dates.push(`${day}/${month}`);
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(filters)

    try {
      const response1 = await axios.get(`${import.meta.env.VITE_BASE_URL}/map/get-coordinates`, {
        params: { address: filters.location },
      });
      console.log('response1:', response1.data);

      const response2 = await axios.get(`${import.meta.env.VITE_BASE_URL}/map/get-dogwalkers-in-radius`, {
        params: {
          ltd: response1.data.ltd,
          lng: response1.data.lng,
          radius: 20, // Example radius in km
        },
      });
      console.log('response2:', response2.data);

      const dateRange = getDateRangeStrings(startDate,endDate);
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/dogwalker/filter`, {
        NearbyWalkers: response2.data,
        dates: dateRange, // Pass dates as an array
      });
      setFilterDogWalkers(response.data);
    } catch (error) {
      console.error('Error fetching filtered dog walkers:', error);
    }
  };

  if (!isLoaded) return  <div className="flex h-screen justify-center items-center">
      <Loader/>
    </div>
  if (!isSignedIn) return <div className="flex h-screen justify-center items-center">
      <Loader/>
    </div>;
    
  return (
    <div className="flex flex-col min-h-screen bg-white">
     
      <Appbar
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        notifications={notifications}
      />

      <FinalForm 
          filters={filters}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleLocationChange={handleLocationChange}
          locationSuggestions={locationSuggestions}
          handleSuggestionSelect={handleSuggestionSelect}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
      />
<div className="flex flex-col lg:flex-row justify-center gap-4 mb-1">

  
  <div className="md:h-[700px] overflow-y-auto w-full max-w-3xl pr-2">
    <WalkerList
      filterdogwalkers={filterdogwalkers}
      addresses={addresses}
      filters={filters}
      value={value}
      user={user}
      socket={socket}
      requestingIds={requestingIds}
      setRequestingIds={setRequestingIds}
      startDate={startDate}
      endDate={endDate}
    />
  </div>


  <div className="h-[700px] w-full md:max-w-sm">
    <LiveTracking filterdogwalkers={filterdogwalkers} />
  </div>
</div>


    <Footer />
    </div>
  );
};

export default UserHome;