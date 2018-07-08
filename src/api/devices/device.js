import mongoose from 'mongoose';

const schema = new mongoose.Schema({
	created: { type: Date, default: Date.now },
	connected: { type: Date, default: Date.now },
	settings: {
		name: { type: String, default: 'Unnamed device' },
		refs: [{
			type: String,
			required: true
		}]
	}
});

export const Device = mongoose.model('Device', schema);
