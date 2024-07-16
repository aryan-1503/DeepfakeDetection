import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    predictions: [{
        type: mongoose.Types.ObjectId,
        ref: 'Prediction'
    }]
});

// Hash password before saving user
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const UserModel = model('User', UserSchema, 'users');

export { UserModel };
