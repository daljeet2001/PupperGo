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
            Create your profile
            </h3>
            <p className="text-gray-600 text-sm max-w-xs">              
            We guide you through building a profile that showcases information pet owners care about.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex-1 flex flex-col items-center text-center px-4">
            <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-gray-700 font-semibold text-lg shadow mb-4 z-10">
              2
            </div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
           Accept requests
            </h3>
            <p className="text-gray-600 text-sm max-w-xs">
            Tell us the types of pets you want to care for and the dates that work for you. You make your own schedule.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex-1 flex flex-col items-center text-center px-4">
            <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-gray-700 font-semibold text-lg shadow mb-4 z-10">
              3
            </div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
            Get paid
            </h3>
            <p className="text-gray-600 text-sm max-w-xs">   
            Payments are ready for withdrawal two days after you have completed a service.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

