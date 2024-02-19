import express  from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';

dotenv.config();

mongoose.connect(process.env.MONGO,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{console.log('database is connected')})
.catch((err)=>{console.log(err)});

const app = express();

app.listen(3000,()=>{
    console.log('this is server side');
});

app.use('/api/route',userRoutes);