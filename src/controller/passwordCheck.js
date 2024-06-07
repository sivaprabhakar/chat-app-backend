import UserModel from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const checkPassword = async (req, res) => {
    try {
        const { userId, password } = req.body;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send({
                message: "User not found",
                error: true
            });
        }
        const verifyPassword = await bcrypt.compare(password, user.password);
        if (!verifyPassword) {
            return res.status(400).send({
                message: "Password is incorrect",
                error: true
            });
        }
        const tokenData = {
            id: user._id,
            email: user.email,
        };

        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
        const cookieOptions = {
            httpOnly: true,
            secure: true,
        };

        return res.cookie("token", token, cookieOptions).status(200).send({
            message: "Login successful",
            token: token,
            success: true
        });
    } catch (error) {
        return res.status(500).send({
            message: error.message || error,
            error: true
        });
    }
}

export default checkPassword;
