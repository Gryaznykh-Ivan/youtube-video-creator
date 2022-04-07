"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info_1 = require("./info");
const api_1 = require("./api");
const video_1 = require("./video");
const server_1 = require("./server");
exports.default = {
    bot: {
        getServersStatus: server_1.getServersStatus,
        startRenderingForcibly: server_1.startRenderingForcibly,
        getRecentlyUploadedVideos: video_1.getRecentlyUploadedVideos,
        getBotInfo: info_1.getBotInfo,
    },
    api: {
        addVideoToRender: api_1.addVideoToRender
    },
};
