import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";


// export const authUser = async (req, res, next) => {
//     try {
//         const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];

//         if (!token) {
//             return res.status(401).send({ error: 'Unauthorized User' });
//         }

//         const isBlackListed = await redisClient.get(token);

//         if (isBlackListed) {

//             res.cookie('token', '');

//             return res.status(401).send({ error: 'Unauthorized User' });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (error) {

//         console.log(error);

//         res.status(401).send({ error: 'Unauthorized User' });
//     }
// }

export const authDogwalker = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];


    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const isBlackListed = await redisClient.get(token);
    if (isBlackListed) {
        res.cookie('token', '');
        return res.status(401).json({ message: 'Unauthorized' });
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // const dogwalker = await captainModel.findById(decoded._id)
        req.dogwalker = decoded;
        return next()
    } catch (err) {
        console.log(err);
        res.status(401).json({ message: 'Unauthorized' });
    }
}