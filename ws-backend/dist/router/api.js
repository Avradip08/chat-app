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
const express_1 = require("express");
const db_1 = require("../db");
const apiMiddleware_1 = require("../middlewares/apiMiddleware");
const apiRouter = (0, express_1.Router)();
//adding middleware for all api routes
apiRouter.all(`/*`, apiMiddleware_1.apiMiddleWare);
//get authentication details
apiRouter.get("/me", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { user } = req.body;
    return res.json({ user, message: "user is authenticated" });
}));
//get all chats of a user
apiRouter.get("/rooms", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req.body;
    const { userName } = user;
    console.log(userName);
    try {
        const rooms = yield db_1.db.userToRoom.findMany({
            where: {
                userName
            },
            select: {
                room: {
                    select: {
                        id: true,
                        name: true,
                        messages: {
                            select: {
                                id: true, userName: true, text: true, timeStamp: true
                            }, orderBy: {
                                id: "desc"
                            }, take: 1
                        }
                    }
                }
            },
        });
        const info = (rooms === null || rooms === void 0 ? void 0 : rooms.map(m => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            return {
                roomId: (_a = m === null || m === void 0 ? void 0 : m.room) === null || _a === void 0 ? void 0 : _a.id,
                roomName: (_b = m === null || m === void 0 ? void 0 : m.room) === null || _b === void 0 ? void 0 : _b.name,
                messageId: (_d = (_c = m === null || m === void 0 ? void 0 : m.room) === null || _c === void 0 ? void 0 : _c.messages[0]) === null || _d === void 0 ? void 0 : _d.id,
                messageText: (_f = (_e = m === null || m === void 0 ? void 0 : m.room) === null || _e === void 0 ? void 0 : _e.messages[0]) === null || _f === void 0 ? void 0 : _f.text,
                messageUser: (_h = (_g = m === null || m === void 0 ? void 0 : m.room) === null || _g === void 0 ? void 0 : _g.messages[0]) === null || _h === void 0 ? void 0 : _h.userName,
                messageTime: (_k = (_j = m === null || m === void 0 ? void 0 : m.room) === null || _j === void 0 ? void 0 : _j.messages[0]) === null || _k === void 0 ? void 0 : _k.timeStamp,
            };
        })) || [];
        return res.status(200).json(info);
    }
    catch (e) {
        return res.status(404).send({ message: "error occured" });
    }
}));
//get all messages in a chat
apiRouter.get(`/:roomId/messages`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId } = req.params;
        const messages = yield db_1.db.message.findMany({
            where: {
                roomId
            },
            orderBy: {
                id: 'asc',
            },
        });
        return res.status(200).json({ messages });
    }
    catch (e) {
        return res.status(404).json({ message: "error ocurred" });
    }
}));
//check if room id exists in db
apiRouter.post('/roomExists', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.body;
    console.log(roomId);
    try {
        let roomExists = false;
        const room = yield db_1.db.room.findUnique({
            where: {
                id: roomId
            }
        });
        console.log(room);
        if (room !== null) {
            roomExists = true;
        }
        res.status(200).json({ roomExists });
    }
    catch (e) {
        console.log(e);
        res.status(404).json({ message: "error occured" });
    }
}));
//check if the user is currently active in the room
apiRouter.post('/userActive', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.body;
    const { user } = req.body;
    const { userName } = user;
    try {
        let userActive = false;
        const user = yield db_1.db.userToRoom.findUnique({
            where: {
                userName_roomId: {
                    userName, roomId
                }
            },
            select: {
                active: true
            }
        });
        if ((user === null || user === void 0 ? void 0 : user.active) === true) {
            userActive = true;
        }
        res.status(200).json({ userActive });
    }
    catch (e) {
        res.status(404).json({ message: "error occured" });
    }
}));
exports.default = apiRouter;
