const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    Name: {type:String, required: true},
    Email: {type:String, required: true},
    Phone: {type:String, required: true},
    Project: {type:String, required: true},
    Message: {type:String, required: true},
    date: {type:Date, default: Date.now},
});

module.exports = mongoose.model("Contact", contactSchema);