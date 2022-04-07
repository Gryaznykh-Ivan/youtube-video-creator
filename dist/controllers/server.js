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
exports.startRenderingForcibly = exports.getServersStatus = void 0;
const fs_1 = __importDefault(require("fs"));
const render_1 = require("../utils/render");
const Server_1 = __importDefault(require("../models/Server"));
const Video_1 = __importDefault(require("../models/Video"));
const keyboards_1 = require("../keyboards");
const getServersStatus = (bot, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const chat_id = ((_a = ctx.message) === null || _a === void 0 ? void 0 : _a.chat.id) || ctx.from.id;
    const servers = yield Server_1.default.find({});
    if (servers.length === 0) {
        return yield bot.sendMessage(chat_id, "Произошла ошибка при попытке получения информации о серверах", keyboards_1.baseKeyBoard);
    }
    const msg = servers.map(server => `Server id: ${server._id}\nStatus: ${server.status}${server.status === "ENGAGED" ? `\nОбрабатывается: ${server.processing}` : ''}`).join("\n\n");
    return yield bot.sendMessage(chat_id, msg, keyboards_1.baseKeyBoard);
});
exports.getServersStatus = getServersStatus;
const startRenderingForcibly = (bot, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const chat_id = ((_b = ctx.message) === null || _b === void 0 ? void 0 : _b.chat.id) || ctx.from.id;
    const videos = yield Video_1.default.find({ isProcessed: false }, null, { sort: { createdAt: -1 } }).populate('channel');
    if (videos.length === 0) {
        return yield bot.sendMessage(chat_id, "Новых видео роликов для рендеринга нет", keyboards_1.baseKeyBoard);
    }
    const server = yield Server_1.default.findById(process.env.SERVER_ID);
    if (server === null) {
        return yield bot.sendMessage(chat_id, "Обратитесь к администратору. Сервер не найден", keyboards_1.baseKeyBoard);
    }
    if (server.status === "ENGAGED") {
        return yield bot.sendMessage(chat_id, "Сервер занят обработкой ролика. Попробуйте запустить обработку позже", keyboards_1.baseKeyBoard);
    }
    yield bot.sendMessage(chat_id, "Обработка ролика запущена");
    //server.status = "ENGAGED";
    //server.processing = videos[0].title;
    //await server.save();
    // Обработка
    const videoPath = yield (0, render_1.render)(videos[0]);
    //await Video.updateOne({ _id: videos[0]._id }, { isProcessed: true });
    server.status = "FREE";
    server.processing = null;
    yield server.save();
    const msg = `Видео успешно обработано!\nКанал: ${videos[0].channel.title}\nНазвание: ${videos[0].title}\nКоличество роликов в нарезке: ${videos[0].videos.length}`;
    yield bot.sendDocument(chat_id, fs_1.default.createReadStream(videoPath));
    return yield bot.sendMessage(chat_id, msg, keyboards_1.baseKeyBoard);
});
exports.startRenderingForcibly = startRenderingForcibly;
