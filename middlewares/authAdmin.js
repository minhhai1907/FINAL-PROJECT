const { throwError } = require('../helpers/utils')
const Users=require('../models/userModel')

const authAdmin = async(req,res,next)=>{
 try {
     //get user information
     const user=await Users.findOne({
         _id:req.user.id
     })
     if(user.role===0)
     throwError (400,"Admin resources access denied")
     next()
 } catch (error) {
     return res.status(400).json({msg:error.message})
 }
}
 module.exports=authAdmin