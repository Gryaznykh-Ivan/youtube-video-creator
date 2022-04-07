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
exports.addVideoToRender = void 0;
const sha256_1 = __importDefault(require("sha256"));
const Video_1 = __importDefault(require("../models/Video"));
const Channel_1 = __importDefault(require("../models/Channel"));
const addVideoToRender = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { channel: channelId, title = "", videos = [], preview } = ctx.request.body;
    const channel = yield Channel_1.default.findOne({ channelId });
    if (channel === null) {
        return ctx.throw(400, "Channel wasn`t found");
    }
    const videoTitle = title || `${channel.defaultVideoTitle} [${channel.videoCounter + 1}]`;
    if (videos.length < 12) {
        return ctx.throw(400, "Videos compilation must contain at least 12 videos");
    }
    if (preview.indexOf("data:image/jpeg;base64") !== 0) {
        return ctx.throw(400, "Preview wasn`t sent");
    }
    const hash = (0, sha256_1.default)(videos.map((video) => Number(video.videoId)).sort().join(''));
    const isVideoAlreadyExist = yield Video_1.default.findOne({ hash });
    if (isVideoAlreadyExist !== null) {
        return ctx.throw(400, "Video already exist");
    }
    const newVideo = yield Video_1.default.create({ title: videoTitle, preview, channel: channelId, videos, hash });
    if (newVideo === null) {
        return ctx.throw(400, "Error occurred");
    }
    channel.videoCounter += 1;
    yield channel.save();
    ctx.body = {
        success: true,
        data: newVideo
    };
});
exports.addVideoToRender = addVideoToRender;
