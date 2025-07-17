import React, { useState } from 'react';

const tabs = [
  { label: 'All conversations' },
  { label: 'Pending requests' },
  { label: 'Upcoming bookings' },
  { label: 'Active bookings' }
];

const InboxComponent = ({ Bookings }) => {
  const [activeTab, setActiveTab] = useState('All conversations');

  console.log("bookings inside inbox", Bookings);

 
  const filteredBookings = Bookings.filter((booking) => {
    if (activeTab === 'Pending requests') return booking.status === 'pending';
    if (activeTab === 'Upcoming bookings') return booking.status === 'accepted';
    if (activeTab === 'Active bookings') return booking.status === 'started';
    return true; 
  });

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
                  className="p-4 rounded-xl bg-white shadow-sm border border-gray-200"
                >
                 
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-base font-semibold text-gray-800">{booking.service}</p>
                      <p className="text-sm text-gray-500">Requested by: {booking.client || 'Unknown'}</p>
                    </div>
                    {booking.status === 'pending' && (
                      <button
                        className="bg-blue-600 text-white text-xs px-4 py-1 rounded-full hover:bg-blue-700 transition"
                        onClick={() => handleAcceptBooking(booking._id)} // you must define this handler
                      >
                        Accept
                      </button>
                    )}
                  </div>

               
                  {booking.message && (
                    <p className="text-sm text-gray-600 italic mb-2">"{booking.message}"</p>
                  )}

                
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                    <p>
                      <span className="font-medium">From:</span> {new Date(booking.startDate).toLocaleDateString('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})}
                    </p>
                    <p>
                      <span className="font-medium">To:</span> {new Date(booking.endDate).toLocaleDateString('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span> {booking.startTime} - {booking.endTime}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`capitalize ${
                          booking.status === "pending"
                            ? "text-yellow-600"
                            : booking.status === "accepted"
                            ? "text-green-600"
                            : "text-blue-600"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </p>
                  </div>
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
