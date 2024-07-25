import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { connect } from 'mongoose';
import Product from './models/Product.js';
import 'dotenv/config';

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  headers: ['Content-Type', 'Authorization']
}));
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    format: async (req, file) => 'png',
    public_id: (req, file) => file.originalname,
  },
});

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
//   fileFilter(req, file, cb) {
//     if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
//       cb(null, true);
//     } else {
//       cb(null, false);
//     }
//   }
// });

const username = process.env.MONGO_USERNAME;
const password = encodeURIComponent(process.env.MONGO_PASSWORD);

connect(
  `mongodb+srv://${username}:${password}@cluster0.3j0ywmp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error', error);
});

app.get('/prod', async (req, res) => {
  try {
    const products = await Product.find().select(["-__v", "-_id"]);
    console.log(products);
    res.status(200).send(products);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching products");
  }
});


// app.post('/products', upload.single('images'), async (req, res) => {
//   try {
//     const itemData = req.body;
//     itemData.image = req.file.path; // add image path to itemData
//     const item = new Product(itemData);
//     console.log("Data received");
//     await item.save();
//     res.status(201).send(item);
//     console.log(item, "item");
//   } catch (e) {
//     console.error(e);
//     res.status(400).send("Error saving data");
//   }
// });
app.post('/products', async (req, res) => {
  try {
    const { name,description, price, image } = req.body;

    if (!name || !price || !image || !description) {
      return res.status(400).send('Missing required fields');
    }
    const item = new Product({ name, price, image, description });
    await item.save();
    res.status(201).send(item);
  } catch (e) {
    console.error(e);
    res.status(400).send("Error saving data");
  }
});

app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updateResult = await Product.updateOne({ _id: id }, updateData);
    
    if (updateResult.matchedCount === 0) {
      return res.status(404).send('Product not found');
    }
    
    const updatedProduct = await Product.findById(id);
    res.status(200).send(updatedProduct);
  } catch (e) {
    console.error(e);
    res.status(400).send("Error updating product");
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});