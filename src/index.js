import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import PersonnelRoute from './routes/PersonnelRoute/PersonnelRoute.js';
import AuthRoute from './routes/AuthRoute/AuthRoute.js';
import CategoryRoute from './routes/CatergoryRoute/CategoryRoute.js';
const app = express();

import {connectDb} from './db/db.js';
connectDb();

// eslint-disable-next-line no-undef
const PORT = process.env.PORT;
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json(), cookieParser());

app.get('/', (req, res) => {
  res.send('Inventory System API is running');
});

app.use('/api/personnel', PersonnelRoute);
app.use('/api/auth', AuthRoute);
app.use('/api/category', CategoryRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



