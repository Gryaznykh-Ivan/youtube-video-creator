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
exports.getRecentlyUploadedVideos = void 0;
const Video_1 = __importDefault(require("../models/Video"));
const keyboards_1 = require("../keyboards");
const getRecentlyUploadedVideos = (bot, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const chat_id = ((_a = ctx.message) === null || _a === void 0 ? void 0 : _a.chat.id) || ctx.from.id;
    const videos = yield Video_1.default.find({ isProcessed: false }, null, { sort: { createdAt: -1 } }).populate('channel');
    if (videos.length === 0) {
        return yield bot.sendMessage(chat_id, "Новых видео роликов нет\nЭто надо исправлять", keyboards_1.baseKeyBoard);
    }
    const msg = videos.map((video) => `Канал: ${video.channel.title}\nНазвание: ${video.title}\nКоличество видео: ${video.videos.length}\nСозданно: ${video.createdAt.toLocaleString()}`).join("\n\n");
    return yield bot.sendMessage(chat_id, msg, keyboards_1.baseKeyBoard);
});
exports.getRecentlyUploadedVideos = getRecentlyUploadedVideos;
