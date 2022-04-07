"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseKeyBoard = void 0;
exports.baseKeyBoard = {
    "reply_markup": {
        "inline_keyboard": [
            [{ text: "Проверить статус", callback_data: "getServersStatus" }],
            [{ text: "Принудительный запуск", callback_data: "startRenderingForcibly" }],
            [{ text: "Недавно загруженные ролики", callback_data: "getRecentlyUploadedVideos" }],
            [{ text: "Информация", callback_data: "getBotInfo" }]
        ],
    }
};
