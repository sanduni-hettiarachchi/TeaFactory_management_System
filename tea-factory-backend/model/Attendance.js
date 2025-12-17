const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
    date:{
        type: String, //format 'yyyy-m-d'
        required: true
    },
    employeeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    status:{
        type: String,
        enum: ["Present", "Absent", "Sick", "Leave"],
        default: null
    }

});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;