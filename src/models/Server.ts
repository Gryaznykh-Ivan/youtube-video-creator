import mongoose, { Schema, Document } from 'mongoose';

export interface IServer extends Document {
    status: string;
    processing: string | null; // Video title
}

const ServerSchema = new Schema<IServer>({
    status: {
        type: String,
        enum: ["FREE", "ENGAGED"],
        default: "FREE"
    },
    processing: {
        type: String,
        default: null
    }
}, { timestamps: true });

export default mongoose.model<IServer>('Server', ServerSchema);