import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    name: String
});

export const Device = mongoose.model('Device', schema);
