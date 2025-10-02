import mongoose, { Schema, model, models, Document, Model } from 'mongoose';
import { slugify } from '../utils/slugify';

export interface IBlog extends Document {
    title: string;
    short_description: string;
    slug: string;
    content: string;
    author: mongoose.Schema.Types.ObjectId;
    comments: mongoose.Schema.Types.ObjectId[];
}

export const blogSchema = new Schema<IBlog>({
    title: {
        type: String,
        required: true
    },
    short_description: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

blogSchema.pre<IBlog>('save', function(next) {
    if (!this.slug) {
        this.slug = slugify(this.title);
    }
    next();
});

const Blog: Model<IBlog> = models.Blog || model<IBlog>('Blog', blogSchema);

export default Blog;