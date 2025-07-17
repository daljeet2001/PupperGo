import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const AvailabilityCalendar = ({
  selectedDates,
  toggleDateSelection,
  confirmAvailability,
  buttonClicked,
  setButtonClicked,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
     
      <h2 className="text-2xl font-bold mb-2">Your availability for the next month</h2>
      <p className="font-normal opacity-50">Want more requests that are right for you?</p>
      <p className="font-normal mb-2 opacity-50">
        Confirm your availability to highlight your profile in search results. Deselect any days you're not available.
      </p>

 
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-2">
        {Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() + i);
          const day = date.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNum = String(date.getDate()).padStart(2, '0');
          const monthNum = String(date.getMonth() + 1).padStart(2, '0');
          const dateNum = `${dayNum}/${monthNum}`;
          const isSelected = selectedDates.includes(dateNum);

          return (
            <div
              key={i}
              onClick={() => toggleDateSelection(dateNum)}
              className={`flex flex-col items-center justify-center w-full h-20 sm:h-24 border rounded-md cursor-pointer transition-all ${
                isSelected
                  ? 'bg-gray-200 border-gray-100'
                  : 'border-gray-300 hover:bg-gray-200'
              }`}
            >
              <span className="text-sm font-medium">{day}</span>
              <span className="text-lg font-bold">{dateNum}</span>
            </div>
          );
        })}
      </div>

    
      <div className="flex flex-row-reverse mt-4">
        <button
          onClick={() => {
            confirmAvailability();
            setButtonClicked(true);
          }}
          disabled={buttonClicked}
          className={`px-4 py-2 font-medium text-black rounded-md ml-1 transition ${
            buttonClicked
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-[#F3F4F6] hover:bg-white'
          }`}
        >
          <FontAwesomeIcon icon={faCheck} /> {buttonClicked ? 'Confirmed' : 'Confirm Availability'}
        </button>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
