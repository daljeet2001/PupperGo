import userModel from '../models/user.model.js';

export const createUser = async ({
    username, email, password, dog, file
}) => {
    if (!username || !email || !password || !file || !dog) {
        throw new Error('Username, email, password, profileImage and dog are required');
    }

    const profileImage = file.path; // Use the uploaded image URL
    const hashedPassword = await userModel.hashPassword(password);

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword,
        profileImage,
        dog
    });
    console.log(user);

    const loguserid = user._id;

    return user;
};





