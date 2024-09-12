import { Schema, model } from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';

const productSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: { 
    type: String,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  }
 

});

const Product = model('Product', productSchema);

export default Product;