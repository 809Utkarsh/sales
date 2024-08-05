const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SalesSchema = new Schema({
    quantity_sold: Number,
    selling_price: [Number],
    selling_date: [Date],
    status: [String],
    returned: Number,
    return_dates: [Date]
}, { _id: false });

const SpecificationsSchema = new Schema({
    screen_size: String,
    battery: String,
    camera: String,
    processor: String
}, { _id: false });

const ProductSchema = new Schema({
    product: String,
    brand: String,
    quantity: Number,
    buying_price: Number,
    selling_price: Number,
    buying_date: Date,
    status: String,
    specifications: SpecificationsSchema,
    sales: SalesSchema
}, { _id: false });

const SellerSchema = new Schema({
    seller_id: Number,
    seller_name: String,
    products: [ProductSchema]
});

module.exports = mongoose.model('Seller', SellerSchema);
