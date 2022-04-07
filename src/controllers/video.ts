import TelegramBot, { CallbackQuery } from 'node-telegram-bot-api'
import Video from '../models/Video'

import { baseKeyBoard } from '../keyboards';

const getRecentlyUploadedVideos = async (bot: TelegramBot, ctx: CallbackQuery) => {
    const chat_id = ctx.message?.chat.id || ctx.from.id;

    const videos = await Video.find({ isProcessed: false }, null, { sort: { createdAt: -1 } }).populate('channel');
    if (videos.length === 0) {
        return await bot.sendMessage(chat_id, "Новых видео роликов нет\nЭто надо исправлять", baseKeyBoard);
    }

    const msg = videos.map((video: any) => `Канал: ${ video.channel.title }\nНазвание: ${ video.title }\nКоличество видео: ${ video.videos.length }\nСозданно: ${ video.createdAt.toLocaleString() }`).join("\n\n");

    return await bot.sendMessage(chat_id, msg, baseKeyBoard);
}

export {
    getRecentlyUploadedVideos
}