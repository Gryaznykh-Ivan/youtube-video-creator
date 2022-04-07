import mongoose, { Schema, Document } from 'mongoose';
import { IChannel } from './Channel';

export interface ICrop {
    bottom: number;
    top: number;
}

export interface ITiktokVideo {
    crop: ICrop;
    link: string;
    user: string;
    videoId: string;
}

export interface IVideo extends Document {
    title: string;
    videos: [ITiktokVideo];
    channel: IChannel["_id"];
    preview: string;
    hash: string;
    isProcessed: boolean;
}

const VideoSchema = new Schema<IVideo>({
    title: {
        type: String,
        required: true
    },
    channel: {
        type: Schema.Types.ObjectId,
        ref: 'Channel',
        required: true
    },
    preview: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        index: true,
        required: true
    },
    videos: [{
        crop: {
            top: Number,
            bottom: Number
        },
        link: String,
        user: String,
        videoId: String
    }],
    isProcessed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model<IVideo>('Video', VideoSchema);