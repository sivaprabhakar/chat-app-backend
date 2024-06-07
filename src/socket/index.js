

import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import getUserDetailsFromToken from '../helper/getUserToken.js';
import UserModel from '../models/User.js';
import { ConversationModel, MessageModel } from '../models/Message.js';
import getConversation from '../helper/getConversation.js';

const app = express();

/*** Socket connection */
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: true,
        credentials: true
    }
});

// Online user
const onlineUser = new Set();

io.on('connection', async (socket) => {
   

    const token = socket.handshake.auth.token;

    // Current user details
    const user = await getUserDetailsFromToken(token);

    // Create a room
    socket.join(user?._id?.toString());
    onlineUser.add(user?._id?.toString());

    io.emit('onlineUser', Array.from(onlineUser));

    socket.on('message-page', async (userId) => {
      
        const userDetails = await UserModel.findById(userId).select("-password");

        const payload = {
            _id: userDetails?._id,
            name: userDetails?.name,
            email: userDetails?.email,
            profile_pic: userDetails?.profile_pic,
            online: onlineUser.has(userId)
        };
        socket.emit('message-user', payload);

        // Get previous messages
        const getConversationMessage = await ConversationModel.findOne({
            "$or": [
                { sender: user?._id, receiver: userId },
                { sender: userId, receiver: user?._id }
            ]
        }).populate('messages').sort({ updatedAt: -1 });

        socket.emit('message', getConversationMessage?.messages || []);
    });

    // New message
    socket.on('new message', async (data) => {
        
        let conversation = await ConversationModel.findOne({
            "$or": [
                { sender: data?.sender, receiver: data?.receiver },
                { sender: data?.receiver, receiver: data?.sender }
            ]
        });

        if (!conversation) {
            const createConversation = new ConversationModel({
                sender: data?.sender,
                receiver: data?.receiver
            });
            conversation = await createConversation.save();
        }

        const message = new MessageModel({
            text: data.text,
            imageUrl: data.imageUrl,
            videoUrl: data.videoUrl,
            msgByUserId: data?.msgByUserId,
        });
        const saveMessage = await message.save();

        await ConversationModel.updateOne({ _id: conversation?._id }, {
            "$push": { messages: saveMessage?._id }
        });

        const getConversationMessage = await ConversationModel.findOne({
            "$or": [
                { sender: data?.sender, receiver: data?.receiver },
                { sender: data?.receiver, receiver: data?.sender }
            ]
        }).populate('messages').sort({ updatedAt: -1 });
 
       
        io.to(data?.sender).emit('message', getConversationMessage?.messages || []);
        io.to(data?.receiver).emit('message', getConversationMessage?.messages || []);

        const conversationSender = await getConversation(data?.sender);
        const conversationReceiver = await getConversation(data?.receiver);

        io.to(data?.sender).emit('conversation', conversationSender);
        io.to(data?.receiver).emit('conversation', conversationReceiver);
    });
      
    // sidebar
    socket.on('sidebar', async (currentUserId) => {
        
        const conversation = await getConversation(currentUserId);
        socket.emit('conversation', conversation);
    });

    socket.on('seen', async(msgByUserId) => {
        const conversation = await ConversationModel.findOne({
            "$or": [
                { sender: user?._id, receiver: msgByUserId },
                { sender: msgByUserId, receiver: user?._id }
            ]
        });

        const conversationMessageId = conversation?.messages || [];

        await MessageModel.updateMany(
            { _id: { "$in": conversationMessageId }, msgByUserId: msgByUserId },
            { "$set": { seen: true } }
        );

        const conversationSender = await getConversation(user?._id?.toString());
        const conversationReceiver = await getConversation(msgByUserId);

        io.to(user?._id?.toString()).emit('conversation', conversationSender);
        io.to(msgByUserId).emit('conversation', conversationReceiver);
    
   
});

    socket.on('disconnect', () => {
        onlineUser.delete(user?._id?.toString());
        console.log('Disconnected user ', socket.id);
    });
});

export { app, server };
