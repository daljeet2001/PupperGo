import {Router} from 'express';
import { query} from 'express-validator';
import * as authMiddleware from '../middleware/auth.middleware.js';
import *as mapController from '../controllers/map.controller.js';
import { Socket } from 'socket.io';
import { io } from '../socket.js'; // Import the io instance
import dogwalkerModel from '../models/dogwalker.model.js';

const router = Router();
router.get('/get-coordinates',
    query('address').isString().isLength({ min: 3 }),
   
   mapController.getCoordinates
);

router.get('/get-distance-time',
    query('origin').isString().isLength({ min: 3 }),
    query('destination').isString().isLength({ min: 3 }),

    mapController.getDistanceTime
)

router.get('/get-suggestions',
    query('input').isString().isLength({ min: 3 }),

    mapController.getAutoCompleteSuggestions
)

router.get('/get-dogwalkers-in-radius',
    query('ltd').isFloat(),
    query('lng').isFloat(),
    query('radius').isFloat(),
 
    mapController.getDogwalkersInRadius
);

router.get('/get-address',
  query('ltd').isFloat().withMessage('Latitude must be a float'),
  query('lng').isFloat().withMessage('Longitude must be a float'),

  mapController.getAddressFromCoordinates
);

router.get('/send-request',
  query('user').isString().withMessage('User must be a string'),
  query('filters').isString().withMessage('Filters must be a string'),
  query('dogwalkerId').isString().withMessage('Dogwalker ID must be a string'),
  
  mapController.sendRequest // Call the controller function
);

export default router;