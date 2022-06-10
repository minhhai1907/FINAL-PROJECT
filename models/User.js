const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    avatarUrl: { type: String, require: false, default: "" },
    aboutMe: { type: String, require: false, default: "" },
    city: { type: String, require: false, default: "" },
    country: { type: String, require: false, default: "" },
    facebookLink: { type: String, require: false, default: "" },
    instagramLink: { type: String, require: false, default: "" },
    linkedinLink: { type: String, require: false, default: "" },
    twitterLink: { type: String, require: false, default: "" },
    postCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false, select: false },
    favourite:[{
      type:Schema.Types.ObjectId,
      ref:"Post"
    }]
  },
  { timestamps: true }
);

userSchema.plugin(require("./plugins/isDeletedFalse"));

userSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.password;
  delete obj.isDeleted;
  return obj;
};

userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return accessToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;









// const mongoose= require("mongoose");

// const userSchema= new mongoose.Schema({
//     name:{
//         type: String,
//         require:true,
//         trim: true
//     },
//     email:{
//         type: String,
//         require:true,
//         unique: true
//     }, 
//      password:{
//         type: String,
//         require:true,
        
//     },
//     role:{
//         type: Number,
//         default: 0
//     },
//     isDelete:{
//         type :Boolean,
//         default : false
//     }

// },{
//     timestamps:true
// })

// userSchema.methods.toJSON=function(){
//     const obj=this._doc;
//     delete obj.password;
//     delete obj.isDelete;
//     return obj;
// }

// module.exports=mongoose.model('Users',userSchema)