import dogwalkerModel from '../models/dogwalker.model.js';
import *as dogwalkerService from '../services/dogwalker.service.js';
import redisClient from '../services/redis.service.js';
import {validationResult} from 'express-validator';

export const registerDogwalker = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, description, hourlyRate } = req.body;
    const image = req.file?.path; // Get the uploaded image URL from Cloudinary

    if (!image) {
        return res.status(400).json({ message: 'Image upload failed. Please try again.' });
    }

    const isDogwalkerAlreadyExist = await dogwalkerModel.findOne({ email });

    if (isDogwalkerAlreadyExist) {
        return res.status(400).json({ message: 'Dogwalker already exists' });
    }

    const hashedPassword = await dogwalkerModel.hashPassword(password);

    try {
        const dogwalker = await dogwalkerService.createDogwalker({
            name,
            email,
            password: hashedPassword,
            phone,
            description,
            hourlyRate,
            image,
        });
        req.dogwalker = dogwalker;

        const token = dogwalker.generateJWT();

        res.status(201).json({ token, dogwalker });
    } catch (error) {
        console.error('Error creating dogwalker:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const loginDogwalker = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const dogwalker = await dogwalkerModel.findOne({ email }).select('+password');

    if (!dogwalker) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await dogwalker.isValidPassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = dogwalker.generateJWT();

    res.cookie('token', token);
    req.dogwalker = dogwalker;

    res.status(200).json({ token, dogwalker });
}

export const getDogwalkerProfile = async (req, res, next) => {
    res.status(200).json({ dogwalker: req.dogwalker });
}

export const logoutDogwalker = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    redisClient.set(token, 'logout', 'EX', 60 * 60 * 24);

    res.clearCookie('token');

    res.status(200).json({ message: 'Logout successfully' });
}

export const filterDogwalkers = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { NearbyWalkers, dates, hourlyRatelow, hourlyRatehigh } = req.body;
    const query = {
        _id: { $in: NearbyWalkers.map(walker => walker._id) },
    };

    if (hourlyRatelow || hourlyRatehigh) {
        query.hourlyRate = {};
        if (hourlyRatelow) query.hourlyRate.$gte = Number(hourlyRatelow);
        if (hourlyRatehigh) query.hourlyRate.$lte = Number(hourlyRatehigh);
    }

    if (dates && dates.length > 0) {
        query.availability = {
            // $all: dates.map(date => new Date(date)),
             $in: dates 
        };
    }
    // console.log("query", query);

    try {
        const dogwalkers = await dogwalkerModel.find(query);
        res.status(200).json(dogwalkers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const setAvailability = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { dates,dogwalkerId } = req.body;
    

    try {
        const dogwalker = await dogwalkerModel.findByIdAndUpdate(
            dogwalkerId,
            { availability: dates },
            { new: true }
        );

        if (!dogwalker) {
            return res.status(404).json({ message: 'Dogwalker not found' });
        }

        res.status(200).json({ message: 'Availability updated successfully', dogwalker });
    } catch (error) {
        console.error('Error updating availability:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

