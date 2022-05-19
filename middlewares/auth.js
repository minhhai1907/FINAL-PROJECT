const jwt=require('jsonwebtoken')
const { throwError } = require('../helpers/utils')

const auth=(req,res,next)=>{
    try {
        const token=req.header("Authorization")
        if(!token) throwError(400,"invalid authentication")

        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
            if(err) throwError(400,"invalid authentication")

            req.user=user
            next()
        })
    } catch (error) {
        return res.status(400).json({msg:error.message})
    }
}
module.exports=auth