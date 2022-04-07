import fs from 'fs'
import TelegramBot, { CallbackQuery } from 'node-telegram-bot-api'
import { render } from '../utils/render'
import Server from '../models/Server'
import Video from '../models/Video'

import { baseKeyBoard } from '../keyboards'

const getServersStatus = async (bot: TelegramBot, ctx: CallbackQuery) => {
    const chat_id = ctx.message?.chat.id || ctx.from.id;

    const servers = await Server.find({});
    if (servers.length === 0) {
        return await bot.sendMessage(chat_id, "Произошла ошибка при попытке получения информации о серверах", baseKeyBoard);
    }
    
    const msg = servers.map(server => `Server id: ${server._id}\nStatus: ${ server.status }${ server.status === "ENGAGED" ? `\nОбрабатывается: ${ server.processing }` : '' }`).join("\n\n");

    return await bot.sendMessage(chat_id, msg, baseKeyBoard);
}

const startRenderingForcibly = async (bot: TelegramBot, ctx: CallbackQuery) => {
    const chat_id = ctx.message?.chat.id || ctx.from.id;

    const videos = await Video.find({ isProcessed: false }, null, { sort: { createdAt: -1 } }).populate('channel');
    if (videos.length === 0) {
        return await bot.sendMessage(chat_id, "Новых видео роликов для рендеринга нет", baseKeyBoard);
    }

    const server = await Server.findById(process.env.SERVER_ID);
    if (server === null) {
        return await bot.sendMessage(chat_id, "Обратитесь к администратору. Сервер не найден", baseKeyBoard);
    }

    if (server.status === "ENGAGED") {
        return await bot.sendMessage(chat_id, "Сервер занят обработкой ролика. Попробуйте запустить обработку позже", baseKeyBoard);
    }

    await bot.sendMessage(chat_id, "Обработка ролика запущена");

    //server.status = "ENGAGED";
    //server.processing = videos[0].title;
    //await server.save();

    // Обработка
    const videoPath = await render(videos[0]);

    //await Video.updateOne({ _id: videos[0]._id }, { isProcessed: true });

    server.status = "FREE";
    server.processing = null;
    await server.save();

    const msg = `Видео успешно обработано!\nКанал: ${ videos[0].channel.title }\nНазвание: ${ videos[0].title }\nКоличество роликов в нарезке: ${ videos[0].videos.length }`;
    await bot.sendDocument(chat_id, fs.createReadStream(videoPath));
    return await bot.sendMessage(chat_id, msg, baseKeyBoard);
}

export {
    getServersStatus,
    startRenderingForcibly
}