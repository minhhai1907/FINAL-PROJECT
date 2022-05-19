const router=require('express').Router()
const cloudinary=require('cloudinary')
const { throwError } = require('../helpers/utils')
const auth=require('../middlewares/auth')
const authAdmin=require('../middlewares/authAdmin')
require("dotenv").config();
const fs=require('fs')
const { route } = require('.')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true
})


router.post('/upload',(req,res)=>{
    try {
        console.log(req.files)
        if(!req.files||Object.keys(req.files).length===0)
        throwError(400,"no file were upload")

        const file= req.files.file;
       
        if(file.size>1024*1024) {
            removeTmp(file.tempFilePath)
            throwError(400,"size too large")
        }
         
    if(file.mimetype!=="image/jpeg" && file.mimetype!=="image/png" ){
    removeTmp(file.tempFilePath)
     throwError(400,"file format is incorrect")
    }


     cloudinary.v2.uploader.upload(file.tempFilePath,{folder:"home"},async(err,result)=>{
        removeTmp(file.tempFilePath)
         if (err) throw err;
        
         res.json({public_id:result.public_id , url: result.secure_url})
               
     })

    } catch (error) {
        res.status(400).json({msg:error.message})
        
    }
})


router.delete('/destroy',(req,res)=>{
    try {
        const {public_id}=req.body
    if(!public_id) throwError(400,"no image selected")
    cloudinary.v2.uploader.destroy(public_id,(err,result)=>{
        if(err) throw err;
        res.json({msg:" deleted complete"})

    })
    } catch (error) {
        return res.status(400).json({msg:error.message})
    }
    
})

const removeTmp=(path)=>{
    fs.unlink(path,err=>{
        if (err) throw err
    })
}



module.exports=router