const mongoose = require('mongoose');
const Shema = mongoose.Schema;

const productSchema = new Shema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 2,
        maxlength: 80,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        maxlength: 500,
    },
    price: {
        type: Number,
        required: true,
        min: 1,
        max: 10000000,
    },
    image: {
        type: String,
        required: false,
        trim: true
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    category: {
        type: Shema.Types.ObjectId,
        ref: "category",
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model("Product", productSchema);