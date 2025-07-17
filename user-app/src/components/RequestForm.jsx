import { useState,useContext } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import Select from "react-select";
import { Minus, Plus,Dog,Cat,PawPrint } from "lucide-react";
import { useUser } from '@clerk/clerk-react';
import { SocketContext } from '../context/SocketContext';
import axios from 'axios';


const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  const date = new Date(0, 0, 0, hour, minute);
  const label = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const value = `${hour.toString().padStart(2, "0")}:${minute}`;
  return { label, value };
});

const serviceOptions = [
  {
    label: (
      <div className="flex items-center gap-2">
        <PawPrint className="text-black w-4 h-4" />
        <span>Dog Walking • in your neighborhood</span>
      </div>
    ),
    value: "dog-walking",
  },
];


const Counter = ({ count, onDecrement, onIncrement }) => (
    <div className="flex items-center gap-4">
      <button
        onClick={onDecrement}
        disabled={count === 0}
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          count === 0 ? "bg-gray-200 text-white" : "bg-gray-200"
        }`}
      >
        <Minus size={18} />
      </button>
      <span className="text-lg">{count}</span>
      <button
        onClick={onIncrement}
        className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center"
      >
        <Plus size={18} />
      </button>
    </div>
  );




export default function RequestForm({walkerName,filters,startDate,endDate,walkerId}) {
  console.log(filters,walkerName,startDate,endDate,walkerId)

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState();
  const [message, setMessage] = useState();
  const [receiveUpdates, setReceiveUpdates] = useState(true);
  const [dogCount, setDogCount] = useState(1);
  const [catCount, setCatCount] = useState(0);
  const [selectedService,setSelectedService]=useState(serviceOptions[0]);
  const { user, isSignedIn, isLoaded } = useUser();
  const { socket } = useContext(SocketContext);
  

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Contact {walkerName}</h1>



     <div className="flex flex-col w-full mt-2">
      <label className="block text-sm font-medium text-gray-800 mb-1">
        What service?
      </label>

      <Select
        options={serviceOptions}
        value={selectedService}
        onChange={setSelectedService}
        unstyled
        components={{ DropdownIndicator: () => null }}
        classNames={{
          control: ({ isFocused }) =>
            `flex items-center justify-between w-full border-2 rounded-md px-3 py-2 text-sm ${
              isFocused ? "border-black" : "border-gray-300"
            }`,
          menu: () =>
            "mt-1 max-h-60 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-md z-50",
          option: ({ isFocused, isSelected }) =>
                `text-sm px-3 py-2 ${
                    isSelected
                    ? "bg-gray-300 text-black"
                    : isFocused
                    ? "bg-gray-100"
                    : "text-gray-600"
                }`,
          singleValue: () => "flex items-center gap-2 text-gray-800 text-sm",
          placeholder: () => "hidden",
         
        }}
      />
    </div>  


    <div className="flex gap-2 mt-6 ">
      <div className="flex flex-col w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Start Time
        </label>
            <Select
            unstyled
            options={timeOptions}
            value={startTime}
            onChange={setStartTime}
            components={{ DropdownIndicator: () => null }}
            classNames={{
                control: ({ isFocused }) =>
                    `w-full pr-9 pl-3 py-2 border-2 rounded-sm text-sm text-gray-700 ${
                    isFocused ? "border-black ring-2 ring-black" : "border-gray-300"
                    } focus:outline-none`,

                option: ({ isFocused, isSelected }) =>
                    `text-sm px-3 py-2 cursor-pointer ${
                    isSelected
                        ? "bg-gray-300 text-black font-medium"
                        : isFocused
                        ? "bg-gray-100 text-gray-800"
                        : "text-gray-600"
                    }`,

                menu: () =>
                    "max-h-60 overflow-y-auto shadow-lg rounded-md mt-1 z-10 bg-white border border-gray-200",

                singleValue: () => "flex items-center gap-2 text-gray-800 text-sm",

                placeholder: () => "hidden",
            }}

            
       
            />
      </div>

      <div className="flex flex-col w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          End Time
        </label>
            <Select
            unstyled
            options={timeOptions}
            value={endTime}
            onChange={setEndTime}
            components={{ DropdownIndicator: () => null }}
            
            classNames={{
                control: ({ isFocused }) =>
                `w-full pr-9 pl-3 py-2 border-2 rounded-sm text-sm text-gray-700 ${
                    isFocused
                    ? "focus:outline-none focus:ring-2 focus:ring-black"
                    : "border-gray-300"
                } focus:outline-none`,
                 option: ({ isFocused, isSelected }) =>
                `text-sm px-3 py-2 ${
                    isSelected
                    ? "bg-gray-300 text-white"
                    : isFocused
                    ? "bg-gray-100"
                    : "text-gray-600"
                }`,
                menu: () => "max-h-60 overflow-y-auto shadow-lg rounded-md mt-1 z-10 bg-white",
                placeholder: () => "hidden",
                
                singleValue: () => "text-gray-800 text-sm",
            }}
            />
      </div>
    </div>


    <div>  
    <label className="block text-lg font-semibold text-gray-700 mt-4">
      Add your pets
    </label>
    <div className="border-2 border-gray-300 rounded-sm p-6 mt-1 max-w-xl">        
      <h2 className="text-sm font-semibold mb-6">How many pets do you have?</h2>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-1">
          <Dog size={24} className="text-gray-800" />
          <span className="text-lg text-gray-800">Dogs</span>
        </div>
        <Counter
          count={dogCount}
          onDecrement={() => setDogCount(dogCount - 1)}
          onIncrement={() => setDogCount(dogCount + 1)}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Cat size={24} className="text-gray-800" />
          <span className="text-lg text-gray-800">Cats</span>
        </div>
        <Counter
          count={catCount}
          onDecrement={() => setCatCount(catCount - 1)}
          onIncrement={() => setCatCount(catCount + 1)}
        />
      </div>
    </div>
    </div>

    <div className="my-5">
    <label className="block text-lg font-semibold text-gray-700 mt-4">
        Message
    </label>
    <label className="block text-sm  text-gray-700 mt-2">
        Tell us more about your pet and why you think {walkerName} would be a great fit
    </label>

    <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full h-25 px-3 py-2 mt-1 border-2 border-gray-300 rounded-sm text-sm text-gray-700 focus:outline-none focus:border-black"
    ></textarea>
    </div>


    <div className="bg-yellow-100 border border-yellow-200 text-sm rounded-md p-3 mt-3">
    Booking and paying on PupperGo is required per PupperGo's{" "}
    <a href="#" className="text-blue-600 underline">
        Terms of Service
    </a>.
    </div>

    <button 
    className="w-full mt-5 py-4 px-8 bg-blue-600 text-white text-base font-semibold rounded-full hover:bg-blue-700 transition"
    onClick={async () => {
                    
                    socket.emit('new-notification-user', {
                        user: walkerName,
                        message: `${user.fullName} has sent you a ${selectedService?.value} request`,
                        date: new Date().toLocaleString(),
                      })
                    try {
                      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/map/send-request`, {
                        params: {
                          user: JSON.stringify({
                            id: user?.id,
                            name: user?.fullName || user?.firstName || "Anonymous",
                            profileImage: user?.imageUrl,
                          }),
                          filters: JSON.stringify({
                            location: filters.location,
                            service: selectedService?.value,
                            startDate: startDate,
                            endDate: endDate,
                            startTime: startTime?.value,
                            endTime:endTime.value,
                            message:message,
                            dogCount:dogCount

                           
                          }),
                          dogwalkerId: walkerId,
                        },
                   
                      });
                      console.log('Request sent successfully:', response.data);
                    } catch (error) {
                      console.error('Error sending request:', error);
                    }
                  }}

    >
    Send request
    </button>

    </div>
  );
}

