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
exports.render = void 0;
const path_1 = __importDefault(require("path"));
const download_1 = __importDefault(require("download"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const tiktok_1 = require("./tiktok");
const render = (video) => __awaiter(void 0, void 0, void 0, function* () {
    const videos = [];
    console.log("[Stage 1] Скачивание роликов");
    for (let v of video.videos) {
        const url = yield (0, tiktok_1.getVideoWithoutWatermark)(v.videoId);
        if (url === null)
            continue;
        yield (0, download_1.default)(url, 'media/source', { filename: `${v.videoId}.mp4` })
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            const newVideo = {
                path: `../media/source/${v.videoId}.mp4`,
                filename: `${v.videoId}.mp4`,
                crop: v.crop
            };
            videos.push(newVideo);
        }))
            .catch((e) => console.log(e));
    }
    console.log("[Stage 2] Форматирование роликов");
    for (let video of videos) {
        const pxTop = Math.ceil(1080 * (video.crop.top / 100));
        const pxBottom = Math.ceil(1080 * (video.crop.bottom / 100));
        yield new Promise((resolve, reject) => {
            (0, fluent_ffmpeg_1.default)(path_1.default.join(__dirname, "../", video.path))
                .format('mp4')
                .fps(24)
                .videoBitrate('4500k')
                .videoCodec('libx264')
                .audioCodec('libmp3lame')
                .audioBitrate('128k')
                .complexFilter(`color=s=1920x1080:c=black[bg];[0:v]crop=w=iw:h=ih-${pxTop}-${pxBottom}:x=0:y=${pxTop}[crop1];[crop1]scale=-1:1080,setsar=1[v0];[bg][v0]overlay=(W-w)/2:0:shortest=1`) // overlay=(W-w)/2:(H-h)/2,crop=w=1920:h=1080
                .save(path_1.default.join(__dirname, '../../media/prepared/', video.filename))
                .on('end', function () {
                console.log('Файл подготовлен:', video.filename);
                resolve(true);
            }).on('error', function (err) {
                console.log('Ошибка:', err);
                reject(err);
            });
        });
    }
    console.log("[Stage 3] Склеивание роликов");
    const ffmpeg = (0, fluent_ffmpeg_1.default)();
    videos.forEach((video, i) => {
        ffmpeg.input(path_1.default.join(__dirname, '../../media/prepared/', video.filename));
        if (videos.length - 1 != i) {
            ffmpeg.input(path_1.default.join(__dirname, '../../media/common/transition.mp4'));
        }
    });
    return yield new Promise((resolve, reject) => ffmpeg
        .mergeToFile(path_1.default.join(__dirname, `../../media/result/${video.title}.mp4`))
        .on('end', function () {
        console.log('Файл успешно создан');
        resolve(path_1.default.join(__dirname, `../../media/result/${video.title}.mp4`));
    })
        .on('progress', function (info) {
        console.log(JSON.stringify(info));
    })
        .on('error', function (err) {
        console.log('Ошибка:', err.message);
    }));
});
exports.render = render;
