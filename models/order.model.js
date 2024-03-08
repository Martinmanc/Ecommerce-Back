const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    total: {
        type: Number,
        required: true,
    },
    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    createAt: {
        type: Date,
        default: Date.now
    },
    status:{
        type: String,
        enum: ['PENDING', 'APPROVED', 'CANCELED'],
        default: 'PENDING'
    }
})

module.exports = mongoose.model("Order", OrderSchema)