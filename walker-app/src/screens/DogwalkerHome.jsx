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
      {/* Header */}
          <Appbar
               showNotifications={showNotifications}
               setShowNotifications={setShowNotifications}
               notifications={notifications}    />
      
      {/* Main Content */}
      <div className="flex flex-grow mt-4 px-6 space-x-4 ">
        {/* Left Section */}
        <div className="w-1/4 flex flex-col space-y-4 mx-4">
          {/* /* Profile Section */}
          <ProfileCard user={user}/>
 

          {/* /* Pawpals Balance Section */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Pawpals Balance</h2>
            <div className="flex ">
              <div className="flex-1 flex flex-col items-center justify-center border-r border-gray-300 pr-4">
                <p className="text-2xl font-bold text-black-600">₹12,500</p>
                <p className="text-xs text-gray-500">REDEEMABLE</p>
                <Link to="/inbox" className="text-sm text-green-500 hover:underline">
                  Withdraw Money
                </Link>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center border-r border-gray-300 px-4">
                <p className="text-2xl font-bold text-black-600">₹19,000</p>
                <p className="text-xs text-gray-500">TOTAL</p>
                <Link to="/inbox" className="text-sm opacity-50 hover:underline">
                  Apply Promo Code
                </Link>
              </div>
            </div>

            <button className="w-full mt-2 px-4 py-2 font-medium text-black rounded-md bg-[#F3F4F6] hover:bg-white ">
              Pending ₹15,00.00
            </button>

            <button className="w-full mt-2 px-4 py-2 font-medium text-black rounded-md border border-gray-300">
              View Payments & Promo Codes
            </button>
          </div>

          {/* services Section  */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2">Services</h2>
            <div className="flex flex-col space-y-2">
              <div className="flex-1 flex  items-center justify-between ">
                <div>
                  <h3 className="text-lg font-semibold">House Sitting</h3>
                  <p className="text-xs text-gray-500 -mt-1">in your home</p>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black-600">₹450</h2>
                  <p className="text-xs text-gray-500 -mt-1">per night</p>
                </div>
              </div>

              <div className="flex-1 flex  items-center justify-between ">
                <div>
                  <h3 className="text-lg font-semibold">Drop-In Visits</h3>
                  <p className="text-xs text-gray-500 -mt-1">visits in your home</p>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black-600">₹500</h2>
                  <p className="text-xs text-gray-500 -mt-1">per visit</p>
                </div>
              </div>

              <div className="flex-1 flex  items-center justify-between ">
                <div>
                  <h3 className="text-lg font-semibold">Dog Walking</h3>
                  <p className="text-xs text-gray-500 -mt-1">in your neighborhood</p>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black-600">₹200</h2>
                  <p className="text-xs text-gray-500 -mt-1">per walk</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center mt-2">
              <Link to="/inbox" className="text-blue-500 font-semibold">
                See Additional Services & Rates
              </Link>
              <p className="text-xs text-gray-500 -mt-1">Cat care,pick-up & drop-off,bathing/</p>
              <p className="text-xs text-gray-500 -mt-1">grooming</p>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2">Reviews</h2>
            <div className="flex flex-col space-y-4">
              {[
                {
                  reviewer: "John Doe",
                  comment: "Amazing service! Highly recommend.",
                  stars: 5,
                  profilePhoto: "https://i.pravatar.cc/40?img=1",
                },
                {
                  reviewer: "Jane Smith",
                  comment: "Very professional and caring.",
                  stars: 4,
                  profilePhoto: "https://i.pravatar.cc/40?img=2",
                },
              ].map((review, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={review.profilePhoto}
                    alt={`${review.reviewer}'s profile`}
                  />
                  <div>
                    <p className="text-sm font-semibold">{review.reviewer}</p>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: review.stars }).map((_, i) => (
                        <FontAwesomeIcon key={i} icon={faStar} className="text-yellow-500 text-xs" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-2">
              <Link to="/inbox" className="text-blue-500 font-semibold hover:underline">
                Show All Reviews
              </Link>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-3/4 flex flex-col space-y-4">
          {/* Availability Calendar Section */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2">Your availability for the next month</h2>
            <p className="font-normal opacity-50">Want more requests that are right for you?</p>
            <p className="font-normal mb-2 opacity-50">
              Confirm your availability to highlight your profile in search results. Deselect any days you're not available.
            </p>
            <div className="grid grid-cols-8 gap-2">
              {Array.from({ length: 30 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                const day = date.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = String(date.getDate()).padStart(2, '0'); // e.g., '08'
                const monthNum = String(date.getMonth() + 1).padStart(2, '0'); // e.g., '04'
                const dateNum = `${dayNum}/${monthNum}`; // '08/04'

                const isSelected = selectedDates.includes(dateNum);

                return (
                  <div
                  key={i}
                  onClick={() => toggleDateSelection(dateNum)}
                  className={`flex flex-col items-center justify-center w-18 h-18 border rounded-md cursor-pointer ${
                  isSelected ? 'bg-gray-200 border-gray-100' : 'border-gray-300 hover:bg-gray-200'
                  }`}
                  >
                  <span className="text-sm font-medium">{day}</span>
                  <span className="text-lg font-bold">{dateNum}</span>
                  </div>
                );
                })}
                </div>
                <div className="flex flex-row-reverse">
                <button
                onClick={() => {
                  confirmAvailability();
                  setButtonClicked(true);
                }}
                disabled={buttonClicked}
                className={`mt-2 px-4 py-2 font-medium text-black rounded-md ml-1 ${
                buttonClicked
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[#F3F4F6] hover:bg-white'
                }`}
                >
                <FontAwesomeIcon icon={faCheck} /> {buttonClicked ? 'Confirmed' : 'Confirm Availability'}
                </button>
                </div>
                </div>
     

          {/* 📪 Requestes Section */}
         <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-2">Received Requests 📬</h2>
          <p className="font-normal opacity-50 mb-4">Here are your requests for the next week:</p>

          <div className="flex flex-col space-y-4 max-h-96 overflow-y-auto">
            {upcomingBookings.map((booking, index) => (
              <div
                key={index}
                className={`flex flex-col p-3 border rounded-md ${
                  booking.status === 'accepted'
                    ? 'bg-green-100 border-green-400'
                    : booking.status === 'declined'
                    ? 'bg-red-100 border-red-400'
                    : booking.status === 'started'
                    ? 'bg-blue-100 border-blue-400'
                    : booking.status === 'cancelled'
                    ? 'bg-gray-100 border-gray-400'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{booking.service}</p>
                    <p className="text-xs text-gray-500">{booking.client}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{booking.date}</p>
                    <p className="text-xs text-gray-500">{booking.time}</p>
                  </div>
                </div>

                <div className="flex justify-end mt-2 space-x-2">
                  {booking.status === 'pending' && (
                    <>
                      <button
                        className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
                        onClick={() => {
                          const updatedBookings = upcomingBookings.map((b) =>
                            b === booking ? { ...b, status: 'accepted' } : b
                          );
                          setUpcomingBookings(updatedBookings);
                          updateBookingStatus(booking._id, 'accepted');

                          socket.emit('new-notification-dogwalker', {
                            message: `Your booking request for ${booking.service} on ${booking.date} has been accepted by ${user.fullName}.`,
                            date: new Date().toLocaleDateString(),
                            user: booking.client,
                          });
                        }}
                      >
                        Accept
                      </button>
                      <button
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                        onClick={() => {
                          const updatedBookings = upcomingBookings.map((b) =>
                            b === booking ? { ...b, status: 'declined' } : b
                          );
                          setUpcomingBookings(updatedBookings);
                          updateBookingStatus(booking._id, 'declined');

                          socket.emit('new-notification-dogwalker', {
                            message: `Your booking request for ${booking.service} on ${booking.date} has been declined by ${user.fullName}.`,
                            date: new Date().toLocaleDateString(),
                            user: booking.client,
                          });
                        }}
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {booking.status === 'accepted' && (
                    <button className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md cursor-default">
                      Accepted
                    </button>
                  )}

                  {booking.status === 'declined' && (
                    <button className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md cursor-default">
                      Declined
                    </button>
                  )}

                  {booking.status === 'started' && (
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md cursor-default">
                      Started
                    </button>
                  )}

                  {booking.status === 'cancelled' && (
                    <button className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-md cursor-default">
                      Cancelled
                    </button>
                  )}
                </div>
              </div>
    ))}
  </div>
</div>


          {/* Upcoming Walks Section */}
          <UpcomingWalks
          bookings={upcomingBookings}
          onStart={async (booking) => {
            try {
              await axios.patch(`${import.meta.env.VITE_BASE_URL}/dogwalker/booking-status`, {
                clerkId: user.id,
                bookingId: booking._id,
                status: 'started',
              });

               setUpcomingBookings((prev) =>
                prev.map((b) =>
                  b._id === booking._id ? { ...b, status: 'started' } : b
                )
              );


              socket.emit('booking-request-started',{   
                            message: `${user.fullName} will be arriving shortly at you doorstep for your scheduled ${booking.service} on ${booking.date}`,
                            date: new Date().toLocaleDateString(),
                            user: booking.client,
                            })
              setClientId(booking.clientId); // Set the client ID for the route
              setUserRoute(true);   //Starts displaying route to user location
             
            } catch (err) {
              console.error('Error starting walk:', err);
            }
          }}
          onCancel={async (booking) => {
            try {
              await axios.patch(`${import.meta.env.VITE_BASE_URL}/dogwalker/booking-status`, {
                clerkId: user.id,
                bookingId: booking._id,
                status: 'cancelled',
              });

                setUpcomingBookings((prev) =>
                prev.map((b) =>
                  b._id === booking._id ? { ...b, status: 'cancelled' } : b
                )
              );
                socket.emit('booking-request-cancelled',{   
                            message: `Your accepted booking for ${booking.service} on ${booking.date} has been cancelled by ${user.fullName}. We apologize for the inconvenience.`,
                            date: new Date().toLocaleDateString(),
                            user: booking.client,
                            })
            } catch (err) {
              console.error('Error cancelling walk:', err);
            }
          }}
        />


           {/* Show the live route map */}
          <div className="bg-white p-4 rounded-lg shadow-md h-[500px]">
           <h2 className="text-2xl font-bold mb-2">Directions to your booking location</h2>
       {   userRoute && <RouteToUser userLocation={userLocation} />}
        </div>



        </div>
      </div>



      {/* footer */}
      <div className="mt-4"> 
          <Footer/>
      </div>
    
    </div>
  );
};

export default DogwalkerHome;