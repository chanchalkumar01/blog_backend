import mongoose, { Schema, model, models, Document, Model } from 'mongoose';
import { IRole } from './role.model';

export interface IUser extends Document {
    username: string;
    email: string;
    password?: string;
    roles: IRole['_id'][];
}

export const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    roles: [{
        type: Schema.Types.ObjectId,
        ref: 'Role'
    }],
}, { timestamps: true });

const User: Model<IUser> = models.User || model<IUser>('User', userSchema);

export default User;
