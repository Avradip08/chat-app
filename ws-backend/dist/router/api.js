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
apiRouter.get("/chats", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req.body;
    const { userName } = user;
    console.log(userName);
    try {
        const user = yield db_1.db.user.findFirst({
            where: {
                userName
            },
            include: {
                rooms: true
            }
        });
        return res.status(200).json({ rooms: user === null || user === void 0 ? void 0 : user.rooms });
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
