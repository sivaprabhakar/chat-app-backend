
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

const getUserDetailsFromToken = async (token) => {
    if (!token) {
        return { message: 'Token not found', logout: true };
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.id).select('-password');
        if (!user) {
            return { message: 'User not found', logout: true };
        }
        return user;
    } catch (err) {
        return { message: 'Session expired', logout: true };
    }
}

export default getUserDetailsFromToken;
