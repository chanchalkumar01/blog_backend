import mongoose, { Schema, model, models, Document, Model } from 'mongoose';

export interface IRole extends Document {
    name: string;
}

export const roleSchema = new Schema<IRole>({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

const Role: Model<IRole> = models.Role || model<IRole>('Role', roleSchema);

export default Role;