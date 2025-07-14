import React from "react";
import axios from "axios";

export default function WalkerList({
  filterdogwalkers,
  filters,
  addresses,
  user,
  value,
  socket,
  requestingIds,
  setRequestingIds,
}) {
  return (
    <div className=" flex flex-col justify-start bg-white p-4 rounded-lg shadow-md space-y-4 overflow-y-auto">
      <h2 className="text-2xl font-medium">
        <i className="ri-map-pin-line mr-1"></i>Sitters in your area
      </h2>

      <div className="flex flex-wrap text-sm text-gray-600">
        <h4 className="mr-1">You're seeing sitters available on</h4>
        <p className="text-gray-800 font-medium">{filters.startDate}</p>
      </div>

      <div className="w-full space-y-4">
        {filterdogwalkers.map((walker, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-lg shadow-md border-t border-gray-300 mt-4"
          >
            {/* Top Row */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <img
                  src={walker.profileImage || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <h3 className="text-lg font-semibold">{walker.username}</h3>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500">from</span>
                <p className="font-semibold text-green-600">
                  ₹{walker.hourlyRate} / walk
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-3 text-sm text-gray-700">
              <p>
                <strong>Email:</strong> {walker.email}
              </p>
              <p>
                <strong>Phone:</strong> {walker.phone}
              </p>
              <p>
                <strong>Location:</strong> {addresses[walker._id] || "Loading..."}
              </p>
            </div>

            {/* Ratings */}
            <div className="mt-3">
              <p className="text-sm text-yellow-500">
                ⭐️⭐️⭐️⭐️☆ ({walker.rating || "N/A"})
              </p>
              <p className="text-xs text-gray-500">
                {walker.review || "No reviews available."}
              </p>
            </div>

            {/* Description */}
            <div className="mt-3 text-sm text-gray-800">
              <p>{walker.description || "No description available."}</p>
            </div>

            {/* Send Request */}
            <div className="mt-4">
              <button
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                disabled={requestingIds.includes(walker._id)}
                onClick={async () => {
                  setRequestingIds((prev) => [...prev, walker._id]);

                  socket.emit("new-notification-user", {
                    user: walker.username,
                    message: `${user.fullName} has sent you a ${filters.service} request`,
                    date: new Date().toLocaleString(),
                  });

                  try {
                    const response = await axios.get(
                      `${import.meta.env.VITE_BASE_URL}/map/send-request`,
                      {
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
                      }
                    );
                    console.log("Request sent successfully:", response.data);
                  } catch (error) {
                    console.error("Error sending request:", error);
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
  );
}
