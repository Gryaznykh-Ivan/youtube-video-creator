import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IChannel extends Document {
    channelId: number;
    title: string;
    defaultVideoTitle: string;
    defaultVideoDescription: string;
    videoCounter: number;
}

const ChannelSchema = new Schema<IChannel>({
    channelId: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    defaultVideoTitle: {
        type: String,
        required: true
    },
    defaultVideoDescription: {
        type: String,
        required: true
    },
    videoCounter: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

export default mongoose.model<IChannel>('Channel', ChannelSchema);