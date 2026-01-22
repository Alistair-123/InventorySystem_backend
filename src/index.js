import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from "path";
import { fileURLToPath } from "url";

import PersonnelRoute from './routes/PersonnelRoute/PersonnelRoute.js';
import AuthRoute from './routes/AuthRoute/AuthRoute.js';
import CategoryRoute from './routes/CatergoryRoute/CategoryRoute.js';
import BrandRoute from './routes/BrandRoute/BrandRoute.js';
import UnitRoute from './routes/UnitRoute/UnitRoute.js';
import OfficeRoute from './routes/OfficeRoute/OfficeRoute.js';
import AcquisitionRoute from './routes/AcquisitionType/AcquisitionType.js';
import ItemsRoute from './routes/ItemsRoute/ItemsRoute.js';

import { connectDb } from './db/db.js';

const app = express();
connectDb();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Inventory System API is running');
});

app.use('/api/personnel', PersonnelRoute);
app.use('/api/auth', AuthRoute);
app.use('/api/category', CategoryRoute);
app.use('/api/brand', BrandRoute);
app.use('/api/unit', UnitRoute);
app.use('/api/office', OfficeRoute);
app.use('/api/acquisitiontype', AcquisitionRoute);
app.use('/api/items', ItemsRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
