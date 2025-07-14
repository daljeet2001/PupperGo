import React from "react";

export default function HowItWorksTimeline() {
  return (
    <section className="bg-gray-100 py-16 px-4 font-[Open_Sans] ">
      <div className="max-w-6xl mx-auto text-center relative">
        <h2 className="text-3xl font-bold text-gray-800 mb-16">How it works</h2>

        {/* Line behind steps */}
        <div className="absolute top-[123px] left-[168px] right-[168px] h-[2px] bg-gray-300 z-0 hidden md:block" />

        <div className="flex flex-col md:flex-row justify-between items-center relative z-10 gap-y-12">
          {/* Step 1 */}
          <div className="flex-1 flex flex-col items-center text-center px-4">
            <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-gray-700 font-semibold text-lg shadow mb-4 z-10">
              1
            </div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
            Search
            </h3>
            <p className="text-gray-600 text-sm max-w-xs">              
            Read verified reviews by pet parents like you and choose a screened sitter who's a great match for you and your pets.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex-1 flex flex-col items-center text-center px-4">
            <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-gray-700 font-semibold text-lg shadow mb-4 z-10">
              2
            </div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
            Book & pay
            </h3>
            <p className="text-gray-600 text-sm max-w-xs">
            No cash or checks needed-we make it simple to book and make secured payments through our website or app coming soon.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex-1 flex flex-col items-center text-center px-4">
            <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-gray-700 font-semibold text-lg shadow mb-4 z-10">
              3
            </div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
            Relax
            </h3>
            <p className="text-gray-600 text-sm max-w-xs">   
            Stay in touch with Livetracking. Plus, your booking is backed by PupperProtect, including 24/7 support and reimbursement for eligible vet care.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

