import React from 'react';
import { User } from 'lucide-react';

const UpcomingWalks = ({ bookings, onStart, onCancel }) => {

  const activeBookings = bookings.filter(
    (b) => ['accepted', 'started', 'cancelled'].includes(b.status)
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">Upcoming Walks</h2>
      {activeBookings.length === 0 ? (
        <p className="text-gray-500 text-sm">No upcoming walks.</p>
      ) : (
        <div className="flex flex-col space-y-4 max-h-43 overflow-y-auto">
          {activeBookings.map((booking, index) => (
            <div key={index} className="flex items-start space-x-4">
        
              {/* Booking Info */}
              <div className="flex-1">
                <p className="text-sm font-semibold">{booking.service}</p>
                <p className="text-xs text-gray-500">
                  on {booking.date} at {booking.time}
                </p>
           

              </div>

              {/* Conditional Buttons */}
              <div className="flex gap-2 mt-1">
                {booking.status === 'accepted' && (
                  <>
                    <button
                      onClick={() => onStart?.(booking)}
                      className="px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      Start
                    </button>
                    <button
                      onClick={() => onCancel?.(booking)}
                      className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </>
                )}

                {booking.status === 'started' && (
                  <button
                    disabled
                    className="px-2 py-1 text-xs text-white bg-gray-500 rounded  cursor-not-allowed"
                  >
                    Started
                  </button>
                )}

                {booking.status === 'cancelled' && (
                  <button
                    disabled
                    className="px-2 py-1 text-xs text-white bg-gray-500 rounded cursor-not-allowed"
                  >
                    Cancelled
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingWalks;


