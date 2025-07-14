import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Paige E",
    review:
      "Morgan was amazing with my two beagles and cat! They absolutely adored her. When I got home, they were calm, happy, and clearly well cared for...",
  },
  {
    name: "Isabelle M",
    review:
      "Can't begin to say how appreciative we are of the care Bo received from Molly at her home while we were away for several days...",
  },
  {
    name: "Alexandra S",
    review:
      "Thanks so much, Jack! Looks like you both had fun (I love the pic!), and my mom said she was so excited to meet you...",
  },
  {
    name: "Samantha Q",
    review:
      "Nina has been excellent. We were in town to work for 10 days and used Nina 9/10 days. She is awesome with our older dog Cricket...",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">
          Millions of 5-star services and counting
        </h2>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-2xl p-6 text-sm text-gray-700"
          >

            <div className="flex mb-3">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                ))}
            </div>
            <p className="mb-4 leading-relaxed">{testimonial.review}</p>
            <p className="font-semibold">{testimonial.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
