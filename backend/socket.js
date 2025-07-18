import { Server as SocketIo } from 'socket.io';
import dogwalkerModel from './models/dogwalker.model.js';
import User from './models/user.model.js';

let io;
const userSockets = new Map(); 


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
    const { clerkId, userType } = data;

    try {
        if (userType === 'user') {
        await User.findOneAndUpdate(
            { clerkId },
            { socketId: socket.id },
            { new: true }
        );
        } else if (userType === 'dogwalker') {
        await dogwalkerModel.findOneAndUpdate(
            { clerkId },
            { socketId: socket.id },
            { new: true }
        );
        }
    } catch (error) {
        console.error('Error setting socket ID:', error);
        socket.emit('error', { message: 'Failed to join socket room' });
    }
    });

    socket.on('register-user', ({ clerkId }) => {
    userSockets.set(clerkId, socket.id);
    console.log(` Registered ${clerkId} to socket ${socket.id}`);
  });


        socket.on('update-location-dogwalker', async (data) => {
            const { clerkId, location } = data;

            if (!location || !location.ltd || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

       await dogwalkerModel.findOneAndUpdate(
            { clerkId }, // filter by clerkId
            {
                $set: {
                location: {
                    ltd: location.ltd,
                    lng: location.lng,
                }
                }
            },
            { new: true }
            );

        });

          socket.on('update-location-user', async (data) => {
            const { clerkId, location } = data;

            if (!location || !location.ltd || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

       await User.findOneAndUpdate(
            { clerkId }, // filter by clerkId
            {
                $set: {
                location: {
                    ltd: location.ltd,
                    lng: location.lng,
                }
                }
            },
            { new: true }
            );
        });

        socket.on('new-notification-user', async (data) => {
            const { user, message, date } = data;
            // console.log('Notification data:', data);

            if (!message || !user) {
                return socket.emit('error', { message: 'Invalid notification data' });
            }

            try {
                // Update the user with the new notification
                const updatedDogwalker = await dogwalkerModel.findOneAndUpdate(
                    { username: user }, // Match user by name
                    { $push: { notifications: { message, date } } }, // Push the notification to the user's notifications array
                    { new: true } // Return the updated document
                );

                if (!updatedDogwalker) {
                    console.error('Dogwalker not found');
                    return socket.emit('error', { message: 'Dogwalker not found' });
                }
                // console.log('Dogwalker user:', updatedDogwalker);

                // console.log('Notification added successfully to dogwalker:', updatedDogwalker.notifications);
            } catch (error) {
                console.error('Error updating user notifications:', error);
            }
        });

        // socket.onAny((event, ...args) => {
        // console.log(`Received event: ${event}`, args);
        // });


    

        socket.on('new-notification-dogwalker', async (data) => {
            const { userId, message, date } = data;
            console.log('Notification data:', data);

            if (!message || !userId) {
                return socket.emit('error', { message: 'Invalid notification data' });
            }

            try {
                // Update the user with the new notification
                const updatedUser = await User.findOneAndUpdate(
                    { clerkId: userId },
                    { $push: { notifications: { message, date } } },
                    { new: true } 
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

        socket.on('booking-request-started', async (data) => {
            const { user, message, date,dogwalkerId,userClerkId } = data;
            // console.log('Notification data:', data);

            if (!message || !user) {
                return socket.emit('error', { message: 'Invalid notification data' });
            }



            try {
                // Update the user with the new notification
                const updatedUser = await User.findOneAndUpdate(
                    { clerkId: userClerkId }, 
                    { $push: { notifications: { message, date,dogwalkerId } } },
                    { new: true } 
                );

                if (!updatedUser) {
                    console.error('User not found');
                    return socket.emit('error', { message: 'User not found' });
                }

                const targetSocketId = userSockets.get(userClerkId); 

                if (targetSocketId) {
                    io.to(targetSocketId).emit('upcoming-dogwalker', { dogwalkerId });
                    console.log(`🚀 Sent upcoming-dogwalker to ${user} at ${targetSocketId}`);
                } else {
                    console.log(`⚠️ No active socket for user ${user}`);
                }
               

             

                // console.log('Notification added successfully to user:', updatedUser.notifications);
            } catch (error) {
                console.error('Error updating user notifications:', error);
            }
        });

        socket.on('booking-request-completed', async (data) => {
            const { user, message, date,dogwalkerId,userClerkId } = data;
            // console.log('Notification data:', data);

            if (!message || !user) {
                return socket.emit('error', { message: 'Invalid notification data' });
            }



            try {
                // Update the user with the new notification
                const updatedUser = await User.findOneAndUpdate(
                    { clerkId: userClerkId }, 
                    { $push: { notifications: { message, date,dogwalkerId } } },
                    { new: true } 
                );

                if (!updatedUser) {
                    console.error('User not found');
                    return socket.emit('error', { message: 'User not found' });
                }

                const targetSocketId = userSockets.get(userClerkId); 

                if (targetSocketId) {
                    io.to(targetSocketId).emit('upcoming-dogwalker', { dogwalkerId });
                    console.log(`🚀 Sent upcoming-dogwalker to ${user} at ${targetSocketId}`);
                } else {
                    console.log(`⚠️ No active socket for user ${user}`);
                }
               

             

                // console.log('Notification added successfully to user:', updatedUser.notifications);
            } catch (error) {
                console.error('Error updating user notifications:', error);
            }
        });

        socket.on('booking-request-cancelled', async (data) => {
            const { user, message, date } = data;
            // console.log('Notification data:', data);

            if (!message || !user) {
                return socket.emit('error', { message: 'Invalid notification data' });
            }

            try {
                // Update the user with the new notification
                const updatedUser = await User.findOneAndUpdate(
                    { username: user }, // Match user by name
                    { $push: { notifications: { message, date } } }, // Push the notification to the user's notifications array
                    { new: true } // Return the updated document
                );

                if (!updatedUser) {
                    console.error('User not found');
                    return socket.emit('error', { message: 'User not found' });
                }
                // console.log('Updated user:', updatedUser);

                // console.log('Notification added successfully to user:', updatedUser.notifications);
            } catch (error) {
                console.error('Error updating user notifications:', error);
            }
        });



        socket.on('disconnect', () => {
        for (const [clerkId, id] of userSockets.entries()) {
        if (id === socket.id) {
        userSockets.delete(clerkId);
        console.log(`❌ Disconnected ${clerkId}`);
        break;
      }
    }
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