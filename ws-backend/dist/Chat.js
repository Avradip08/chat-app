"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = exports.Message = void 0;
const crypto_1 = require("crypto");
class Message {
    constructor(text, type, userId, timestamp) {
        this.id = (0, crypto_1.randomUUID)();
        this.type = type;
        this.text = text;
        this.userId = userId;
        this.timestamp = timestamp;
    }
    getText() {
        return this.text;
    }
    getUserId() {
        return this.userId;
    }
    getTimestamp() {
        return this.timestamp;
    }
}
exports.Message = Message;
class Chat {
    constructor(roomId) {
        this.roomId = roomId;
        this.messages = [];
    }
    getRoomId() {
        return this.roomId;
    }
    getMessages() {
        return this.messages;
    }
    addMessage(data, type, userId) {
        const message = new Message(data, type, userId, new Date());
        return this.messages.push(message);
    }
}
exports.Chat = Chat;
