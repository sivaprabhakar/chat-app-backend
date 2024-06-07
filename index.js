import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import databaseConnection from './src/config/connectDB.js';
import AppRoutes from './src/routes/index.js';
import cookieParser from 'cookie-parser';
import { app, server } from './src/socket/index.js'
dotenv.config();

const PORT = process.env.PORT || 8080;
// const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api', AppRoutes);

databaseConnection().then(() => {
 
  server.listen(PORT, () => console.log(`Server is running on ${PORT}`));
});
