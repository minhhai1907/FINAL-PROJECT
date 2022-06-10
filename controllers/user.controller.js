





const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const User = require("../models/User");
const Friend = require("../models/Friend");
const bcrypt = require("bcryptjs");
const { find, findById, findByIdAndUpdate } = require("../models/User");
const userController = {};

userController.register =catchAsync(async (req, res) => {
  let { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) throw new AppError(409, "User already exists", "Register Error");

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  user = await User.create({
    name,
    email,
    password,
  });
  const accessToken = await user.generateToken();

  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create user successful"
  );
});

userController.updateProfile = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user)
    throw new AppError(404, "Account not found", "Update Profile Error");

  const allows = [
    "name",
    "avatarUrl",
    "aboutMe",
    "city",
    "country",
    "facebookLink",
    "instagramLink",
    "linkedinLink",
    "twitterLink",
  ];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  await user.save();
  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Update Profile successfully"
  );
});

userController.getUsers = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  let { page, limit, ...filter } = { ...req.query };

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const filterConditions = [{ isDeleted: false }];
  if (filter.name) {
    filterConditions.push({
      ["name"]: { $regex: filter.name, $options: "i" },
    });
  }
  const filterCrireria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await User.countDocuments(filterCrireria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let users = await User.find(filterCrireria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  const promises = users.map(async (user) => {
    let temp = user.toJSON();
    temp.friendship = await Friend.findOne({
      $or: [
        { from: currentUserId, to: user._id },
        { from: user._id, to: currentUserId },
      ],
    });
    return temp;
  });
  const usersWithFriendship = await Promise.all(promises);

  return sendResponse(
    res,
    200,
    true,
    { users: usersWithFriendship, totalPages, count },
    null,
    ""
  );
});

userController.getSingleUser = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const userId = req.params.id;

  let user = await User.findById(userId);
  if (!user) throw new AppError(404, "User not found", "Get Single User Error");

  user = user.toJSON();
  user.friendship = await Friend.findOne({
    $or: [
      { from: currentUserId, to: user._id },
      { from: user._id, to: currentUserId },
    ],
  });
  // user.friends = await Friend.find(
  //   {
  //     $or: [
  //       { from: userId, status: "accepted" },
  //       { to: userId, status: "accepted" },
  //     ],
  //   },
  //   "-_id status message updatedAt"
  // );

  return sendResponse(res, 200, true, user, null, "");
});

userController.getCurrentUser = catchAsync(async (req, res, next) => {
  const userId = req.userId;


  const user = await User.findById(userId);
  if (!user)
    throw new AppError(400, "User not found", "Get Current User Error");

  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Get current user successful"
  );
});
userController.deleteProfile = catchAsync(async (req, res, next) => {
  // const { currentUserId } = req;
  // const userId = req.params.id;
  const currentUserId = req.userId;
  let user = await User.findOne(
    { _id: currentUserId, isDeleted: false },
    "+isDeleted"
  );
  if (!user) throwError(404, "User not found", "deactivate Account error");
  user.isDeleted = true;
  await user.save();

  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "delete account successful"
  );
});
userController.putFavourite=catchAsync(async (req, res, next) => {

  const userId=req.userId;
  const id=req.params.id;
  const user= await User. findByIdAndUpdate(userId,{
    $push:{
      favourite:id
    }
  })
   await user.save()

  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "add favourite item successful"
  );
});

module.exports = userController;



















// const Users=require('../models/userModel');
// const bcryptjs=require("bcryptjs")
// const jwt=require("jsonwebtoken");
// const { throwError,sendResponse } = require('../helpers/utils');

// const userCtrl={
//     register:async(req, res)=>{
//         try {
//             const {name,email,password}=req.body;
//             if(!name||!email||!password){
//                 throwError(404,"Missing info","Login error")
//             }
//             const user=await Users.findOne({email})
//             if(user) throwError(404,"email is already exist.","Login error")

//             if(password.length<6)
//             throwError(400,"password is at least 6 character long","Login error")
            

//             //password encryption
//             const passwordHash=await bcryptjs.hash(password,10)
//             const newUser= new Users({
//                 name,email,password:passwordHash
//             })

//             //save mongoDB

//              await newUser.save()

//              //create accessToken to authentication
//              const accesstoken=createAccessToken({id:newUser._id})
//              const refreshtoken=createRefreshToken({id:newUser._id})

//              res.cookie('refreshtoken',refreshtoken,{
//                  httpOnly:true,
//                  path:'/user/refresh_token'
//              })
//           sendResponse(res,200,{accesstoken},null,"creat user success!")
            
            
//         } catch (error) {
//             return res.status(400).json({msg:error.message})
            
//         }
//       },
//     login: async(req,res)=>{
//         try {
//             const {email,password}=req.body;
//             const user=await Users.findOne({email})
//             if(!user) throwError(400,"email does not exist.")
             
//             const isMath=await bcryptjs.compare(password,user.password)
//             if(!isMath) throwError(400,"invalid password")
//             // create accessToken
//             const accessToken=createAccessToken({id:user._id})
//             sendResponse(res,200,{accessToken,user},null,"login success!")


//         } catch (error) {
//             // throwError(400,"invalid infor","login error")
//             return res.status(400).json({msg:error.message})
//         }
       

//     },
//     logout:async(req,res)=>{
//         try {
//             res.clearCookie('refreshtoken',{path:'/user/refresh_token'})
//             return res.json({msg:"logged out"})
            
//         } catch (error) {
//             return res.status(400).json({msg:error.message})
//         }

//     },
//     refreshToken:(req,res)=>{
//         try {
//             const rf_token=req.cookies.refreshtoken;
//             if(!rf_token) throwError(400,"please login or register")
//             jwt.verify(rf_token,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
//                 if(err) throwError(400,"please login or register")
//                 const accessToken=createAccessToken({id:user.id})
//                 res.json({accessToken})
                
//             })
//               // res.json({rf_token})
//         } catch (error) {
//             return res.status(400).json({msg:error.message})
            
//         }
        
      
//     },
//     getUser:async(req,res)=>{
//         try {
//             // const user= await Users.findById(req.user.id).select('-password')
//             const user= await Users.findById(req.user.id)
//             if(!user) throwError(400,"user does not exist")

//             // res.json(req.user)//lay ID
//             res.json(user)
//         } catch (error) {
//             return res.status(400).json({msg:error.message})
//         }
//     },
//     getAllUsersList: async(req,res)=>{
       
//         try {
//             const { page = 1, limit = 5, ...filter } = req.query;
//                 const filterCondition = [{ isDeleted: false }];
//                 const allows = [
//                     "name",
//                     "email",
//                     "role"
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
//                 const total = await Users.countDocuments(filterCriteria);
//                 const totalPage = Math.ceil(total / limit);
//                 const offset = limit * (page - 1);
//                 const sort = filter.sort === "desc" ? 1 : -1;

//            const users= await Users.find(filterCriteria)
//            .sort({createdAt:-1})
//            .skip(offset)
//            .limit(limit)
//         //    .populate("authorId");
//            res.json({users,total,totalPage})
//         } catch (err) {
//             return res.status(500).json({msg:err.message})
//         }
//     }

// }
// const createAccessToken=(user)=>{
//     return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'})
// }
// const createRefreshToken=(user)=>{
//     return jwt.sign(user,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d'})
// }

// module.exports=userCtrl