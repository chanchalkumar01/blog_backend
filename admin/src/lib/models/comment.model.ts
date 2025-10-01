import mongoose, { Schema, model, models, Document, Model } from 'mongoose';

export interface IComment extends Document {
    content: string;
    author: mongoose.Schema.Types.ObjectId;
    blog: mongoose.Schema.Types.ObjectId;
}

export const commentSchema = new Schema<IComment>({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }
});

const Comment: Model<IComment> = models.Comment || model<IComment>('Comment', commentSchema);

export default Comment;