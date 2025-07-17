import React from 'react';
import { PawPrint } from 'lucide-react';

const NewMessageCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 w-full ">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">New Messages</h3>
      <div className="border-t-4 border-emerald-600 w-14 mb-4"></div>

      <div className="flex items-center gap-3 mb-3">
        <div className="bg-gray-100 rounded-full p-2">
          <PawPrint className="w-6 h-6 text-gray-400" />
        </div>
        <div>
          <a href="#" className="text-blue-600 font-medium hover:underline">
            Message from Brenda S.
          </a>
          <p className="text-sm text-gray-600">Jul 9, 2024</p>
        </div>
      </div>

      <a href="/inbox" className="text-blue-600 text-sm hover:underline">
        View all messages
      </a>
    </div>
  );
};

export default NewMessageCard;
