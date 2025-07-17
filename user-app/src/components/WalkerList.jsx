import React from "react";
import axios from "axios";
import {Search,Calendar,Star} from "lucide-react"
import { useNavigate } from 'react-router-dom';

function getInitial(username) {
  return username?.charAt(0).toUpperCase() || "";
}

export default function WalkerList({
  filterdogwalkers,
  filters,
  addresses,
  user,
  value,
  socket,
  requestingIds,
  setRequestingIds,
  startDate,
  endDate
}) {
  const navigate = useNavigate();
  return (
    <div className=" flex flex-col justify-center bg-white overflow-y-auto max-w-5xl w-full mx-auto px-4 py-8">
    <h1 className="flex items-center gap-1 font-semibold text-xl text-gray-600">
    <Search className="w-5 h-5" />
    Find a match
    </h1>
    <h2 className="text-base  text-gray-600 w-full max-w-3xl mb-2">Scroll down to browse Dog Walking near you in {filters.location}</h2> 

<div className="w-full">
  {filterdogwalkers.map((walker, index) => (
    <div
      key={index}
      onClick={() =>    
      navigate(`/request/${walker.id}`, {
      state: { walkerName: walker.username,filters:filters,startDate,endDate,walkerId:walker.clerkId}
    })}
      className={`flex flex-col bg-white border-b border-gray-200 p-3 hover:cursor-pointer ${
        index === 0 ? "border-t border-gray-300" : ""
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex space-x-3">
          <div className="relative inline-flex items-center justify-center w-9 h-9 overflow-hidden bg-gray-100 rounded-full">
            <span className="text-sm font-medium text-gray-600">
              {getInitial(walker.username)}
            </span>
          </div>

          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {index + 1}. {walker.username}
            </h3>
            <p className="text-xs text-gray-700">{walker.description}</p>
            <p className="text-xs text-gray-600">
              {addresses[walker._id] || "Your area"}
            </p>
          </div>
        </div>

        <div className="text-right min-w-[70px]">
          <p className="text-xs text-gray-500">from</p>
          <p className="text-green-600 font-bold text-lg">₹{walker.hourlyRate}</p>
          <p className="text-xs text-gray-500">per walk</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-700 mt-2">
        <Star className="w-4 h-4" />
        <span>
          {walker.rating || "5.0"} • {walker.reviewCount || 20} reviews
        </span>
      </div>

      <div className="mt-2">
        <p className="text-xs italic text-gray-700">
          “{walker.review || "Absolutely amazing! My dog came back happy and tired. The walker was friendly, punctual, and clearly loves animals. I’ll definitely book again!"}”
        </p>
      </div>

      <div className="flex items-center gap-1 text-xs text-gray-600 mt-2">
        <Calendar className="w-4 h-4" />
        <p>Updated {walker.updated || "7 days ago"}</p>
      </div>
    </div>
  ))}
</div>


    </div>
  );
}
