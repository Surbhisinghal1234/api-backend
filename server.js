import express from 'express';
import cors from 'cors';
import { connect } from 'mongoose';
import Product from './models/Product.js';
import 'dotenv/config';
const PORT = 3000;
// import throttle from 'throttle'; 
import rateLimit from 'express-rate-limit';

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  headers: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const username = process.env.MONGO_USERNAME;
const password = encodeURIComponent(process.env.MONGO_PASSWORD);

connect(
  `mongodb+srv://${username}:${password}@cluster0.3j0ywmp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error', error);
});

// Rate limiting

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  statusCode: 200,
  message: {
   status: 429,
   error: 'Too many requests from this IP, please try again later.'
  }
});

app.use(limiter);


// app.get('/prod', async (req, res) => {
//   try {
//     const products = await Product.find().select(["-__v", "-_id"]);
//     res.json(products);
//   } catch (error) {
//     console.error('Error', error);
//     res.status(500).json({ error: 'Failed' });
//   }
// });
app.get('/prod', async (req, res) => {
  try {
    const products = await Product.find().select(["-__v"]); 
    
    const updatedProducts = products.map((product, index) => {
      const { _id, ...rest } = product.toObject(); 
      return {
        id: index + 1, 
        ...rest
      };
    });

    res.json(updatedProducts);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Failed' });
  }
});

app.post('/products', async (req, res) => {
  try {
    const { id, name, price, description, image } = req.body;

    const user = new Product({id, name, price, description, image });

    await user.save();         
    res.json({ message: 'Products added successfully' });
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Failed' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

