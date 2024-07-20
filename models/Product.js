import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  // name: {
  //   type: String,
  //   required: true,
  // },
  // price: {
  //   type: Number,
  //   required: true,
  // },
  // imagePublicId: {
  //   type: String,
  //   required: true,
  // }
         name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imagePublicId: {
    type: String,
    required: true,
  }

});

const Product = model('Product', productSchema);

export default Product;