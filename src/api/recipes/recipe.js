import mongoose, { Schema } from 'mongoose';

const { ObjectId } = Schema.Types;

const schema = new Schema({
    name: { type: String, required: true },
    servings: { type: Number, required: true },
    time: { type: Number },
    ingredients: [
	{
	    amount: { type: Number, required: true },
	    unit: { type: String },
	    name: { type: String, required: true }
	}
    ],
    instructions: { type: String }
});

export const Recipe = mongoose.model('Recipe', schema);

