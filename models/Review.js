const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  order: { 
    type: Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true, 
    unique: true, 
    index: true 
  },
  reviewer: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  seller: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String, 
    trim: true 
  }
}, { 
  timestamps: true
});

module.exports = mongoose.model("Review", reviewSchema);
