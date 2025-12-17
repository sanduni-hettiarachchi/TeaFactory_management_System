const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MaintenanceSchema = new Schema({
    machineName: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        
        required: true
    },
    date: {
        type: Date,
        required: true,
       
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
       
       required: true
    }
});

const Maintenance = mongoose.model("Maintenance", MaintenanceSchema);
module.exports = Maintenance