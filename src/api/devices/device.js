import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    name: { type: String, default: 'Unnamed device' }
});

export const Device = mongoose.model('Device', schema);
