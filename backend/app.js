import express from 'express';
import connectToDb from './db/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import dogwalkerRoutes from './routes/dogwalker.routes.js';
import mapRoutes from './routes/maps.routes.js';
connectToDb();


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use("/user", userRoutes);
app.use("/dogwalker", dogwalkerRoutes);
app.use("/map", mapRoutes);

app.get('/', (req, res) => {
    res.send('Hello PawPals!');
});

export default app;   
                                                                                                                                                                                                                                                       