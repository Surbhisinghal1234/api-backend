// const express = require('express');
// const cors = require('cors');
// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('cloudinary').v2;
// const mongoose = require('mongoose');
// const Product = require('./models/Product');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'uploads',
//     format: async (req, file) => 'png',
//     public_id: (req, file) => file.originalname,
//   },
// });

// const upload = multer({ storage: storage });

// const username = process.env.MONGO_USERNAME;
// const password = encodeURIComponent(process.env.MONGO_PASSWORD);

// mongoose.connect(
//   `mongodb+srv://${username}:${password}@cluster0.3j0ywmp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
// ).then(() => {
//   console.log('Connected to MongoDB');
// }).catch((error) => {
//   console.error('MongoDB connection error:', error);
// });

// app.get('/', (req, res) => {
//   res.send('Welcome to my API!');
// });

// app.post('/api/products', upload.single('images'), async (req, res) => {

//   const itemData = req.body;
//   const item = new Product(itemData);
//   console.log("Data received");
//   try {
//     await item.save();
//     res.status(201).send(item);
//     console.log(item, "item");
//   } catch (e) {
//     res.status(400).send("Error saving data");
//     console.error(e);
//   }
// });

// app.listen(3000, () => {
//   console.log('Server started on port 3000');
// });

//.....................................................

// const express = require('express');
// const cors = require('cors');
// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('cloudinary').v2;
// const mongoose = require('mongoose');
// const Product = require('./models/Product');
// require('dotenv').config();

// const app = express();
// app.use(cors({
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   headers: ['Content-Type', 'Authorization']
// }));
// app.use(express.json());

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'uploads',
//     format: async (req, file) => 'png',
//     public_id: (req, file) => file.originalname,
//   },
// });

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

// const username = process.env.MONGO_USERNAME;
// const password = encodeURIComponent(process.env.MONGO_PASSWORD);

// mongoose.connect(
//   `mongodb+srv://${username}:${password}@cluster0.3j0ywmp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
// ).then(() => {
//   console.log('Connected to MongoDB');
// }).catch((error) => {
//   console.error('MongoDB connection error:', error);
// });

// // app.get('/', (req, res) => {
// //   res.send('Welcome to my api');
// // });

// app.get('/prod', async (req, res) => {
//   try {
//     const products = await Product.find().exec();
//     res.status(200).send(products);
//   } catch (e) {
//     console.error(e);
//     res.status(500).send("Error fetching products");
//   }
// });

// app.post('/products', upload.single('images'), async (req, res) => {
//   try {
//     const itemData = req.body;
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

// app.listen(3000, () => {
//   console.log('Server started on port 3000');
// });

//.....................................................

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

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

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  fileFilter(req, file, cb) {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

const username = process.env.MONGO_USERNAME;
const password = encodeURIComponent(process.env.MONGO_PASSWORD);

mongoose.connect(
  `mongodb+srv://${username}:${password}@cluster0.3j0ywmp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

app.get('/prod', async (req, res) => {
  try {
    const products = await Product.find().exec();
    res.status(200).send(products);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching products");
  }
});

app.post('/products', upload.single('images'), async (req, res) => {
  try {
    const itemData = req.body;
    itemData.image = req.file.path; // add image path to itemData
    const item = new Product(itemData);
    console.log("Data received");
    await item.save();
    res.status(201).send(item);
    console.log(item, "item");
  } catch (e) {
    console.error(e);
    res.status(400).send("Error saving data");
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});