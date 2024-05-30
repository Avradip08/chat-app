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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ChatHandler_1 = require("./ChatHandler");
const express_1 = __importDefault(require("express"));
const express_ws_1 = __importDefault(require("express-ws"));
const cors_1 = __importDefault(require("cors"));
const api_1 = __importDefault(require("./router/api"));
const auth_1 = __importDefault(require("./router/auth"));
const wsMiddleware_1 = require("./middlewares/wsMiddleware");
const PORT = process.env.PORT || 8080;
const { app, getWss, applyTo } = (0, express_ws_1.default)((0, express_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api", api_1.default);
app.use("/auth", auth_1.default);
app.get("/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ message: "hello world" });
}));
app.ws("/", (ws, req) => {
    var _a, _b;
    console.log("connection established" + Math.random());
    const token = (_a = req.query) === null || _a === void 0 ? void 0 : _a.token;
    const roomId = (_b = req.query) === null || _b === void 0 ? void 0 : _b.roomId;
    console.log(roomId);
    console.log(token);
    const user = (0, wsMiddleware_1.verifyToken)(token);
    console.log(user.userName);
    console.log(getWss().clients.size);
    (0, ChatHandler_1.ChatManager)(ws, user.userName, roomId);
});
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
