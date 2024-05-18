"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketManager = exports.User = void 0;
const crypto_1 = require("crypto");
const message_1 = require("./message");
class User {
    constructor(socket) {
        this.userId = (0, crypto_1.randomUUID)();
        this.socket = socket;
    }
    getUserId() {
        return this.userId;
    }
    getSocket() {
        return this.socket;
    }
}
exports.User = User;
class SocketManager {
    constructor() {
        this.userToRoomMapping = new Map();
        this.interestedUsers = new Map();
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new SocketManager();
        return this.instance;
    }
    addUser(roomId, user) {
        // console.log("in socket manager " + user.userId +" has joined " + roomId)
        this.userToRoomMapping.set(user.userId, roomId);
        this.interestedUsers.set(roomId, [
            ...(this.interestedUsers.get(roomId) || []),
            user
        ]);
    }
    broadcast(roomId, message) {
        const users = this.interestedUsers.get(roomId);
        if (!users) {
            console.error('no users present to receive the messages');
            return;
        }
        users.forEach((user) => {
            if (user.socket) {
                user.socket.send(message);
            }
        });
    }
    removeUser(user) {
        var _a;
        const roomId = this.userToRoomMapping.get(user.getUserId());
        if (!roomId) {
            console.error("User was not interested in any room");
            return;
        }
        // console.log("in socket manager " + user.userId +" has left " + roomId)
        const res = {
            type: message_1.types.USER_LEFT,
            payload: {
                userId: user.userId,
                message: 'has left the chat'
            }
        };
        this.broadcast(roomId, JSON.stringify(res));
        const roomUsers = this.interestedUsers.get(roomId) || [];
        const remainingUsers = roomUsers.filter((roomUser) => {
            return roomUser.getUserId() !== user.getUserId();
        });
        this.interestedUsers.set(roomId, remainingUsers);
        if (((_a = this.interestedUsers.get(roomId)) === null || _a === void 0 ? void 0 : _a.length) === 0) {
            this.interestedUsers.delete(roomId);
        }
        this.userToRoomMapping.delete(user.getUserId());
        return roomId;
    }
}
exports.SocketManager = SocketManager;
