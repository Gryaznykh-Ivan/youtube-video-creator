import TelegramBot from 'node-telegram-bot-api'
import controllers from './controllers'

import { baseKeyBoard } from './keyboards'

export const setupBot = async () => {

    const bot = new TelegramBot(process.env.TELEGRAM_TOKEN as string, { polling: true });

    bot.onText(/\/start/, async (msg) => {
        await bot.sendMessage(msg.chat.id, "Бот для проверки состояния рендер-сервера", baseKeyBoard);
    });

    bot.on('callback_query', async (ctx) => {
        const action = ctx.data;
        const sender = ctx.from.id;
        const chat_id = ctx.message?.chat.id || sender;

        if (JSON.parse(process.env.ADMINS as string).includes(sender) === false) {
            return await bot.sendMessage(chat_id, "У вас нет доступа к функциям");
        }
        
        if (action === undefined || Object.keys(controllers.bot).includes(action) === false) {
            return await bot.sendMessage(chat_id, "Вызов несуществующего action");
        }

        return await Object.values(controllers.bot)[Object.keys(controllers.bot).indexOf(action)](bot, ctx);
    });
}