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
const apiRouter = (0, express_1.Router)();
//adding middleware for all api routes
// apiRouter.all(`/*`,apiMiddleWare as any)
//get authentication details
apiRouter.get("/me", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { user } = req.body;
    return res.json({ user, message: "user is authenticated" });
}));
//get all chats of a user
apiRouter.get("/chats", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName } = req.body;
    try {
        const user = yield db_1.db.user.findFirst({
            where: {
                userName
            },
            include: {
                rooms: true
            }
        });
        res.status(200).json({ rooms: user === null || user === void 0 ? void 0 : user.rooms });
    }
    catch (e) {
        res.status(404).send({ message: "error occured" });
    }
}));
//get all messages in a chat
apiRouter.get(`/:roomId/messages`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId } = req.params;
        const room = yield db_1.db.room.findFirst({
            where: {
                id: roomId
            },
            include: {
                messages: true
            }
        });
        res.status(200).json({ messages: room === null || room === void 0 ? void 0 : room.messages });
    }
    catch (e) {
        res.status(404).json({ message: "error ocurred" });
    }
}));
exports.default = apiRouter;
