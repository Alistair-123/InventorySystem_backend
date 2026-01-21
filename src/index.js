import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import PersonnelRoute from './routes/PersonnelRoute/PersonnelRoute.js';
import AuthRoute from './routes/AuthRoute/AuthRoute.js';
import CategoryRoute from './routes/CatergoryRoute/CategoryRoute.js';
import BrandRoute from './routes/BrandRoute/BrandRoute.js'
import UnitRoute from './routes/UnitRoute/UnitRoute.js'
import OfficeRoute from './routes/OfficeRoute/OfficeRoute.js'
import AcquisitionRoute from './routes/AcquisitionType/AcquisitionType.js'
import ItemsRoute from './routes/ItemsRoute/ItemsRoute.js'
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
app.use('/api/brand', BrandRoute)
app.use('/api/unit', UnitRoute)
app.use('/api/office', OfficeRoute)
app.use('/api/acquisitiontype', AcquisitionRoute)
app.use('/api/items', ItemsRoute)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



