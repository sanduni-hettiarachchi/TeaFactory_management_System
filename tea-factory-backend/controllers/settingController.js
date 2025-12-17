const Admin = require("../model/model");
const bcrypt = require('bcrypt');

const changePassword = async (req, res) => {
    try {
        const {userId, oldPassword, newPassword} = req.body;

        const user = await Admin.findById({_id: userId})
        if(!user){
            return res.status(404).json({success: false, error: "user not found"})
        }

        const  isMatch = await bcrypt.compare(oldPassword, user.password)
        if(!isMatch){
            return res.status(404).json({success: false, error: "Wrong old password"})
        }

        const hashPassword = await bcrypt.hash(newPassword, 10)

        const newUser = await Admin.findByIdAndUpdate({_id: userId}, {password: hashPassword})
        
        return res.status(200).json({success:true})

    } catch (error) {
        return res.status(500).json({success: false, error: "Setting server error"})
    }
}

exports.changePassword = changePassword
