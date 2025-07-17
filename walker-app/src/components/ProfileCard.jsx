import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const getInitials = (name) => name?.charAt(0).toUpperCase() || '';

export const ProfileCard = ({ user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: user.fullName || '',
    email: user.primaryEmailAddress?.emailAddress || '',
    phone: '',
    description: '',
    hourlyRate: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/dogwalker/update-profile`,
        {
          clerkId: user.id,
          ...formData,
        }
      );
      console.log('Update success:', res.data);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to update profile:', error.response?.data || error.message);
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-sm shadow-sm text-center flex items-center gap-4">
   
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600 shrink-0">
          {getInitials(formData.username)}
        </div>

      
        <div className="flex flex-col items-start justify-center text-left">
          <h2 className="text-lg font-semibold text-gray-900">{user.fullName}</h2>
          <button
        onClick={() => navigate('/edit')}

            className="mt-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:underline inline-flex items-center gap-1"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </>
  );
};





 

         