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
const dotenv_1 = __importDefault(require("dotenv"));
const koa_1 = __importDefault(require("koa"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("@koa/cors"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const routes_1 = __importDefault(require("./routes"));
const bot_1 = require("./bot");
dotenv_1.default.config();
const app = new koa_1.default();
app.use((0, cors_1.default)());
app.use((0, koa_bodyparser_1.default)());
app.use(routes_1.default.routes());
app.use(routes_1.default.allowedMethods());
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    const PORT = process.env.PORT || 80;
    yield mongoose_1.default.connect(process.env.MONGO_CONNECTION_URL);
    (0, bot_1.setupBot)();
    app.listen(PORT, () => console.log("Сервер запущен и слушает порт:", PORT));
});
start();
