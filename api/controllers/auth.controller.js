import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
  
    if (  !username ||  !email ||  !password ||  username === '' ||  email === '' ||  password === '') {
      return res.status(404).json({message:'all fields are required'});
    }
    
    const hassedPassword=bcryptjs.hashSync(password,10);

    const newUser = new User({
      username,
      email,
      password:hassedPassword,
    });
  
    try {
      await newUser.save();
      res.json('Signup successful');
    } catch (error) {
      next(error);
    }
  };