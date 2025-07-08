import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const DogWalkerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: true,
        select: false, // Don't return password in queries
    },
    phone: {
        type: String,
        required: true,
    },
 
    availability: {
        type: [String], // e.g., ['Monday', 'Wednesday', 'Friday']
       
    },
    socketId: {
        type: String,
    },

    image: {
        type: String, // URL or path to the image
        required: true,
    },
    description: {
        type: String,
        required: true,
        maxLength: [200, 'Description must not be longer than 200 characters'],
    },
    location: {
        ltd: {
            type: Number,
        },
        lng: {
            type: Number,
        }
      
    },
    hourlyRate: {
        type: Number, // rate in currency per hour
        required: true,
    },
    upcomingBookings: [
        {
            _id: String,
            date: String,
            time: String,
            service: String,
            client: String,
            status: String,
            expireAt: { type: Date, default: () => Date.now() + 3 * 24 * 60 * 60 * 1000 }, // 3 days from creation
        }
    ],
    notifications: [
        {
            message: String,
            date: { type: String},
            expireAt: { type: Date, default: () => Date.now() + 3 * 24 * 60 * 60 * 1000 }, // 3 days from creation
        }
    ],
});

// Ensure TTL index is created for notifications
DogWalkerSchema.index({ "notifications.expireAt": 1 }, { expireAfterSeconds: 0 });

// Ensure TTL index is created for upcomingBookings
DogWalkerSchema.index({ "upcomingBookings.expireAt": 1 }, { expireAfterSeconds: 0 });

DogWalkerSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

DogWalkerSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

DogWalkerSchema.methods.generateJWT = function () {
    return jwt.sign(
        { email: this.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
}


const Dogwalker = mongoose.model('dogwalker', DogWalkerSchema);

export default Dogwalker;
