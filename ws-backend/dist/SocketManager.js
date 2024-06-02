"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketManager = exports.Message = exports.User = void 0;
const crypto_1 = require("crypto");
class User {
    constructor(userName, socket) {
        this.userName = userName;
        this.socket = socket;
    }
    getUserName() {
        return this.userName;
    }
    getSocket() {
        return this.socket;
    }
}
exports.User = User;
class Message {
    constructor(type, text, userName) {
        this.id = (0, crypto_1.randomUUID)();
        this.type = type;
        this.text = text;
        this.userName = userName;
        this.timestamp = Date.now();
    }
    getId() {
        return this.id;
    }
    getType() {
        return this.type;
    }
    getText() {
        return this.text;
    }
    getUserName() {
        return this.userName;
    }
    getTimestamp() {
        return this.timestamp;
    }
}
exports.Message = Message;
class SocketManager {
    constructor() {
        this.userToRoomMapping = new Map();
        this.interestedUsers = new Map();
        this.roomMessages = new Map();
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new SocketManager();
        return this.instance;
    }
    addUser(roomId, user) {
        console.log("add user");
        this.userToRoomMapping.set(user.getUserName(), [
            ...(this.userToRoomMapping.get(user.getUserName()) || []),
            roomId
        ]);
        this.interestedUsers.set(roomId, [
            ...(this.interestedUsers.get(roomId) || []),
            user
        ]);
    }
    broadcast(roomId, message) {
        console.log('broadcast called');
        const users = this.interestedUsers.get(roomId);
        if (!users) {
            console.error('no users present to receive the messages');
            return;
        }
        //add to the room's messages
        const messages = this.roomMessages.get(roomId) || [];
        this.roomMessages.set(roomId, [...messages, new Message(message.getType(), message.getText(), message.getUserName())]);
        //construct message to broadcast
        const res = JSON.stringify({
            type: message.getType(),
            payload: {
                id: message.getId(),
                message: message.getText(),
                userName: message.getUserName(),
                timeStamp: message.getTimestamp()
            }
        });
        //broadcasting to all the sockets in the room
        users.forEach((user) => {
            if (user.getSocket()) {
                user.getSocket().send(res);
            }
        });
    }
    removeUser(userName, roomId) {
        var _a, _b;
        //delete the user form the room
        const roomUsers = this.interestedUsers.get(roomId) || [];
        const remainingUsers = roomUsers.filter((roomUser) => {
            return roomUser.getUserName() !== userName;
        });
        this.interestedUsers.set(roomId, remainingUsers);
        if (((_a = this.interestedUsers.get(roomId)) === null || _a === void 0 ? void 0 : _a.length) === 0) {
            this.interestedUsers.delete(roomId);
        }
        //delete the room from the user
        const userRooms = this.userToRoomMapping.get(userName) || [];
        const remainingRooms = userRooms.filter((userRoom) => {
            return userRoom !== roomId;
        });
        this.userToRoomMapping.set(userName, remainingRooms);
        if (((_b = this.userToRoomMapping.get(userName)) === null || _b === void 0 ? void 0 : _b.length) === 0) {
            this.userToRoomMapping.delete(userName);
        }
    }
}
exports.SocketManager = SocketManager;
//todo: add logout logic to broadcast user left in all rooms
