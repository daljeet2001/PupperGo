import { useState } from "react";
import { Star } from "lucide-react";
import axios from "axios";

const ReviewForm = ({ walkerId,user,userId}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;

    try {
      setSubmitting(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/dogwalker/reviews`,
         { walkerId, user, rating,comment,userId },
        );
        console.log('Booking status updated:', response.data);
     
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 rounded-xl text-gray-500 text-xs shadow-inner w-full max-w-md space-y-4"
    >
      <h2 className="text-base font-medium text-black">Your Feedback Matters</h2>  
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={24}
            onClick={() => setRating(star)}
            className={`cursor-pointer transition-all duration-200 ease-in-out transform ${
                rating >= star
                ? "text-yellow-400 fill-yellow-400 scale-110"
                : "text-gray-400 scale-100"
            } hover:scale-125 hover:text-yellow-300`}
            />

        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a review"
        className="w-full shadow-inner   rounded-xl  p-2 text-sm focus:outline-none focus:ring-0 focus:border-transparent"
        rows={3}
      />

      <button
        type="submit"
        className="w-full  text-black  py-2 text-sm font-medium hover:opacity-90  hover:cursor-pointer transition"
      >
       Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
