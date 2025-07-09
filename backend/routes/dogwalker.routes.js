import * as dogwalkerController from '../controllers/dogwalker.controller.js';
import { Router } from 'express';
import { body } from 'express-validator';
import * as authMiddleware from '../middleware/auth.middleware.js';
import dogwalkerModel from '../models/dogwalker.model.js';
import upload from '../utils/cloudinaryStorage.js'; // Import multer upload middleware

const router = Router();

// router.post('/register', 
//     upload.single('image'), // Handle image upload
//     [
//         body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
//         body('email').isEmail().withMessage('Invalid Email'),
//         body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
//         body('phone').isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits long'),
//         body('description').isLength({ max: 200 }).withMessage('Description must not be longer than 200 characters'),
//         body('hourlyRate').isNumeric().withMessage('Hourly rate must be a number'),
//     ],
//     dogwalkerController.registerDogwalker
// );

// router.post('/login', [
//     body('email').isEmail().withMessage('Invalid Email'),
//     body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
// ],
//     dogwalkerController.loginDogwalker
// );

// router.get('/profile', dogwalkerController.getDogwalkerProfile);

// router.get('/logout', authMiddleware.authDogwalker, dogwalkerController.logoutDogwalker);

router.post('/filter', [
    body('NearbyWalkers').isArray().withMessage('NearbyWalkers must be an array'),
    body('dates').isArray().withMessage('Dates must be an array of strings'),
    body('hourlyRatelow').optional().isNumeric().withMessage('Hourly rate must be a number'),
    body('hourlyRatehigh').optional().isNumeric().withMessage('Hourly rate must be a number'),
], dogwalkerController.filterDogwalkers);

router.post('/availability', [
    body('dates').isArray().withMessage('Dates must be an array of strings'),
    body('clerkId').isString().withMessage('clerkId ID must be a string'),
], dogwalkerController.setAvailability);

router.get('/upcoming-bookings',  async (req, res) => {
    try {
        const { clerkId } = req.query;
        // console.log('Fetching upcoming bookings for clerkId:', clerkId);

        if (!clerkId) {
            return res.status(400).json({ message: 'clerkId is required' });
        }
        const dogwalker = await dogwalkerModel.findOne({ clerkId }); 
        if (!dogwalker) {
            return res.status(404).json({ message: 'Dogwalker not found' });
        }
        const walker = await dogwalkerModel.findOne({ email: dogwalker.email });
        // console.log(walker)

        res.status(200).json(walker.upcomingBookings);
    } catch (error) {
        console.error('Error fetching upcoming bookings:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/update-booking-status', async (req, res) => {
    try {
        const { bookingId, status ,clerkId} = req.body;

        const dogwalker = await dogwalkerModel.findOne({ clerkId });
        if (!dogwalker) {
            return res.status(404).json({ message: 'Dogwalker not found' });
        }
        const walker = await dogwalkerModel.findOneAndUpdate(
            { email: dogwalker.email, "upcomingBookings._id": bookingId },
            { $set: { "upcomingBookings.$.status": status } },
            { new: true }
        );

        if (!walker) {
            return res.status(404).json({ message: 'Booking or Dogwalker not found' });
        }

        const booking = walker.upcomingBookings.find((b) => b._id.toString() === bookingId);

        res.status(200).json({ message: 'Booking status updated successfully', booking });
    } catch (error) {
        // console.error('Error updating booking status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/notifications', async (req, res) => {
    try {
        const { clerkId } = req.query;

        if (!clerkId) {
            return res.status(400).json({ message: 'clerkId is required' });
        }

        const dogwalker = await dogwalkerModel.findOne({ clerkId });
        if (!dogwalker) {
            return res.status(404).json({ message: 'dogwalker not found' });
        }
        // console.log(dogwalker.notifications);

        res.status(200).json(dogwalker.notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/all', async (req, res) => {
    try {
        const dogwalkers = await dogwalkerModel.find({});
        res.status(200).json(dogwalkers);
    } catch (error) {
        console.error('Error fetching all dogwalkers:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post("/sync", async (req, res) => {
  const { clerkId, username, email, profileImage } = req.body;

  if (!clerkId || !username || !email || !profileImage) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingDogwalker = await dogwalkerModel.findOne({ clerkId });
    // console.log("Existing dogwalker:", existingDogwalker);

    if (!existingDogwalker) {
      await dogwalkerModel.create({
        clerkId,
        username,
        email,
        profileImage,

});

    }

    return res.status(200).json({ message: "User synced" });
  } catch (error) {
  console.error("Error syncing user:", error);
  return res.status(500).json({
    error: error.message || "Unknown server error",
    message: "Failed to sync user"
  });
}

});

export default router;