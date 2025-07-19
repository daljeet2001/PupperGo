import React, { useState,useContext,useEffect } from 'react';
import axios from 'axios';
import { SocketContext } from '../context/SocketContext';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const tabs = [
  { label: 'All bookings' },
  { label: 'Pending bookings' },
  { label: 'Upcoming bookings' },
  { label: 'Active bookings' }
];





const InboxComponent = ({ Bookings,setUpcomingDogwalkerId }) => {
  const [activeTab, setActiveTab] = useState('All bookings');
  const { socket } = useContext(SocketContext);
  const { user, isSignedIn, isLoaded } = useUser();
  const [actionTaken, setActionTaken] = useState(false);
  const [actionTaken1,setActionTaken1]=useState(false);
  const [actionTaken2,setActionTaken2]=useState(false)

  const navigate=useNavigate();
  
  useEffect(() => {
  const activeBooking = Bookings.find((b) => b.status === 'started');
  if (activeBooking) {
    setUpcomingDogwalkerId(activeBooking.walkerId);
  }
}, [Bookings]);


 
  const filteredBookings = Bookings.filter((booking) => {
    if (activeTab === 'Pending bookings') return booking.status === 'pending';
    if (activeTab === 'Upcoming bookings') return booking.status === 'accepted';
    if (activeTab === 'Active bookings') return booking.status === 'started';
    return true; 
  });

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



  return (
    <div className="max-w-5xl mx-auto my-6">
      <h1 className="text-3xl font-bold text-gray-800 p-4">Inbox</h1>

      <div className="bg-white flex overflow-hidden h-100">
       
        <div className="w-52 p-4">
          <div className="space-y-4">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                className={`block text-left text-sm font-medium transition ${
                  activeTab === tab.label ? 'text-black font-semibold' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab(tab.label)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

      
        <div className="flex-1 p-4 overflow-y-auto">
          <h2 className="text-base font-semibold mb-3">{activeTab}</h2>

          {filteredBookings.length === 0 ? (
            <div className="border border-dashed border-gray-300 p-4 rounded-md text-gray-500 text-xs">
              No bookings found in <b>{activeTab}</b>.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
               <div
                  key={booking._id}
                  className="p-4 rounded-xl  shadow-inner"
                >              
                 <p className="text-sm text-gray-600">
                  You requested <span className="font-medium">{booking.service}</span> from <span className="font-medium">{booking.walkerName}</span> between {booking.startTime}–{booking.endTime} from {new Date(booking.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} to {new Date(booking.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}. Message: <span className="italic">"{booking.message}"</span>
                </p>


                  
                
                </div>

              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InboxComponent;
