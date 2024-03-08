const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required : true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlenght: 50
    },
    description: {
        type: String,
        required : true,
        trim: true,
        maxlenght: 255
    },
})


module.exports = mongoose.model("category", categorySchema);