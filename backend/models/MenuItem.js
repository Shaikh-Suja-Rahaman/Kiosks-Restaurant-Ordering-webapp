import mongoose from "mongoose";

const MenuItemSchema = mongoose.Schema({
  name : {
    type : String,
    required : true,
    trim : true,
    unique : true
  },
  description : {
    type : String,
    required : true,
    trime : true
  },
  prices : {
    type : Number,
    required : true
  },
  category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  imageUrl: {
    type: String,
    required: false, // An image isn't strictly required
  },
  isAvailable: { //in case if my item is actually out of stock
    type: Boolean,
    default: true, // The item is available by default when created
  }


}, {
  timestamps : true
})

const MenuItem = mongoose.model('MenuItem', MenuItemSchema);

export default MenuItem