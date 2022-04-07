import { Context } from 'koa'
import sha256 from 'sha256'
import Video, { ITiktokVideo } from '../models/Video'
import Channel from '../models/Channel'


const addVideoToRender = async (ctx: Context) => {
    const { channel: channelId, title="", videos=[], preview } = ctx.request.body;

    const channel = await Channel.findOne({ channelId });
    if (channel === null) {
        return ctx.throw(400, "Channel wasn`t found");
    }

    const videoTitle = title || `${channel.defaultVideoTitle} [${ channel.videoCounter + 1 }]`

    if (videos.length < 12) {
        return ctx.throw(400, "Videos compilation must contain at least 12 videos");
    }

    if (preview.indexOf("data:image/jpeg;base64") !== 0) {
        return ctx.throw(400, "Preview wasn`t sent");
    }

    const hash = sha256(videos.map((video: ITiktokVideo) => Number(video.videoId)).sort().join(''))

    const isVideoAlreadyExist = await Video.findOne({ hash });
    if (isVideoAlreadyExist !== null) {
        return ctx.throw(400, "Video already exist");
    }

    const newVideo = await Video.create({ title: videoTitle, preview, channel: channelId, videos, hash });
    if (newVideo === null) {
        return ctx.throw(400, "Error occurred");
    }

    channel.videoCounter += 1;
    await channel.save();

    ctx.body = {
        success: true,
        data: newVideo
    }
}

export {
    addVideoToRender
}