import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    name: { type: String, default: 'Unnamed device' },
    created: { type: Date, default: Date.now },
    connected: { type: Date, default: Date.now }
});

export const Device = mongoose.model('Device', schema);
