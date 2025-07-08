import { Server as SocketIo } from 'socket.io';
import dogwalkerModel from './models/dogwalker.model.js';
import userModel from './models/user.model.js';

let io;

function initializeSocket(server) {
    io = new SocketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join', async (data) => {
            const { userId, userType } = data;

            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'dogwalker') {
                await dogwalkerModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });

        socket.on('update-location-dogwalker', async (data) => {
            const { userId, location } = data;

            if (!location || !location.ltd || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            await dogwalkerModel.findByIdAndUpdate(userId, {
                location: {
                    ltd: location.ltd,
                    lng: location.lng
                }
            });
        });

        socket.on('new-notification-user', async (data) => {
            const { user, message, date } = data;
            console.log('Notification data:', data);

            if (!message || !user) {
                return socket.emit('error', { message: 'Invalid notification data' });
            }

            try {
                // Update the user with the new notification
                const updatedDogwalker = await dogwalkerModel.findOneAndUpdate(
                    { name: user }, // Match user by name
                    { $push: { notifications: { message, date } } }, // Push the notification to the user's notifications array
                    { new: true } // Return the updated document
                );

                if (!updatedDogwalker) {
                    console.error('Dogwalker not found');
                    return socket.emit('error', { message: 'Dogwalker not found' });
                }
                // console.log('Dogwalker user:', updatedDogwalker);

                console.log('Notification added successfully to dogwalker:', updatedDogwalker.notifications);
            } catch (error) {
                console.error('Error updating user notifications:', error);
            }
        });

    

        socket.on('new-notification-dogwalker', async (data) => {
            const { user, message, date } = data;
            console.log('Notification data:', data);

            if (!message || !user) {
                return socket.emit('error', { message: 'Invalid notification data' });
            }

            try {
                // Update the user with the new notification
                const updatedUser = await userModel.findOneAndUpdate(
                    { username: user }, // Match user by name
                    { $push: { notifications: { message, date } } }, // Push the notification to the user's notifications array
                    { new: true } // Return the updated document
                );

                if (!updatedUser) {
                    console.error('User not found');
                    return socket.emit('error', { message: 'User not found' });
                }
                console.log('Updated user:', updatedUser);

                console.log('Notification added successfully to user:', updatedUser.notifications);
            } catch (error) {
                console.error('Error updating user notifications:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {
    console.log(messageObject);

    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
};

export { initializeSocket, io, sendMessageToSocketId };