const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const path = require('path');
const app = require('./../server')


const User = require('./../model/userModel')



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'img/');
    },
    filename: (req, file, cb) => {
      const fileName = `profileImage_${Date.now()}${path.extname(file.originalname)}`;
      cb(null, fileName);
    }
  });
  
  const upload = multer({ storage });

  exports.uploadUserImage = upload.single('profileImage');


// User registration
exports.register = async (req, res) => {
    const { fullName, email, phoneNumber, password, confirmPassword } = req.body;
  
    
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
  
    try {
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
        
        const newUser = new User({
          fullName,
          email,
          phoneNumber,
          password: hashedPassword,
          profileImage: req.file ? req.file.filename : undefined
        });
  
       
        await newUser.save(); 
      
  
      res.status(201).json({ message: 'User registered successfully',newUser });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

  
  // User login
  exports.login =  async (req, res) => {
    const { email, password } = req.body;
  
    try {
     
      const user = await User.findOne({ email });
      console.log(user);
     
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      
      const passwordMatch = await bcrypt.compare(password, user.password);
  
     
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Incorrect password' });
      }
  
     
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN
        });

        const cookieOptions = {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
          ),
          httpOnly: true
        };

      res.cookie('jwt', token, cookieOptions);

      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  



  exports.isLoggedIn = async (req, res, next) => {
    const token = req.cookies.jwt;
    // console.log(token);
  
    if (!token) {
      return res.status(404).json({ message: 'Token not exits, Please loggin again!' });
    }
  
    try{
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

   
  const currentUser =  await User.findById(decoded.userId);
   if (!currentUser) {
    return res.status(404).json({ message: 'The user belonging to this token does no longer exist.' });
  }
    req.id = decoded.userId
    next();
  }catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


//Logout route

exports.logout =  async (req, res) => {

  res.clearCookie('jwt');
  
  res.status(200).json({ message: 'User logged out successfully' });
};