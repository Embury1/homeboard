import mongoose, { Schema } from 'mongoose';

const schema = new Schema({
    amount: { type: Number },
    unit: { type: String },
    name: { type: String, required: true },
    done: { type: Boolean },
    created: { type: Date, default: Date.now }
});

export const ShoppingListItem = mongoose.model('ShoppingListItem', schema);