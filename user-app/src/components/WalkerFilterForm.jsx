import React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

export default function WalkerFilterForm({
  filters,
  value,
  handleChange,
  handleChange2,
  handleSubmit,
  handleLocationChange,
  locationSuggestions,
  handleSuggestionSelect,
}) {
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-lg font-[Open_Sans]">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Location */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleLocationChange}
            placeholder="e.g., New York"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          {locationSuggestions.length > 0 && (
            <ul className="shadow-inner  rounded-xl mt-2 bg-white max-h-40 overflow-y-auto">
              {locationSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className="px-4 py-2 rounded-md shadow-inner hover:bg-gray-100 cursor-pointer"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Service */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
          <select
            name="service"
            value={filters.service || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="Dog walking">Dog walking</option>
            {/* <option value="Doggy day care">Doggy day care</option>
            <option value="Home visits">Home visits</option>
            <option value="Dog boarding">Dog boarding</option> */}
          </select>
        </div>

        {/* Walkers per day */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Walkers per day</label>
          <select
            name="walkersPerDay"
            value={filters.walkersPerDay || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="" disabled>Select an option</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3+">3+</option>
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Time Needed */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time needed</label>
          <select
            name="timeNeeded"
            value={filters.timeNeeded || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="" disabled>Select a time</option>
            <option value="6am to 11am">6am to 11am</option>
            <option value="11am to 3pm">11am to 3pm</option>
            <option value="3pm to 10pm">3pm to 10pm</option>
          </select>
        </div>

        {/* Rate per walk */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Rate per walk</label>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <span className="text-sm">₹{value[0]}</span>
              <Slider
                value={value}
                onChange={handleChange2}
                valueLabelDisplay="auto"
                valueLabelFormat={(val) => `₹${val}`}
                min={100}
                max={1000}
                step={50}
                sx={{
                  color: "black",
                  flexGrow: 1,
                  "& .MuiSlider-thumb": {
                    backgroundColor: "white",
                    border: "2px solid #9e9e9e",
                    "&:hover, &.Mui-focusVisible, &.Mui-active": {
                      boxShadow: "0px 0px 0px 8px rgba(0, 0, 0, 0.16)",
                    },
                  },
                  "& .MuiSlider-track": { backgroundColor: "black" },
                  "& .MuiSlider-rail": { backgroundColor: "#e0e0e0" },
                }}
              />
              <span className="text-sm">₹{value[1]}</span>
            </Box>
          </Box>
        </div>

        {/* Submit */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 "
          >
            Search Walkers
          </button>
        </div>
      </form>
    </div>
  );
}
