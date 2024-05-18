"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ChatHandler_1 = require("./ChatHandler");
const express_1 = __importDefault(require("express"));
const express_ws_1 = __importDefault(require("express-ws"));
const { app, getWss, applyTo } = (0, express_ws_1.default)((0, express_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.json({ message: "hello world" });
});
app.ws("/", (ws) => {
    console.log("connection established" + Math.random());
    (0, ChatHandler_1.ChatManager)(ws);
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
