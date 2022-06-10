// const httpStatus = require("http-status");
// const { sendResponse, catchAsync } = require("../helpers/utils");
// const Product = require("../models/productModel");
// const productService = require("../services/product.service");

// const productController = {};

// productController.getAllProducts = catchAsync(async (req, res, next) => {
//   const products = await productService.getAllProducts(req.query, req.user);
//   return sendResponse(
//     res,
//     httpStatus.OK,
//     true,
//     products,
//     "",
//     "Get Products successfully"
//   );
// });

// productController.getProductById = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   const product = await productService.getProductById(id);
//   return sendResponse(
//     res,
//     httpStatus.OK,
//     true,
//     product,
//     "",
//     "get Product successfully"
//   );
// });

// productController.createProduct = catchAsync(async (req, res, next) => {
//   const product = await productService.createProduct(req.body);
//   return sendResponse(
//     res,
//     httpStatus.OK,
//     true,
//     product,
//     "",
//     "Create Product successfully"
//   );
// });

// productController.updateProductById = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   const product = await productService.updateProductById(id, req.body);

//   return sendResponse(
//     res,
//     httpStatus.OK,
//     true,
//     product,
//     "",
//     "Update Product successfully"
//   );
// });

// productController.deleteProductById = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   await productService.deleteProductById(id);

//   return sendResponse(
//     res,
//     httpStatus.OK,
//     true,
//     {},
//     "",
//     "Delete product successfully"
//   );
// });

// module.exports = productController;



























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
    // getAllProduct : catchAsync(async (req, res, next) => {
    //     let { page, limit } = { ...req.query };
    //     const userId = req.params.userId;
      
    //     const product = await Products.findById(userId);
    //     if (!user) throw new AppError(404, "User not found", "Get Posts Error");
      
    //     let userFriendIDs = await Friend.find({
    //       $or: [{ from: userId }, { to: userId }],
    //       status: "accepted",
    //     });
    //     if (userFriendIDs && userFriendIDs.length) {
    //       userFriendIDs = userFriendIDs.map((friend) => {
    //         if (friend.from._id.equals(userId)) return friend.to;
    //         return friend.from;
    //       });
    //     } else {
    //       userFriendIDs = [];
    //     }
    //     userFriendIDs = [...userFriendIDs, userId];
    //     console.log(userFriendIDs);
      
    //     page = parseInt(page) || 1;
    //     limit = parseInt(limit) || 10;
    //     const filterConditions = [
    //       { isDeleted: false },
    //       { author: { $in: userFriendIDs } },
    //     ];
    //     const filterCrireria = filterConditions.length
    //       ? { $and: filterConditions }
    //       : {};
      
    //     const count = await Post.countDocuments(filterCrireria);
    //     const totalPages = Math.ceil(count / limit);
    //     const offset = limit * (page - 1);
      
    //     const posts = await Post.find(filterCrireria)
    //       .sort({ createdAt: -1 })
    //       .skip(offset)
    //       .limit(limit)
    //       .populate("author");
      
    //     return sendResponse(res, 200, true, { posts, totalPages, count }, null, "");
    //   }),
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