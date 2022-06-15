
const match = require('nodemon/lib/monitor/match');
const { throwError } = require('../helpers/utils')
const Products=require('../models/productModel')

//filter,sorting and paginating
class APIfeatures{
    constructor(query,queryString){
        this.query=query;
        this.queryString=queryString;
    }
    filtering(){
        const queryObj={...this.queryString}//querystring=req.query

        const excludedFields=['page','sort','limit']
        excludedFields.forEach(e =>delete(queryObj[e]))

        let queryStr =JSON.stringify(queryObj)
        queryStr=queryStr.replace(/\b(gte|gt|lt|lte|$regex)\b/g,match=>'$'+match)
        this.query.find(JSON.parse(queryStr))
        return this;
    }
    sorting(){
        if(this.queryString.sort){
            const sortBy=this.queryString.sort.split(',').join(' ')
            this.query=this.query.sort(sortBy)
        }else{
            this.query=this.query.sort('-createAt')
        }
        return this;
    }
    paginating(){
        const page=this.queryString.page*1||1
        const limit=this.queryString.limit*1||5
        const offset=(limit)*(page-1)
        this.query=this.query.skip(offset).limit(limit)
        return this;
    }
}
const productCtrl={
   
    getAllProduct:async(req,res)=>{
        try {
            const features=new APIfeatures(Products.find(),req.query)
            .filtering().sorting().paginating()
            const products=await features.query
            res.json( products)
                // status:'success',
                // result:products.length,        
        } catch (err) {
            return res.status(500).json({msg:err.message})
        }
    },
// const productCtrl={
//     getAllProduct:async(req,res)=>{
//         try {
//                 const { page = 1, limit = 5, ...filter } = req.query;
//                 const filterCondition = [{ isDeleted: false }];
//                 const allows = [
//                     "title",
//                     "price",
//                     "description",
//                     "content",
//                     "images",
//                     "category"
//                 ];
//                 allows.forEach((field) => {
//                   if (filter[field] !== undefined) {
//                     filterCondition.push({
//                       [field]: { $regex: filter[field], $options: "i" },
//                     });
//                   }
//                 });
//                 const filterCriteria =
//                   filterCondition.length > 1
//                     ? { $and: filterCondition }
//                     : { isDeleted: false };
              
//                 console.log(filterCriteria);
//                 const totalProduct = await Products.countDocuments(filterCriteria);
//                 const totalPage = Math.ceil(totalProduct / limit);
//                 const offset = limit * (page - 1);

//            const products= await Products.find(filterCriteria)
//            .sort({ price: 1 })
//            .skip(offset)
//            .limit(limit)
//            res.json({products,totalProduct,totalPage})
          
//         } catch (err) {
//             return res.status(500).json({msg:err.message})
            
//         }
//     },
    createProduct:async(req,res)=>{
        try {
            const{product_id,title,price,description,content,images,category}=req.body;
            if(!images) throwError(400,"No images upload")
            const product= await Products.findOne({product_id})
            if(product) throwError(400,"this product already exist")
            const newProduct= new Products({
                product_id,title,price,description,content,images,category 
            })
            newProduct.save()
            res.json({msg:"created a product"})
        } catch (err) {
            return res.status(500).json({msg:err.message})
            
        }
    },
    deleteProduct:async(req,res)=>{
        try {
            await Products.findByIdAndDelete(req.params.id)
            res.json({msg:"delete a product"})
        } catch (err) {
            return res.status(500).json({msg:err.message})
            
        }
    },
    getSingleProduct:async(req,res)=>{
        try {
            const productId=req.params.id ;
            let product= await Products.findById(productId);
            if(!product) throwError(400,"product is not exist.")
            res.json(product)
            
        } catch (error) {
            return res.status(500).json({msg:error.message})
            
        }
    },
    updateProduct:async(req,res)=>{
        try {
            const {title,price,description,content,images,category}=req.body;
    

            const newProduct=await Products.findOneAndUpdate({_id: req.params.id},{
                title,price,description,content,images,category
            })
            newProduct.save()
        
            res.json({msg:"updated product"})
        } catch (err) {
            return res.status(500).json({msg:err.message})
            
        }
    }
}



module.exports=productCtrl