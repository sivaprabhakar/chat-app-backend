import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const databaseConnection = async () => {
    try {
       

        await mongoose.connect(`${process.env.db_Url}`)

        console.log('Connected to MongoDB');
        
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

    } catch (error) {
        console.error('Initial connection error:', error);
    }
};

export default databaseConnection;
