import { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Building, Plus, Minus, ChevronDown } from "lucide-react";




export const EditProfileModal = ({user}) => {
  const navigate = useNavigate();
  const [dogwalker,setDogwalker]=useState();
  const [formData, setFormData] = useState({
    username: user.fullName || '',
    email: user.primaryEmailAddress?.emailAddress || '',
    phone: user.phone || '',
    description: user.description || '',
    hourlyRate: user.hourlyRate || '',
  });

  const [errors, setErrors] = useState({});


  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be exactly 10 digits.';
    }

    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters.';
    }

    if (!formData.hourlyRate || parseFloat(formData.hourlyRate) < 50) {
      newErrors.hourlyRate = 'Hourly rate must be at least ₹50.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
 
      await axios.post(`${import.meta.env.VITE_BASE_URL}/dogwalker/update-profile`, {
        clerkId: user.id,
        ...formData,
      });
      navigate('/demo')
     
  
    } catch (error) {
      console.error('Failed to update profile:', error.response?.data || error.message);
      
    }
  };

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/dogwalker/profile/${user.id}`);
      console.log(res.data); 
      setDogwalker(res.data)
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  if (user?.id) fetchProfile();
}, []);
useEffect(() => {
  if (dogwalker) {
    setFormData((prev) => ({
      ...prev,
      phone: dogwalker.phone || '',
      description: dogwalker.description || '',
      hourlyRate: dogwalker.hourlyRate || '',
    }));
  }
}, [dogwalker]);


  return (
    <div className="flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl  p-8">
       <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Complete Your Profile

</h1>

<form onSubmit={handleSubmit2} className="space-y-6 mt-2 max-w-xl w-full">


  <div className="flex gap-4 mt-4">

    <div className="flex flex-col w-1/2">
      <label className="block text-sm font-medium text-gray-800 mb-1">Username</label>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        className=" h-[42px] w-full px-3 py-2 bg-gray-100 shadow-inner rounded-md text-sm text-gray-700 focus:outline-none focus:border-black"
      />
    </div>

  
    <div className="flex flex-col w-1/2">
      <label className="block text-sm font-medium text-gray-800 mb-1">Email</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className=" h-[42px] w-full px-3 py-2 bg-gray-100 shadow-inner rounded-md text-sm text-gray-700 focus:outline-none focus:border-black"
      />
    </div>
  </div>


  <div className="flex gap-4 mt-2">
  
    <div className="flex flex-col w-1/2">
      <label className="block text-sm font-medium text-gray-800 mb-1">Phone Number</label>
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        className=" h-[42px] w-full px-3 py-2 bg-gray-100 shadow-inner rounded-md text-sm text-gray-700 focus:outline-none focus:border-black"
      />
      {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
    </div>

   
<div className="flex flex-col w-1/2">
  <label className="block text-sm font-medium text-gray-800 mb-1">Hourly ₹</label>

  <div className="flex items-center justify-center gap-2 px-3 rounded-md text-sm font-medium text-gray-800 bg-gray-100 shadow-inner h-[42px]">
  <button
    type="button"
    onClick={() =>
      setFormData((prev) => ({
        ...prev,
        hourlyRate: Math.max(50, parseFloat(prev.hourlyRate || 0) - 50),
      }))
    }
    className="text-gray-500 hover:text-[#14BA6C]"
  >
    <Minus className="w-3 h-3" />
  </button>

  <div className="flex items-center">
    <span className="text-lg font-semibold mr-1">₹</span>
    <input
      type="number"
      step="1"
      min="50"
      name="hourlyRate"
      value={formData.hourlyRate}
      onChange={handleChange}
      className="bg-transparent text-center text-lg font-semibold w-16 outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
  </div>

  <button
    type="button"
    onClick={() =>
      setFormData((prev) => ({
        ...prev,
        hourlyRate: parseFloat(prev.hourlyRate || 0) + 50,
      }))
    }
    className="text-gray-500 hover:text-[#14BA6C]"
  >
    <Plus className="w-3 h-3" />
  </button>
</div>



  {errors.hourlyRate && (
    <p className="text-sm text-red-500 mt-1">{errors.hourlyRate}</p>
  )}
</div>

  </div>


  <div className="flex flex-col w-full mt-2">
    <label className="block text-sm font-medium text-gray-800 mb-1">Description</label>
    <textarea
      name="description"
      value={formData.description}
      onChange={handleChange}
      rows={4}
      className="w-full px-3 py-2 bg-gray-100 shadow-inner rounded-md text-sm text-gray-700 focus:outline-none focus:border-black"
    />
    {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
  </div>

  <div className="bg-yellow-100 border border-yellow-200 text-sm rounded-md p-3 mt-3">
  Updating your profile means you agree to PupperGo's{" "}
  <a href="#" className="text-blue-600 underline">
    Terms of Service
  </a>.
  </div>



  <div className="flex justify-end gap-3 pt-4">
    <button
      type="button"
      onClick={() => navigate('/demo')}
      className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-full hover:bg-gray-100 transition"
    >
      Cancel
    </button>
    <button
      type="submit"
      className="px-5 py-2 bg-blue-600 text-white text-base font-semibold rounded-full hover:bg-blue-700 transition"
    >
      Save
    </button>
  </div>
</form>


      </div>
    </div>
  );
};
