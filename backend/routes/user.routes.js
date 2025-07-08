import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { body } from 'express-validator';
import * as authMiddleware from '../middleware/auth.middleware.js';
import User from '../models/user.model.js';
import upload from '../utils/cloudinaryStorage.js'; // Import the upload middleware

const router = Router();

// router.post(
//     '/register',
//     upload.single('profileImage'), // Handle image upload
//     (req, res, next) => {
//         if (req.body.dog) {
//             try {
//                 req.body.dog = JSON.parse(req.body.dog); // Parse the dog field
//             } catch (error) {
//                 return res.status(400).json({ errors: [{ msg: 'Invalid dog object format' }] });
//             }
//         }
//         next();
//     },
//     body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
//     body('email').isEmail().withMessage('Email must be a valid email address'),
//     body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
//     body('dog').isObject().withMessage('Dog must be an object'),
//     userController.createUserController
// );

// router.post('/login',
//     body('email').isEmail().withMessage('Email must be a valid email address'),
//     body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
//     userController.loginController);

router.get('/profile', userController.profileController);

// router.get('/logout', authMiddleware.authUser, userController.logoutController);


router.get('/notifications', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
       
        const user= await userModel.findOne({ _id: userId });
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
    console.log("Existing user:", existingUser);

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






export default router;

