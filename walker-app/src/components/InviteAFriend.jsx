import React from 'react';

const InviteAFriend = () => {
  return (
    <div className="bg-[#f8f9fa] rounded-lg shadow-sm p-6 w-full  mx-auto border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Refer a sitter, get ₹200
      </h2>
      <p className="text-gray-700 mb-6">
        Earn a ₹200 Visa or Mastercard prepaid card
        <sup className="text-xs text-gray-500">*</sup> for every friend who becomes a sitter and completes a stay in their first 90 days.
      </p>

      <button className="px-5 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-900 hover:bg-gray-100 transition">
        Invite a Friend
      </button>

      <p className="text-xs text-gray-500 mt-6">
        * Referred friend must have created their PupperGo account through your referral link.
      </p>
    </div>
  );
};

export default InviteAFriend;
