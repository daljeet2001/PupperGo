import 'dotenv/config';
import http from 'http';
import app from './app.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import{ initializeSocket} from './socket.js';

const port = process.env.PORT || 3000;

const server = http.createServer(app);
initializeSocket(server);



server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})