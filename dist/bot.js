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
exports.setupBot = void 0;
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const controllers_1 = __importDefault(require("./controllers"));
const keyboards_1 = require("./keyboards");
const setupBot = () => __awaiter(void 0, void 0, void 0, function* () {
    const bot = new node_telegram_bot_api_1.default(process.env.TELEGRAM_TOKEN, { polling: true });
    bot.onText(/\/start/, (msg) => __awaiter(void 0, void 0, void 0, function* () {
        yield bot.sendMessage(msg.chat.id, "Бот для проверки состояния рендер-сервера", keyboards_1.baseKeyBoard);
    }));
    bot.on('callback_query', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const action = ctx.data;
        const sender = ctx.from.id;
        const chat_id = ((_a = ctx.message) === null || _a === void 0 ? void 0 : _a.chat.id) || sender;
        if (JSON.parse(process.env.ADMINS).includes(sender) === false) {
            return yield bot.sendMessage(chat_id, "У вас нет доступа к функциям");
        }
        if (action === undefined || Object.keys(controllers_1.default.bot).includes(action) === false) {
            return yield bot.sendMessage(chat_id, "Вызов несуществующего action");
        }
        return yield Object.values(controllers_1.default.bot)[Object.keys(controllers_1.default.bot).indexOf(action)](bot, ctx);
    }));
});
exports.setupBot = setupBot;
