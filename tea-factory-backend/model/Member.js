const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
})

const Member = mongoose.model('Member',memberSchema);
module.exports = Member;