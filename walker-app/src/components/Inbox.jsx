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





const InboxComponent = ({ Bookings,setLive,setStartJourney }) => {
  const [activeTab, setActiveTab] = useState('All bookings');
  const { socket } = useContext(SocketContext);
  const { user, isSignedIn, isLoaded } = useUser();
  const [actionTaken, setActionTaken] = useState(false);
  const [actionTaken1,setActionTaken1]=useState(false);
  const [actionTaken2,setActionTaken2]=useState(false)
  const [clientId, setClientId] = React.useState(null);
  const navigate=useNavigate();
  

 
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

  const fetchClientLocation = async (id) => {
  try {
    const res = await axios.get(  `${import.meta.env.VITE_BASE_URL}/user/location/${id}`);
    return res.data.location; // { lat, lng }
  } catch (error) {
    console.error('Error fetching client location:', error.response?.data?.error || error.message);
  }
};

  useEffect(() => {
  // console.log('Fetching client location for ID:', clientId);
  const getLocation = async () => {
    const location = await fetchClientLocation(clientId); // assuming client = clientId
    if (location) {
      setLive(location);
    }
  };

  getLocation();
  }, [clientId, isLoaded, isSignedIn]);

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
                    <p className="text-sm text-gray-600">You have recieved a {booking.service} request for the dates {new Date(booking.startDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })} to {new Date(booking.endDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })},scheduled between {booking.startTime} and {booking.endTime}. The client left the foloowing message:<span className="italic"> "{booking.message}" </span> ~{booking.client} </p>

                      {booking.status === "pending" && !actionTaken &&(<div>
                        <button className="hover:cursor-pointer mr-2 text-sm text-gray-600"
                                 onClick={() => {
                          updateBookingStatus(booking._id, 'accepted');

                          socket.emit('new-notification-dogwalker', {
                            message: `Your ${booking.service} request for ${new Date(booking.startDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })} to ${new Date(booking.endDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })},scheduled between ${booking.startTime} and ${booking.endTime} has been accepted by the walker.Live location will be available once the walk starts.`,
                                date: new Date().toLocaleDateString(),
                                userId: booking.clientId,
                              });
                            setActionTaken(true);
                           
                        }}
                        >accept</button>
                        <button className="hover:cursor-pointer text-sm text-gray-600"
                                 onClick={() => {
                          updateBookingStatus(booking._id, 'declined');

                            socket.emit('new-notification-dogwalker', {
                            message: `Your ${booking.service} request for ${new Date(booking.startDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })} to ${new Date(booking.endDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })},scheduled between ${booking.startTime} and ${booking.endTime} has been declined by the walker.Sorry for the inconvenience.`,
                                date: new Date().toLocaleDateString(),
                                userId: booking.clientId,
                              });
                            setActionTaken(true);
                            
                        }} 
                        >delete</button>
                      </div>)}

                       {booking.status === "accepted" && !actionTaken2 &&(<div>
                        <button className="hover:cursor-pointer mr-2 text-sm text-gray-600"
                                 onClick={async () => {
                                 try {
                                  await axios.patch(`${import.meta.env.VITE_BASE_URL}/dogwalker/booking-status`, {
                                    clerkId: user.id,
                                    bookingId: booking._id,
                                    status: 'started',
                                  });


                                  socket.emit('booking-request-started',{   
                                                message:`Your ${booking.service} session for ${new Date(booking.startDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })} to ${new Date(booking.endDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })},scheduled between ${booking.startTime} and ${booking.endTime} has been started by the walker.You can now track the live location in real time in your inbox.`,
                                                date: new Date().toLocaleDateString(),
                                                user: booking.client,
                                                userClerkId: booking.clientId,
                                                dogwalkerId: user.id, 

                                                })
                                                setClientId(booking.clientId);
                                                setStartJourney(true);
                                                setActionTaken2(true)
                                
                                } catch (err) {
                                  console.error('Error starting walk:', err);
                                }
                                }}
                        >start</button>
                     
                      </div>)}

                      {booking.status === "started" && !actionTaken1  && (<div>
                         {/* <button className="hover:cursor-pointer mr-2 text-sm text-gray-600"
                        //  onClick={()=>navigate('/navigate',{
                        //  state: {
                        //  userLocation: userLocation,  
                        //  },
                        //  })}
                        >navigate</button> */}

                        <button className="hover:cursor-pointer mr-2 text-sm text-gray-600"
                                 onClick={async () => {
                                 try {
                                  await axios.patch(`${import.meta.env.VITE_BASE_URL}/dogwalker/booking-status`, {
                                    clerkId: user.id,
                                    bookingId: booking._id,
                                    status: 'completed',
                                  });


                                  socket.emit('booking-request-completed',{   
                                                message:`Your ${booking.service} session for ${new Date(booking.startDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })} to ${new Date(booking.endDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })},scheduled between ${booking.startTime} and ${booking.endTime} has been completed by the walker. Please take a moment to leave a review for your walker.`,
                                                date: new Date().toLocaleDateString(),
                                                user: booking.client,
                                                userClerkId: booking.clientId,
                                                dogwalkerId: user.id, 

                                                })
                                  // setClientId(booking.clientId); 
                                  // setUserRoute(true);   
                                  setStartJourney(false)
                                  setActionTaken1(true)
                                
                                } catch (err) {
                                  console.error('Error starting walk:', err);
                                }
                                }}
                        >finish</button>

                       
                     
                      </div>)}
                
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
