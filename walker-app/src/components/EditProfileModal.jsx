import { useState } from 'react';
import { BadgeCheck, BadgeX, Send } from 'lucide-react';
import axios from 'axios';

export const EditProfileModal = ({ user, isOpen, setIsOpen }) => {
  const [formData, setFormData] = useState({
    username: user.fullName || '',
    email: user.primaryEmailAddress?.emailAddress || '',
    phone: user.phone || '',
    description: user.description || '',
    hourlyRate: user.hourlyRate || '',
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'success' | 'error'

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
      setStatus('idle');
      await axios.post(`${import.meta.env.VITE_BASE_URL}/dogwalker/update-profile`, {
        clerkId: user.id,
        ...formData,
      });
      setStatus('success');
      setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
      }, 1200);
    } catch (error) {
      console.error('Failed to update profile:', error.response?.data || error.message);
      setStatus('error');
    }
  };

  const getButtonStyle = () => {
    if (status === 'success') return 'bg-green-600 hover:bg-green-700';
    if (status === 'error') return 'bg-red-600 hover:bg-red-700';
    return 'bg-black hover:bg-gray-900';
  };

  const getButtonIcon = () => {
    if (status === 'success') return <BadgeCheck className="w-4 h-4" />;
    if (status === 'error') return <BadgeX className="w-4 h-4" />;
    return ;
  };

  const getButtonText = () => {
    if (status === 'success') return 'Profile Updated';
    if (status === 'error') return 'Failed';
    return 'Save Changes';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
      <div className="bg-white p-6 rounded-3xl shadow-xl w-[90%] max-w-md space-y-6">
        <h2 className="text-xl font-semibold text-[#1E1E1F] text-center">Edit Profile</h2>

        <form onSubmit={handleSubmit2} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
            />
            {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
              rows={3}
            />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
          </div>

          {/* Hourly Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (₹)</label>
            <input
              type="number"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
            />
            {errors.hourlyRate && <p className="text-sm text-red-500 mt-1">{errors.hourlyRate}</p>}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setStatus('idle');
              }}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-full hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex items-center gap-2 px-4 py-2 text-sm text-white rounded-full font-medium transition ${getButtonStyle()}`}
            >
              {getButtonIcon()}
              {getButtonText()}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

