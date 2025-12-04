const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// app.use(cors({
//   origin: ["http://localhost:5173", "https://bee-better-u8io.vercel.app"],
//   credentials: true
// }));

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/habits', require('./routes/habitRoutes'));
app.use('/api/journals', require('./routes/journalRoutes'));

app.get('/', (req, res) => {
    res.send('BeeBetter API is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
