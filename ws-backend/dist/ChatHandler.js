"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatManager = void 0;
const SocketManager_1 = require("./SocketManager");
const message_1 = require("./message");
const db_1 = require("./db");
function ChatManager(socket, userName, roomId) {
    socket.on("message", (data) => {
        handleMessage(data.toString(), socket, userName, roomId);
    });
    socket.on("close", () => {
        handleDisconnect(userName, roomId);
    });
}
exports.ChatManager = ChatManager;
const handleMessage = (data, socket, userName, roomId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const message = JSON.parse(data);
    console.log(Date.now());
    console.log(message);
    if (message.type === message_1.types.CREATE_ROOM) {
        console.log("create room called");
        const user = new SocketManager_1.User(userName, socket);
        //add room to user's list of rooms in db
        try {
            yield db_1.db.user.update({
                where: {
                    userName
                },
                data: {
                    rooms: {
                        create: {
                            active: true,
                            room: { create: { id: roomId } }
                        }
                    }
                }
            });
        }
        catch (e) {
        }
        //add user to the socket manager
        SocketManager_1.SocketManager.getInstance().addUser(roomId, user);
        const res = new SocketManager_1.Message(message_1.types.USER_JOINED, 'has joined the chat', userName);
        //add message to the room's list of messages in db
        try {
            yield db_1.db.room.update({
                where: {
                    id: roomId
                },
                data: {
                    messages: { create: { type: message_1.types.USER_JOINED, text: 'has joined the chat', userName } }
                }
            });
        }
        catch (e) {
        }
        //broadcast the message to all the users in the room
        SocketManager_1.SocketManager.getInstance().broadcast(roomId, res);
    }
    if (message.type === message_1.types.JOIN_ROOM) {
        console.log("join room called");
        const user = new SocketManager_1.User(userName, socket);
        //add room to the user's list of rooms
        try {
            yield db_1.db.user.update({
                where: {
                    userName
                },
                data: {
                    rooms: {
                        upsert: {
                            create: {
                                active: true,
                                room: { connect: { id: roomId } }
                            },
                            update: {
                                active: true
                            },
                            where: {
                                userName_roomId: {
                                    roomId, userName
                                }
                            }
                        }
                    }
                }
            });
        }
        catch (e) {
        }
        //adding the user to in the socket manager
        SocketManager_1.SocketManager.getInstance().addUser(roomId, user);
        const res = new SocketManager_1.Message(message_1.types.USER_JOINED, 'has joined the chat', userName);
        //adding the message to the room's list of messages in db
        try {
            yield db_1.db.room.update({
                where: {
                    id: roomId
                },
                data: {
                    messages: { create: { type: message_1.types.USER_JOINED, text: 'has joined the chat', userName } }
                }
            });
        }
        catch (e) {
        }
        //broadcasting to all users
        SocketManager_1.SocketManager.getInstance().broadcast(roomId, res);
    }
    if (message.type === message_1.types.JOIN_OLD_ROOM) {
        console.log("join old room called");
        const user = new SocketManager_1.User(userName, socket);
        //updating the user's active status in the room
        yield db_1.db.userToRoom.update({
            where: {
                userName_roomId: {
                    userName, roomId
                }
            },
            data: {
                active: true
            }
        });
        //adding the user to in the socket manager
        SocketManager_1.SocketManager.getInstance().addUser(roomId, user);
        const res = new SocketManager_1.Message(message_1.types.USER_JOINED, 'has joined the chat', userName);
        //adding the message to the room's list of messages in db
        try {
            yield db_1.db.room.update({
                where: {
                    id: roomId
                },
                data: {
                    messages: { create: { type: message_1.types.USER_JOINED, text: 'has joined the chat', userName } }
                }
            });
        }
        catch (e) {
        }
        //broadcasting to all users
        SocketManager_1.SocketManager.getInstance().broadcast(roomId, res);
    }
    if (message.type === message_1.types.SEND_MESSAGE) {
        console.log("send message called");
        const res = new SocketManager_1.Message(message_1.types.MESSAGE_RECEIVED, message.payload.message, userName);
        //add the message to the room's list of messages in db
        try {
            yield db_1.db.room.update({
                where: {
                    id: roomId
                },
                data: {
                    messages: { create: { type: message_1.types.MESSAGE_RECEIVED, text: (_a = message === null || message === void 0 ? void 0 : message.payload) === null || _a === void 0 ? void 0 : _a.message, userName } }
                }
            });
        }
        catch (e) {
        }
        //broadcast message to all users in the room
        SocketManager_1.SocketManager.getInstance().broadcast(roomId, res);
    }
});
const handleDisconnect = (userName, roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const res = new SocketManager_1.Message(message_1.types.USER_LEFT, 'has left the chat', userName);
    //update the active status for the user in the room
    yield db_1.db.userToRoom.update({
        where: {
            userName_roomId: {
                userName, roomId
            }
        },
        data: {
            active: false
        }
    });
    //add the message to the room's list of messages
    try {
        yield db_1.db.room.update({
            where: {
                id: roomId
            },
            data: {
                messages: { create: { type: message_1.types.USER_LEFT, text: 'has left the chat', userName } }
            }
        });
    }
    catch (e) {
    }
    //broadcast the message
    SocketManager_1.SocketManager.getInstance().broadcast(roomId, res);
    //remove the user from the room
    SocketManager_1.SocketManager.getInstance().removeUser(userName, roomId);
});
