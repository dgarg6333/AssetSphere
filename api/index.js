import express  from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import assetRoutes from './routes/asset.route.js';
import cookieParser from 'cookie-parser';
import bookingRoutes from './routes/booking.route.js';
import instituteRoutes from './routes/institute.route.js';

dotenv.config();

mongoose.connect(process.env.MONGO,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{console.log('database is connected')})
.catch((err)=>{console.log(err)});


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
app.use('/api/institute', instituteRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'AssetSphere Backend API is running!' });
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
