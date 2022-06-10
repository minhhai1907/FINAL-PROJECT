const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");
const Friend = require("../models/Friend");

// const match = require('nodemon/lib/monitor/match');
// const { throwError } = require('../helpers/utils')
// const Products=require('../models/productModel')

// class APIfeatures{
//   constructor(query,queryString){
//       this.query=query;
//       this.queryString=queryString;
//   }
//   filtering(){
//       const queryObj={...this.queryString}//querystring=req.query

//       const excludedFields=['page','sort','limit']
//       excludedFields.forEach(e =>delete(queryObj[e]))

//       let queryStr =JSON.stringify(queryObj)
//       queryStr=queryStr.replace(/\b(gte|gt|lt|lte|$regex)\b/g,match=>'$'+match)
//       this.query.find(JSON.parse(queryStr))
//       return this;
//   }
//   sorting(){
//       if(this.queryString.sort){
//           const sortBy=this.queryString.sort.split(',').join(' ')
//           this.query=this.query.sort(sortBy)

//       }else{
//           this.query=this.query.sort('-createAt')

//       }
//       return this;
//   }
//   paginating(){
//       const page=this.queryString.page*1||1
//       const limit=this.queryString.limit*1||5
//       const offset=(limit)*(page-1)
//       this.query=this.query.skip(offset).limit(limit)
//       return this;
//   }
// }



const postController = {};

const calculatePostCount = async (userId) => {
  const postCount = await Post.countDocuments({
    author: userId,
    isDeleted: false,
  });
  await User.findByIdAndUpdate(userId, { postCount: postCount });
};


// postController.getAllPosts=catchAsync(async (req, res, next) => {
//   const { page = 1, limit, ...filter } = req.query;
//   const filterCondition = [{ isDeleted: false }];
//   const allows = [
//     "title",
//     "price",
//     "description",
    
//   ];
//   allows.forEach((field) => {
//     if (filter[field] !== undefined) {
//       filterCondition.push({
//         [field]: { $regex: filter[field], $options: "i" },
//       });
//     }
//   });
//   const filterCriteria =
//     filterCondition.length > 1
//       ? { $and: filterCondition }
//       : { isDeleted: false };

//   console.log(filterCriteria);
//   const count = await Post.countDocuments(filterCriteria);
//   const totalPage = Math.ceil(count / limit);
//   const offset = limit * (page - 1);
//   // .sort({ createdAt: -1 })
//   const sort = filter.sort === "desc" ? 1 : -1;
//   const postList = await Post.find(filterCriteria)
//     .sort({ createdAt: sort })
//     .skip(offset)
//     .limit(limit)
//     .populate("authorId");
//   return sendResponse(
//     res,
//     200,
//     true,
//     { postList, count, totalPage },
//     null,
//     "get all post successful"
//   );
// });

postController.getPosts = catchAsync(async (req, res, next) => {
  
  let { page, limit } = { ...req.query };
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, "User not found", "Get Posts Error");

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;
  const filterConditions = [
    { isDeleted: false },
    
  ];
  const filterCrireria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await Post.countDocuments(filterCrireria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  const posts = await Post.find(filterCrireria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("author");

  return sendResponse(res, 200, true, posts, null, "");
});

postController.getPostByCurrentUser = catchAsync(async (req, res, next) => {
  
  let { page, limit } = {...req.query};
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, "User not found", "Get Posts Error");

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 3;
  const filterConditions = [
    { author: userId,
      isDeleted: false,
  },
  ];
  const filterCrireria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await Post.countDocuments(filterCrireria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  const posts = await Post.find(filterCrireria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("author");
  

  return sendResponse(res, 200, true,{posts,totalPages,count,page} , null, "");
});



postController.getSinglePost = catchAsync(async (req, res, next) => {
  let post = await Post.findById(req.params.id).populate("author");

  if (!post) throw new AppError(404, "Post not found", "Get Single Post Error");

  post = post.toJSON();
  post.comments = await Comment.find({ post: post._id }).populate("author");

  return sendResponse(res, 200, true, post, null, "Get single post success");
});

postController.createNewPost = catchAsync(async (req, res, next) => {
  const author = req.userId;
  const { content, image,price,description,title,category } = req.body;

  let post = await Post.create({
    content,
    author,
    image,
    price,
    description,
    title,
    category,
  });
  await calculatePostCount(author);
  post = await post.populate("author");

  return sendResponse(res, 200, true, post, null, "Create new post successful");
});

postController.updateSinglePost = catchAsync(async (req, res, next) => {
  const author = req.userId;
  const postId = req.params.id;

  const post = await Post.findById(postId);
  if (!post) throw new AppError(404, "Post not found", "Update Post Error");
  if (!post.author.equals(author))
    throw new AppError(400, "Only author can edit post", "Update Post Error");

  const allows = ["content", "image","description","title","price","category"];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      post[field] = req.body[field];
    }
  });

  await post.save();
  return sendResponse(res, 200, true, post, null, "Update Post successful");
});

postController.getCommentsOfPost = catchAsync(async (req, res, next) => {
  const productcId = req.params.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const product = Post.findById(productcId);
  if (!product)
    throw new AppError(404, "Post not found", "Create New Comment Error");

  const count = await Comment.countDocuments({ product: productcId });
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  const comments = await Comment.find({ product: productcId })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("author");

  return sendResponse(
    res,
    200,
    true,
    { comments, totalPages, count },
    null,
    ""
  );
});

postController.deleteSinglePost = catchAsync(async (req, res, next) => {
  const author = req.userId;
  const postId = req.params.id;

  const post = await Post.findByIdAndUpdate(
    { _id: postId, author: author },
    { isDeleted: true },
  
  );

  if (!post)
    throw new AppError(
      400,
      "Post not found or User not authorized",
      "Delete Post Error"
    );

  await calculatePostCount(author);

  return sendResponse(res, 200, true, post, null, "Delete Post successful");
});

module.exports = postController;
