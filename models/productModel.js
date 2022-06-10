// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const paginate = require("./plugins/paginate.plugin");
// const autoPopulate = require("mongoose-autopopulate");
// const toJSON = require("./plugins/toJSON.plugin");
// const slug = require("mongoose-slug-updater");

// const productSchema = Schema(
//   {
//     title: { type: String, require: true },
//     imageUrls: [{ type: String }],
//     status: {
//       type: String
//     },
//     price: { type: Number, require: true, default: 0, min: 0 },
//     priceSale: { type: Number, default: 0 },
//     quantity: { type: Number, require: true, min: 0 },
//     descriptions: {
//       type: Schema.Types.ObjectId,
//       ref: "Descriptions",
//       default: null,
//     },
//     categoryId: { type: Schema.Types.ObjectId, ref: "Categories" },
//     attributeId: [{ type: Schema.Types.ObjectId, ref: "Attributes" }],
//     isDeleted: { type: Boolean, default: false },
//   },
//   {
//     timestamps: true, 
//   }
// );
// productSchema.plugin(toJSON);
// productSchema.plugin(paginate);
// productSchema.plugin(autoPopulate);
// productSchema.plugin(slug);

// productSchema.pre("save", function (next) {
//   let product = this;

//   //auto update status inventory
//   if (product.quantity === 0) {
//     product.inventoryStatus = "out of stock";
//   } else {
//     product.inventoryStatus = "available";
//   }

//   //auto calculate the price sale
//   if (product.isModified("discount") || product.isModified("price")) {
//     product.priceSale = parseFloat(
//       (product.price - (product.discount * product.price) / 100).toFixed(1)
//     );
//   }

//   next();
// });

// const Product = mongoose.model("Products", productSchema);
// module.exports = Product;







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