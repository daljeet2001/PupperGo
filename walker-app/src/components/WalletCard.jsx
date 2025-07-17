import React from "react";

const WalletCard = () => {
  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
      {/* Wallet Balance */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-gray-900">WALLET</h3>
          <a href="#" className="text-blue-600 text-sm underline">
            Apply Promo Code
          </a>
        </div>
        <div className="text-lg font-semibold text-gray-900">₹0.00</div>
      </div>

      {/* Upcoming Earnings */}
      <div className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded">
        <div className="text-sm font-semibold text-gray-700">UPCOMING EARNINGS</div>
        <div className="text-sm font-semibold text-gray-900">₹0.00</div>
      </div>

      {/* Processing Payments */}
      <div className="flex justify-between items-center bg-orange-50 px-4 py-2 rounded">
        <div className="text-sm font-semibold text-gray-700">PROCESSING PAYMENTS</div>
        <div className="text-sm font-semibold text-gray-900">₹0.00</div>
      </div>

      {/* Info Text */}
      <p className="text-xs text-gray-500">
        Funds from past bookings begin processing 48 hours after they end.
      </p>

      {/* Buttons */}
      <div className="space-y-3">
        <button className="w-full border rounded-full py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 transition">
          Manage Payout Methods
        </button>
        <button className="w-full border rounded-full py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 transition">
          Add or Modify a Payment Method
        </button>
        <button className="w-full border rounded-full py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 transition">
          View Payments & Promo Codes
        </button>
      </div>
    </div>
  );
};

export default WalletCard;
