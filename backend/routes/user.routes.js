import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { body } from 'express-validator';
import * as authMiddleware from '../middleware/auth.middleware.js';
import User from '../models/user.model.js';
import upload from '../utils/cloudinaryStorage.js'; // Import the upload middleware

const router = Router();



router.get('/profile',async (req, res) => {

    res.status(200).json({
        user: req.user
    });

});


router.get('/notifications', async (req, res) => {
    try {
        const { clerkId } = req.query;

        if (!clerkId) {
            return res.status(400).json({ message: 'clerkId is required' });
        }
       
        const user= await User.findOne({ clerkId });
        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }
        // console.log(user.notifications);
        res.status(200).json(user.notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.post("/sync", async (req, res) => {
  const { clerkId, username, email, profileImage } = req.body;

  if (!clerkId || !username || !email || !profileImage) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ clerkId });
    // console.log("Existing user:", existingUser);

    if (!existingUser) {
      await User.create({
        clerkId,
        username,
        email,
        profileImage,
        dog: {
          dogname: 'N/A',
          breed: 'Unknown',
          dogSize: 'Medium',
          gender: 'Unknown',
        },
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

router.get('/location/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;

    const user = await User.findOne({ clerkId: clientId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const location = user.location;

    if (!location ) {
      return res.status(400).json({ error: 'Location not set for this user' });
    }

    return res.status(200).json({ location });
  } catch (error) {
    console.error('Error fetching user location:', error);
    res.status(500).json({ error: 'Server error' });
  }
});




export default router;

