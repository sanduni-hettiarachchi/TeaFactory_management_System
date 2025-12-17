const Employee = require("../model/Emplyee")
const Leave = require("../model/Leave")

const addLeave = async (req, res) => {
    try{
        const {userId, leaveType, startDate, endDate, reason} = req.body
        const employee = await Employee.findOne({userId})
        const newLeave = new Leave({
            employeeId: employee._id, leaveType, startDate, endDate, reason
        })

        await newLeave.save()

        return res.status(200).json({success: true})
    }catch(error){
        console.log(error)
        return res.status(500).json({success: false, error: "Leave add server error"})
    }
}

const getLeave = async (req, res) => {
    try {
        const {id, role} = req.params;
        let leaves
        if(role === "admin"){
            leaves = await Leave.find({employeeId: id})
        }else{
            const employee = await Employee.findOne({ userId: id });
            leaves = await Leave.find({ employeeId: employee._id });
        }
        // id here is expected to be the userId of the account linked to the employee
        // Find the employee document by its userId reference
        return res.status(200).json({success: true, leaves})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, error: "Leave get server error"})
    }
}

const getEmpLeave = async (req, res) => {
    try {
        const leaves = await Leave.find().populate({
            path: "employeeId",
            populate: [
                {
                    path: 'department',
                    select: 'dep_name'
                },
                {
                    path: 'userId',
                    select: 'name'
                }
            ]
        })
        return res.status(200).json({success: true, leaves})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, error: "Leave get server error"})
    }
}

const getLeaveDetails = async (req, res) => {
    try {
        const {id} = req.params;
        const leave = await Leave.findById({_id: id}).populate({
            path: "employeeId",
            populate: [
                {
                    path: 'department',
                    select: 'dep_name'
                },
                {
                    path: 'userId',
                    select: 'name && profileImage && email'
                }
            ]
        })
        return res.status(200).json({success: true, leave})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, error: "Leave get server error"})
    }
}

const updateLeave = async (req, res) => {
    try {
        const {id} = req.params;
        const leave =  await Leave.findByIdAndUpdate({_id: id}, {status: req.body.status})
        if(!leave){
             return res.status(404).json({ success: false, error: "leave not found for given userId" });
        }
        return res.status(200).json({success: true})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, error: "Leave update server error"})
    }
}

exports.updateLeave = updateLeave
exports.getLeaveDetails =getLeaveDetails
exports.getEmpLeave = getEmpLeave
exports.addLeave = addLeave
exports.getLeave = getLeave