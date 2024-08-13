import express from 'express';
import cors from 'cors';
import { connect } from 'mongoose';
import Product from './models/Product.js';
import Email from './models/Email.js';
import nodemailer from 'nodemailer';
import 'dotenv/config';

const PORT = 3000;
// import throttle from 'throttle'; 
import rateLimit from 'express-rate-limit';

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
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

// Get 

app.get('/prod', async (req, res) => {
  try {
    const { sort, orderby = 'asc', limit } = req.query;

    let sortObject = {};

    if (sort) {
      sortObject[sort] = orderby === 'desc' ? -1 : 1;
    } 

    const products = await Product.find()
      .sort(sortObject)
      .limit( Number(limit))
      .select(["-__v", "-_id"]);

    res.json(products);
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
app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.deleteOne({ id });

    if (result.deletedCount > 0) {
      res.json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Failed' });
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
  },
});

async function sendMail(to, sub, msg) {
  try {
      const info = await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: to, 
          subject: sub, 
          text: msg, 
          //   html: `<b>${msg}</b>`, // html body
      });
      console.log("Message sent: %s", info.messageId);
  } catch (error) {
      console.error("Error sending email", error);
  }
}

app.post('/send-email', async (req, res) => {
  const { to, subject, message } = req.body;
  const email = new Email({ to, subject, message });
  try {
      await email.save();
      await sendMail(to, subject, message);
      res.status(200).send('Email sent successfully');
  } catch (error) {
      console.error('Failed', error);
      res.status(500).send('Failed to send email');
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

