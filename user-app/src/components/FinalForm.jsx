import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";


export default function FinalForm({
  filters,
  handleChange,
  handleSubmit,
  handleLocationChange,
  locationSuggestions,
  handleSuggestionSelect,
  startDate,
  endDate,
  setStartDate,
  setEndDate
}) {

  return (
    <div
  className="w-full h-[525px] bg-cover bg-center relative text-white"
  style={{
    backgroundImage:
      "url('https://images.unsplash.com/photo-1579683571996-f3482b0907c2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
  }}
>
  <div className="absolute inset-0 flex items-center justify-center px-4">
<form
  onSubmit={handleSubmit}
  className="bg-white p-6 rounded-sm shadow-md w-full max-w-2xl flex flex-col gap-4 justify-between"
>
  {/* Service Type */}
  <div className="w-full">
    <label className="block text-sm font-semibold text-gray-800 mb-2">
      I’m looking for service for my:
    </label>
    <div className="flex gap-3">
      <label className="flex items-center gap-1 text-sm text-gray-700 font-medium">
        <input type="checkbox" checked readOnly className="accent-black w-4 h-4" />
        Dog
      </label>
      <label className="flex items-center gap-1 text-sm text-gray-400">
        <input type="checkbox" disabled className="w-4 h-4" />
        Cat
      </label>
    </div>
  </div>



<div className="flex w-full justify-between">
  {/* Address */}
  <div className="w-1/2 md:w-[48%]">
    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
    <input
      type="text"
      name="location"
      value={filters.location}
      onChange={handleLocationChange}
      placeholder="Add your address"
      className="w-full px-3 py-2 border-2 border-gray-300 rounded-sm text-sm  text-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
    />
    {locationSuggestions.length > 0 && (
      <ul className="border border-gray-200 rounded-md mt-2 bg-white max-h-40 overflow-y-auto">
        {locationSuggestions.map((suggestion, index) => (
          <li
            key={index}
            onClick={() => handleSuggestionSelect(suggestion)}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
          >
            {suggestion}
          </li>
        ))}
      </ul>
    )}
  </div>

  {/* Dates */}
  <div className="w-1/2 md:w-[48%]">
   
    <div className="flex gap-2">
      <div className="flex flex-col w-full">
         <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <div className="relative w-full">
            <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Start date"
                className="w-full pr-9 pl-3 py-2 border-2 border-gray-300 rounded-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
                calendarClassName="!bg-white !rounded-md !p-2 !shadow-lg"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

      </div>
      <div className="flex flex-col w-full">
       <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <div className="relative w-full">
            <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="End date"
                className="w-full pr-9 pl-3 py-2 border-2 border-gray-300 rounded-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
                calendarClassName="!bg-white !rounded-md !p-2 !shadow-lg"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

      </div>
    </div>
  </div>
</div>
<div className="flex flex-col md:flex-row w-full gap-4">
  {/* Time slots */}
  <div className="w-full md:w-3/4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Preferred Time
    </label>
    <div className="flex flex-wrap gap-3">
      {[
        { label: "Morning", time: "6am to 11am" },
        { label: "Afternoon", time: "11am to 3pm" },
        { label: "Evening", time: "3pm to 10pm" },
      ].map((slot) => (
        <button
          key={slot.time}
          type="button"
          onClick={() =>
            handleChange({ target: { name: "timeNeeded", value: slot.time } })
          }
          className={`border-2 px-5 py-3 rounded-sm text-sm font-medium flex flex-col items-center justify-center w-full sm:w-[140px] transition ${
            filters.timeNeeded === slot.time
              ? "border-black text-black"
              : "border-gray-300 text-gray-700"
          }`}
        >
          <span className="text-xs font-semibold">{slot.label}</span>
          <span className="text-xs text-gray-500">{slot.time}</span>
        </button>
      ))}
    </div>
  </div>

  {/* Submit button */}
  <div className="w-full md:w-1/4 mt-4 md:mt-0 flex items-end">
    <button
      type="submit"
      className="w-full h-[60px] bg-[#2b61eb] hover:opacity-90 text-white font-semibold rounded-full text-sm md:text-base transition shadow-md"
    >
      Search
    </button>
  </div>
</div>


</form>


  </div>
</div>
  );
}

