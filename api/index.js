import express  from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import assetRoutes from './routes/asset.route.js';
import cookieParser from 'cookie-parser';
import bookingRoutes from './routes/booking.route.js';
import path from 'path';

dotenv.config();

mongoose.connect(process.env.MONGO,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{console.log('database is connected')})
.catch((err)=>{console.log(err)});

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(3000,()=>{
    console.log('this is server side');
});

app.use('/api/user',userRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/asset', assetRoutes);
app.use('/api/booking', bookingRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    const message=err.message || 'internal server error';
    res.status(statusCode).json({
        success:'false',
        statusCode,
        message
    })
});