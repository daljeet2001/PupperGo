import { useState } from 'react';
import axios from 'axios';
import {EditProfileModal} from './EditProfileModal';
import { Edit } from 'lucide-react';



export const ProfileCard = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: user.fullName || '',
    email: user.primaryEmailAddress?.emailAddress || '',
    phone: '',
    description:'',
    hourlyRate: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle form submission logic
    console.log('Updated Profile:', formData);
    setIsOpen(false);
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
      {/* Profile Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm w-[280px] text-center">
        <img
          className="w-20 h-20 mx-auto rounded-full object-cover"
          src={user.imageUrl}
          alt="Profile"
        />
        <h2 className="mt-4 text-lg font-semibold">{user.username}</h2>
        <p className="text-sm text-gray-400">Geek at Kickflow</p>

        <button
          onClick={() => setIsOpen(true)}
          className="mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 hover:underline"
        >
          Edit Profile
        </button>
      </div>

      {/* Modal Overlay */}
      <EditProfileModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        user={user}/>
       


    </>
  );
};
