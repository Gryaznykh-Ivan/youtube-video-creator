import TelegramBot, { CallbackQuery } from 'node-telegram-bot-api'
import { baseKeyBoard } from '../keyboards';

const getBotInfo = async (bot: TelegramBot, ctx: CallbackQuery) => {
    const chat_id = ctx.message?.chat.id || ctx.from.id;

    return await bot.sendMessage(chat_id, "YT-bot v1.0.0\nCreated by Ivan-Griaznykh", baseKeyBoard);
}

export {
    getBotInfo
}