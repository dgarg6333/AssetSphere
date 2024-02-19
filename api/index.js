import express  from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';

dotenv.config();

mongoose.connect(process.env.MONGO,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{console.log('database is connected')})
.catch((err)=>{console.log(err)});

const app = express();

app.use(express.json());

app.listen(3000,()=>{
    console.log('this is server side');
});

app.use('/api/route',userRoutes);
app.use('/api/auth',authRoutes);