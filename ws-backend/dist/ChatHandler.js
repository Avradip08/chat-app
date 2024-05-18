"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatManager = void 0;
const Chat_1 = require("./Chat");
const SocketManager_1 = require("./SocketManager");
const message_1 = require("./message");
const chats = [];
let users = [];
function ChatManager(socket) {
    socket.on("message", (data) => {
        handleMessage(data.toString(), socket);
    });
    socket.on("close", () => {
        handleDisconnect(socket);
    });
}
exports.ChatManager = ChatManager;
const handleMessage = (data, socket) => {
    const message = JSON.parse(data);
    console.log(message);
    if (message.type === message_1.types.CREATE_ROOM) {
        // console.log("user created room")
        if (users.find((us) => us.getSocket() === socket)) {
            console.log("user already exists");
            return;
        }
        const chat = new Chat_1.Chat(message.payload.roomId);
        chats.push(chat);
        const user = new SocketManager_1.User(socket);
        users.push(user);
        chat.addMessage(`${user.userId} has joined the chat`, 'join', user.userId);
        SocketManager_1.SocketManager.getInstance().addUser(chat.getRoomId(), user);
        const res = {
            type: message_1.types.MESSAGE_RECEIVED,
            payload: {
                userId: user.userId,
                message: 'has joined the chat'
            }
        };
        SocketManager_1.SocketManager.getInstance().broadcast(chat.getRoomId(), JSON.stringify(res));
    }
    if (message.type === message_1.types.JOIN_ROOM) {
        // console.log("user joined room")
        if (users.find((us) => us.getSocket() === socket)) {
            console.log("user already exists");
            return;
        }
        const chat = chats.find(ch => ch.getRoomId() === message.payload.roomId);
        if (!chat) {
            console.log('room does not exist');
            return;
        }
        const user = new SocketManager_1.User(socket);
        users.push(user);
        chat.addMessage(`${user.userId} has joined the chat`, 'join', user.userId);
        SocketManager_1.SocketManager.getInstance().addUser(chat.getRoomId(), user);
        const res = {
            type: message_1.types.USER_JOINED,
            payload: {
                userId: user.userId,
                messages: chat.getMessages().map(m => m.getText()) || []
            }
        };
        SocketManager_1.SocketManager.getInstance().broadcast(chat.getRoomId(), JSON.stringify(res));
    }
    if (message.type === message_1.types.SEND_MESSAGE) {
        const chat = chats.find(ch => ch.getRoomId() === message.payload.roomId);
        if (chat) {
            const user = users.find(us => us.getSocket() === socket);
            if (user) {
                chat.addMessage(message.payload.message, 'message', user.userId);
                const res = {
                    type: message_1.types.MESSAGE_RECEIVED,
                    payload: {
                        userId: user.userId,
                        message: message.payload.message
                    }
                };
                SocketManager_1.SocketManager.getInstance().broadcast(chat.getRoomId(), JSON.stringify(res));
            }
        }
    }
};
const handleDisconnect = (socket) => {
    const user = users.find(us => us.getSocket() === socket);
    let roomId = '';
    if (user) {
        roomId = SocketManager_1.SocketManager.getInstance().removeUser(user) || '';
        const chat = chats.find(c => c.getRoomId() === roomId);
        if (chat) {
            chat.addMessage(`${user.getUserId()} has left the chat`, 'left', user.getUserId());
        }
    }
    const newUsers = users.filter(us => us.getSocket() !== socket);
    users = [...newUsers];
};
