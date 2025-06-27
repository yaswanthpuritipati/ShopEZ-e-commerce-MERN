const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');
const ordersRouter = require('./routes/orders');
const usersRouter = require('./routes/users');
const bannerRouter = require('./routes/banner');

const app = express();
const PORT = 5000;
const Mongodb = "mongodb://localhost:27017/shopezdb";

app.use(cors());
app.use(express.json());

// Serve uploads folder as static
app.use('/uploads', express.static('uploads'));

mongoose.connect(Mongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Running");
});

app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/users', usersRouter);
app.use('/api/banner', bannerRouter);


app.post('/', async (req, res) => {
  try {
    const { name, price, image, description, category } = req.body;
    const product = new Product({ name, price, image, description, category });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log("server is running on port 5000");
});

