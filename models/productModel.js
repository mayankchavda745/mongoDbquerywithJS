const mongoose = require('mongoose')

const BookSchema = mongoose.Schema(
    {
      item:String,
      qty:Number,
      tags:[String],
      dim_cm:[Number],
      address:Object
    }
);

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter a product name"]
        },
        quantity: {
            type: Number,
            required: true,
            default: 0
        },
        price: {
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true
    }
)

const restaurantSchema = mongoose.Schema({
    address: {
      building: String,
      coord: [Number],
      street: String,
      zipcode: String,
    },
    borough: String,
    cuisine: String,
    grades: [{
      date: Date,
      grade: String,
      score: Number,
    }],
    name: String,
    restaurant_id: String,
  });
  
const Product = mongoose.model('Product', productSchema);
const Books = mongoose.model('Books',BookSchema);
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = {
    Product,
    Books,
    Restaurant
};