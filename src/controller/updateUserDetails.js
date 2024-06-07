


import UserModel from "../models/User.js";
import getUserDetailsFromToken from '../helper/getUserToken.js';

const updateUserDetails = async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).send({
                message: 'Authorization header missing',
                logout: true
            });
        }

        const token = authorizationHeader.split(' ')[1];
     

        const user = await getUserDetailsFromToken(token);
      

        if (user.message === 'Session expired') {
            return res.status(401).send({
                message: 'Session expired. Please log in again.',
                logout: true
            });
        }

        const { name, profile_pic } = req.body;
        

        const updateUser = await UserModel.updateOne({ _id: user._id }, {
            name,
            profile_pic
        });
       

        const userInformation = await UserModel.findById(user._id);
        

        return res.send({
            message: "User updated successfully",
            data: userInformation,
            success: true
        });

    } catch (error) {
       
        return res.status(500).send({
            message: error.message || error,
            error: true
        });
    }
}

export default updateUserDetails;


