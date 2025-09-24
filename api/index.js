import express  from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import assetRoutes from './routes/asset.route.js';
import cookieParser from 'cookie-parser';
import bookingRoutes from './routes/booking.route.js';
import instituteRoutes from './routes/institute.route.js';
import cors from 'cors';

dotenv.config();

// mongoose.connect(process.env.MONGO,{
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(()=>{console.log('database is connected')})
// .catch((err)=>{console.log(err)});

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000, // 30 seconds
        socketTimeoutMS: 45000, // 45 seconds
        maxPoolSize: 10
      });
      console.log('Database is connected');
    } catch (error) {
      console.error('Database connection failed:', error);
      process.exit(1);
    }
  };

  connectDB();


const app = express();
app.use(cors({
  origin: [
    'https://asset-sphere-frontend.vercel.app',
    'https://asset-sphere-frontend-git-main-deepanshu-gargs-projects.vercel.app',
    'https://asset-sphere-frontend-m5sontiln-deepanshu-gargs-projects.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));


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
