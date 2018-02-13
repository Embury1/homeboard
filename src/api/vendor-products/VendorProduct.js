import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
    serial: { type: String, required: true },
    name: { type: String, required: true }
});

const vendorSchema = new Schema({
    prefix: { type: String, required: true },
    name: { type: String, required: true },
    products: [ productSchema ]
});

const Product = mongoose.model('VendorProduct', productSchema);
const Vendor = mongoose.model('Vendor', vendorSchema);

export { Product, Vendor };
