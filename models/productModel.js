

const mongoose=require('mongoose')
const productSchema= new mongoose.Schema({
    product_id:{
        type: String,
        unique:true,
        trim:true,
        require:true
    },
    title:{
        type:String,
        trim:true,
        require:true
    },
    price:{
        type:Number,
        trim:true,
        require:true
    },
    description:{
        type:String,
        trim:true,
        require:true
    },
    content:{
        type:String,
        trim:true,
        require:true
    },
    images:{
        type:Object,
        require:true
    },
    category:{
        type:String,
        trim:true,
        require:true
      
    },
    isDeleted: { 
        type: Boolean,
        default: false 
    }
   
},{
    timestamps:true
})

module.exports=mongoose.model("Products",productSchema)