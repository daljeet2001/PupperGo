import * as mapService from '../services/maps.service.js';
import { validationResult } from 'express-validator';
import dogwalkerModel from '../models/dogwalker.model.js';
import {v4 as uuidv4} from 'uuid';

export const getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const { address } = req.query;

    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        res.status(404).json({ message: 'Coordinates not found' });
    }
}
export const getDistanceTime = async (req, res, next) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { origin, destination } = req.query;

        const distanceTime = await mapService.getDistanceTime(origin, destination);

        res.status(200).json(distanceTime);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getAutoCompleteSuggestions = async (req, res, next) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { input } = req.query;

        const suggestions = await mapService.getAutoCompleteSuggestions(input);

        res.status(200).json(suggestions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error',error: err.message });
    }
}

export const getDogwalkersInRadius = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { ltd, lng, radius } = req.query;

    try {
        const dogwalkers = await mapService.getDogwalkersInRadius(parseFloat(ltd), parseFloat(lng), parseFloat(radius));
        res.status(200).json(dogwalkers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAddressFromCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { ltd, lng } = req.query;

    try {
        const address = await mapService.getAddressFromCoordinates(parseFloat(ltd), parseFloat(lng));
        res.status(200).json({ address });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const sendRequest = async (req, res) => {
    try {
        const user = JSON.parse(req.query.user);
        const filters = JSON.parse(req.query.filters);
        const clerkId = req.query.dogwalkerId;

        
       

        const booking = {
            _id:uuidv4(),
            service: filters.service,
            startDate: filters.startDate,
            endDate:filters.endDate,
            startTime: filters.startTime,
            endTime:filters.endTime,
            dogCount:filters.dogCount,
            message:filters.message,
            client: user.name,
            status: 'pending',
            clientId: user.id,
        };
        console.log(booking);

        // Find the dogwalker by ID
        const dogwalker = await dogwalkerModel.findOne({clerkId});

        if (!dogwalker) {
            console.error('Dogwalker not found');
            return res.status(404).json({ message: 'Dogwalker not found' });
        }

        // Update the dogwalker's upcoming bookings
        dogwalker.upcomingBookings.push(booking);
        await dogwalker.save();

        console.log('Booking saved successfully');
        res.status(200).json({ message: 'Booking saved successfully' });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ message: 'Error saving booking' });
    }
};