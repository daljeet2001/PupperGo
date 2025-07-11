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


const UserHome = () => {
  const [filters, setFilters] = useState({
    location: '',
    service: 'Dog walking',
    startDate: '',
    endDate: '',
    walkersPerDay: '',
    timeNeeded: '',
  });

  const { socket } = useContext(SocketContext);
  const [filterdogwalkers, setFilterDogWalkers] = useState([]);
  const [value, setValue] = useState([100, 1000]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [addresses, setAddresses] = useState({});
  const [requestingIds, setRequestingIds] = useState([]); // State to track requesting dogwalker IDs
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]); // Initialize with dummy data
  const navigate = useNavigate();
  const { user, isSignedIn, isLoaded } = useUser();
  console.log('User:', user);


 
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

      const dateRange = getDateRangeStrings(filters.startDate, filters.endDate);

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/dogwalker/filter`, {
        NearbyWalkers: response2.data,
        dates: dateRange, // Pass dates as an array
        hourlyRatelow: value[0],
        hourlyRatehigh: value[1],
      });
      setFilterDogWalkers(response.data);
    } catch (error) {
      console.error('Error fetching filtered dog walkers:', error);
    }
  };

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Please sign in</div>;
    
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <Appbar
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        notifications={notifications}
      />

    

        {/* Main Content */}
      <div className="flex flex-grow mt-4  px-6 space-x-4">
        {/* Left Section */}
        <div className="w-1/4 flex flex-col space-y-4 mx-4">
          {/* Section: Filter Form */}
          <div className="max-w-md bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Choose your pet walker</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Location:</label>
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleLocationChange}
                  placeholder="e.g., New York"
                  className="w-full px-3 py-2 border border-grey rounded-md hover:border-black"
                />
                {locationSuggestions.length > 0 && (
                  <ul className="border border-gray-300 rounded-md mt-2 bg-white max-h-40 overflow-hidden">
                    {locationSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => handleSuggestionSelect(suggestion)}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Service:</label>
                <select
                  name="service"
                  value={filters.service || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-grey rounded-md hover:border-black"
                >
                  <option value="Dog walking">Dog walking</option>
                  <option value="Doggy day care">Doggy day care</option>
                  <option value="Home visits">Home visits</option>
                  <option value="Dog boarding">Dog boarding</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Walkers per day:</label>
                <select
                  name="walkersPerDay"
                  value={filters.walkersPerDay || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-grey rounded-md hover:border-black"
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3+">3+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Date:</label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-grey rounded-md hover:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date:</label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-grey rounded-md hover:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time needed:</label>
                <select
                  name="timeNeeded"
                  value={filters.timeNeeded || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-grey rounded-md hover:border-black"
                >
                  <option value="" disabled>
                    Select a time
                  </option>
                  <option value="6am to 11am">6am to 11am</option>
                  <option value="11am to 3pm">11am to 3pm</option>
                  <option value="3pm to 10pm">3pm to 10pm</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Rate per walk</label>
                <Box sx={{ width: 300 }}>
                  {/* Dynamic min/max display */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ minWidth: 50 }}>₹{value[0]}</Typography>

                    <Slider
                      value={value}
                      onChange={handleChange2}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(val) => `₹${val}`}
                      min={100}
                      max={1000}
                      step={50}
                      sx={{
                        color: 'black',
                        height: 10,
                        flexGrow: 1,
                        mx: 1,
                        '& .MuiSlider-thumb': {
                          backgroundColor: 'white',
                          border: '2px solid #9e9e9e',
                          '&:hover, &.Mui-focusVisible, &.Mui-active': {
                            boxShadow: '0px 0px 0px 8px rgba(0, 0, 0, 0.16)',
                          },
                        },
                        '& .MuiSlider-track': {
                          backgroundColor: 'black',
                        },
                        '& .MuiSlider-rail': {
                          backgroundColor: '#bdbdbd',
                        },
                      }}
                    />
                    &nbsp;&nbsp;
                    <Typography sx={{ minWidth: 50 }}>₹{value[1]}</Typography>
                  </Box>
                </Box>
              </div>
              <div className="col-span-2">
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Profile Section */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-medium mb-4">Account Info</h2>
            <div className="flex items-center space-x-4 ml-2">
              <img
                className="w-16 h-16 rounded-full object-cover"
                src={user.imageUrl}
                alt="Profile"
              />
              <div className="flex flex-col ml-2">
                <p className="text-base font-semibold">{user.fullName}</p>
                <Link to="/inbox" className="text-sm mt-1 opacity-50 hover:underline">
                  Edit Profile
                </Link>
                <Link to="/inbox" className="text-sm opacity-50 hover:underline">
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Center Section: List of Pet Walkers */}
        <div className="w-3/8 flex flex-col justify-start bg-white p-4 rounded-lg shadow-md space-y-4 overflow-y-auto">
          <h2 className="text-2xl font-medium">
            <i className="ri-map-pin-line mr-1"></i>Sitters in your area
          </h2>
          <div className="flex">
            <h4 className="text-gray-500 mr-1">You're seeing sitters available on</h4>{' '}
            <p className="text-gray-800 font-medium">{filters.startDate}</p>
          </div>
          <div className="w-full space-y-4">
            {filterdogwalkers.map((walker, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg shadow-md border-t border-gray-300 mt-4"
              >
                {/* Top row: Profile picture + Name on left, Rate on right */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <img
                      src={walker.profileImage || 'https://via.placeholder.com/150'}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <h3 className="text-lg font-semibold">{walker.username}</h3>
                  </div>
                  <div>
                    <span>from</span>
                    <p className="text-right font-semibold text-green-600">
                      ₹{walker.hourlyRate} / walk
                    </p>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="mt-3 text-sm text-gray-700">
                  <p>
                    <strong>Email:</strong> {walker.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {walker.phone}
                  </p>
                  <p>
                    <strong>Location:</strong> {addresses[walker._id] || 'Loading...'}
                  </p>
                </div>

                {/* Reviews */}
                <div className="mt-3">
                  <p className="text-sm text-yellow-500">
                    ⭐️⭐️⭐️⭐️☆ ({walker.rating || 'N/A'})
                  </p>
                  <p className="text-xs text-gray-500">
                    {walker.review || 'No reviews available.'}
                  </p>
                </div>

                {/* Description */}
                <div className="mt-3 text-sm text-gray-800">
                  <p>{walker.description || 'No description available.'}</p>
                </div>

                {/* Send Request Button */}
                <div className="mt-4">
                  <button
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                    disabled={requestingIds.includes(walker._id)} // Disable button for specific walker
                  onClick={async () => {
                    setRequestingIds((prev) => [...prev, walker._id]);
                    socket.emit('new-notification-user', {
                        user: walker.username,
                        message: `${user.fullName} has sent you a ${filters.service} request`,
                        date: new Date().toLocaleString(),
                      })
                    try {
                      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/map/send-request`, {
                        params: {
                          user: JSON.stringify({
                            id: user?.id,
                            name: user?.username || user?.firstName || "Anonymous",
                            profileImage: user?.imageUrl,
                          }),
                          filters: JSON.stringify({
                            location: filters.location,
                            service: filters.service,
                            startDate: filters.startDate,
                            endDate: filters.endDate,
                            timeNeeded: filters.timeNeeded,
                            rateRange: value,
                          }),
                          dogwalkerId: walker.clerkId,
                        },
                   
                      });
                      console.log('Request sent successfully:', response.data);
                    } catch (error) {
                      console.error('Error sending request:', error);
                    }
                  }}

                  >
                    Send Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

     

        {/* Right Section: LiveTracking */}
        <div className="w-3/8 flex items-center justify-center bg-white h-screen sticky top-0 rounded-lg shadow-md  space-y-4 ">
          <LiveTracking filterdogwalkers={filterdogwalkers} />
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UserHome;