import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
	_id: { type: String },
	tags: [
		{
			vendor: { type: String },
			barcode: { type: String }
		}
	]
});

const Product = mongoose.model('Product', productSchema);

export { Product };
