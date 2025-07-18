import React from 'react';

const EarnMoreCard = () => {
  const profileLink = 'https://profilelink';
  const promoCode = 'AMEIAM84352';

  return (
    <div className="bg-[#f8f9fa] rounded-lg shadow-sm p-6 w-full mx-auto border border-gray-200 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Earn More, Play More</h2>
      <p className="text-gray-700 mb-5">
        Attract new clients and their dogs by sharing your PupperGo profile link and promo code.
        Your promo code gives pet owners new to PupperGo $20 off their first booking—while you’ll still earn your full rate.
      </p>

      <div className="mb-4">
        <p className="font-semibold text-gray-900">Your Profile Link:</p>
        <a
          href={profileLink}
          className="text-blue-600 underline break-all"
          target="_blank"
          rel="noopener noreferrer"
        >
          {profileLink}
        </a>
      </div>

      <div className="mb-6">
        <p className="font-semibold text-gray-900">Your Promo Code:</p>
        <p className="text-gray-800">{promoCode}</p>
      </div>

      <button className="px-5 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-900 hover:bg-gray-100 transition">
        Share Your Profile
      </button>

      <p className="text-xs text-gray-500 mt-6">
        Your promo code is only for new PupperGo members you recruit through your profile link. Rules and restrictions apply—read our{' '}
        <a href="#" className="text-blue-600 underline">
          Terms of Service
        </a>{' '}
        to learn more.
      </p>
    </div>
  );
};

export default EarnMoreCard;
