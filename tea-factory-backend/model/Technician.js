const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TechnicianSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
    },
    specialty: {
        type: String,
    },
    availability: {
        type: String,
    },
    work: {
        type: String,
    }
});

const Technician = mongoose.model("Technician", TechnicianSchema);
module.exports = Technician;