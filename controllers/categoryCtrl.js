const { throwError } = require('../helpers/utils')
const Category=require('../models/categoryModel')

const categoryCtrl={
    getCategories: async(req,res)=>{
        try {
           const categories=await Category.find()
           res.json(categories) 
        } catch (error) {
            return res.status(400).json({msg:error.message})
        }
        res.json({msg:"test Ctrl"})
    },
    createCategory: async (req,res)=>{
        try {
           //only admin(role===1) has right create, delete and update a category
           const {name}=req.body
           const category= await Category.findOne({name})
           if(category) throwError (400,"category is already exist")
            const newCategory= new Category({name})
            await newCategory.save()
            res.json({msg:"created a category"})
        } catch (err) {
            return res.status(400).json({msg: err.message})
        }
    },
    deleteCategory: async(req,res)=>{
        try {
            await Category.findByIdAndDelete(req.params.id)
            res.json({msg:"deleted a category"})
            
        } catch (err) {
            return res.status(400).json({msg: err.message})
            
        }
    },

    updateCategory: async(req,res)=>{
        try {
            const {name}=req.body
            await Category.findOneAndUpdate({_id:req.params.id},{name})
            res.json({msg:"updated success"})
            
        } catch (err) {
            return res.status(400).json({msg: err.message})
            
        }
    }

   
}
module.exports=categoryCtrl