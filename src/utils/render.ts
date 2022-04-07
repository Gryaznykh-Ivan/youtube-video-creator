import path from 'path'
import download from 'download';
import FFMPEG from 'fluent-ffmpeg'
import { getVideoIdsList, getVideoWithoutWatermark } from './tiktok';
import { IVideo, ICrop } from '../models/Video';


interface v {
    path: string;
    filename: string;
    crop: ICrop;
}

export const render = async (video: IVideo): Promise<string> => {
    const videos: v[] = [];

    console.log("[Stage 1] Скачивание роликов");

    for (let v of video.videos) {
        const url = await getVideoWithoutWatermark(v.videoId);
        if (url === null) continue;

        await download(url, 'media/source', { filename: `${v.videoId}.mp4` })
            .then(async () => {
                const newVideo = {
                    path: `../media/source/${v.videoId}.mp4`,
                    filename: `${v.videoId}.mp4`,
                    crop: v.crop
                };

                videos.push(newVideo)
            })
            .catch((e: any) => console.log(e));
    }

    console.log("[Stage 2] Форматирование роликов");

    for (let video of videos) {
        const pxTop = Math.ceil(1080 * (video.crop.top / 100));
        const pxBottom = Math.ceil(1080 * (video.crop.bottom / 100));

        await new Promise((resolve, reject) => {
            FFMPEG(path.join(__dirname, "../", video.path))
                .format('mp4')
                .fps(24)
                .videoBitrate('4500k')
                .videoCodec('libx264')
                .audioCodec('libmp3lame')
                .audioBitrate('128k')
                .complexFilter(`color=s=1920x1080:c=black[bg];[0:v]crop=w=iw:h=ih-${pxTop}-${pxBottom}:x=0:y=${pxTop}[crop1];[crop1]scale=-1:1080,setsar=1[v0];[bg][v0]overlay=(W-w)/2:0:shortest=1`) // overlay=(W-w)/2:(H-h)/2,crop=w=1920:h=1080
                .save(path.join(__dirname, '../../media/prepared/', video.filename))
                .on('end', function () {
                    console.log('Файл подготовлен:', video.filename);
                    resolve(true);
                }).on('error', function (err) {
                    console.log('Ошибка:', err);
                    reject(err);
                })
        });
    }

    console.log("[Stage 3] Склеивание роликов");

    const ffmpeg = FFMPEG();
    videos.forEach((video, i) => {
        ffmpeg.input(path.join(__dirname, '../../media/prepared/', video.filename));

        if (videos.length - 1 != i) {
            ffmpeg.input(path.join(__dirname, '../../media/common/transition.mp4'));
        }
    });

    return await new Promise((resolve, reject) =>
        ffmpeg
            .mergeToFile(path.join(__dirname, `../../media/result/${video.title}.mp4`))
            .on('end', function () {
                console.log('Файл успешно создан');
                resolve(path.join(__dirname, `../../media/result/${video.title}.mp4`));
            })
            .on('progress', function (info) {
                console.log(JSON.stringify(info));
            })
            .on('error', function (err) {
                console.log('Ошибка:', err.message);
            })
    );
}