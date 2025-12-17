const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const suplireSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    subject: {type: String, required: true},
    description: {type: String, required: true},
    vehicleType: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    status: { type: String, enum: ["Registered", "Unregistered"], default: "Unregistered" },
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
})

const Suplier = mongoose.model('Suplier',suplireSchema);
module.exports = Suplier;