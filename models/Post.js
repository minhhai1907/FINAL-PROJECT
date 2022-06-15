const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User");

const postSchema = Schema(
  {
    image: { type: String, require: true },
    title: { type: String, default: "" },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    price:{
      type:Number,
      default:0
  },
  description:{
      type:String,
     default:""
  },
  category:{
    type:String,
    default:""
  },
  content:{
      type:String,
      default:""
  },
  commentCount: { 
    type: Number,
     default: 0
     },
  isDeleted: {
     type: Boolean, 
     default: false, 
     select: false 
    },
  
    // reactions: {
    //   like: { type: Number, default: 0 },
    //   dislike: { type: Number, default: 0 },
    // },
    
  },
  { timestamps: true }
);

postSchema.plugin(require("./plugins/isDeletedFalse"));

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
