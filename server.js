const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env variables
dotenv.config();

// Start app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Sample route
app.get('/', (req, res) => {
  res.send('Welcome to StackIt backend! 🎉');
});

// ✅ AUTH ROUTE HERE
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// ✅ Question ROUTE HERE

const questionRoutes = require("./routes/questionRoutes");
app.use("/api/questions", questionRoutes);

// ✅ Answer ROUTE HERE

const answerRoutes = require("./routes/answerRoutes");
app.use("/api/answers", answerRoutes);


// Run Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

