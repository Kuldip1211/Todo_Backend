const User = require("../schema/userSchema");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { sendOtpEmail } = require("../utils/mail");
const dotenv= require('dotenv') 
dotenv.config()

// temporary otp store
const otpStore = {}; 

// ragister user

const RegisterUser = async (req, res) => {
  const { name, email, password } = req.body;
  
  const hashpassword = Number(process.env.HASHPASSWORD);
  const newpassword = await bcrypt.hash(password,hashpassword);

  const newu = await User.findOne({ email });

  if (newu) {
    return res.json({
      message: "User already exists",
    });
  }

  const newUser = await User.create({ name, email, password: newpassword });

  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

  otpStore[email] = {
    otp,
    expiresIn: Date.now() + 5 * 60 * 1000, // OTP expires in 5 minutes
  };

  await sendOtpEmail(email, otp);


  res.json({
    massage: "success otp sent succsefully go to verify",
  });

};


// login user
const LoginUser = async (req, res) => {
 
  const { email, password } = req.body;

  // Find the user by email
  const newUser = await User.findOne({ email });

  // Check if user exists
  if (!newUser) {
    return res.status(400).json({ message: "User not found." });
  }

  // Compare the password
  const isPasswordMatch = await bcrypt.compare(password, newUser.password);

  // If the password is incorrect
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "Invalid email or password." });
  }

  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

  otpStore[email] = {
    otp,
    expiresIn: Date.now() + 5 * 60 * 1000, // OTP expires in 5 minutes
  };

  await sendOtpEmail(email, otp);


  res.send({
    massage: "welcomeback successfully otp sent ton your mail"
  })
};

const UpdateUser = async (req, res) => {
  const cook = req.cookies;

  if (!cook) {
      return res.json({
          message: "First register and login",
      });
  }

  try {
      // Verify the token using the promisified jwt.verify
      const decoded = await jwt.verify(cook, "kuldeep");

      // Extract the 'id' from the decoded token (assumes it's in the payload)
      const id = decoded;

      console.log(id);
      if (!id) {
          return res.status(400).json({
              message: "ID not found in token",
          });
      }

      // Destructure the data from req.body
      const { name, email, password } = req.body;

      // Find the user by ID and update
      const updatedUser = await User.findByIdAndUpdate(
          id, 
          { name, email, password }, 
          { new: true } // This option returns the updated document
      );

      if (!updatedUser) {
          return res.status(404).json({
              message: "User not found",
          });
      }

      // Send the updated user as the response
      return res.json({ updatedUser });
      
  } catch (err) {
      // Handle both JWT verification and database errors
      return res.status(500).json({
          message: err.message || 'Server error',
      });
  }
};

// otp varification

const VerifyOtp = async(req, res) => {
  const { email, otp } = req.body;

  const newu = await User.findOne({ email });


  
  // Check if the OTP exists for the given email
  if (!otpStore[email]) {
    return res.status(400).json({ message: "OTP not found or expired." });
  }

  // Check if OTP is correct and hasn't expired
  const { otp: storedOtp, expiresIn } = otpStore[email];

  if (storedOtp !== otp) {
    return res.status(400).json({ message: "Invalid OTP." });
  }

  if (Date.now() > expiresIn) {
    return res.status(400).json({ message: "OTP has expired." });
  }

 

  // const uid = newone.id;

  const uid =newu.id


  // OTP is valid, generate JWT token
  const token = jwt.sign({ _id: uid },process.env.JWTSECRET, { expiresIn: '1h' });
  ; // Set token expiration time (1 hour here)

  // // Set the token in a cookie (HTTPOnly for security)
  res.cookie('authToken', token, {
    httpOnly: true, // Prevents JavaScript access
    secure:'production', // Use true in production
    maxAge: 60 * 60 * 1000, // 1 hour expiration
    sameSite: 'Lax', // Adjust as needed
  });
  

  // Send success response
  res.status(200).json({ message: "OTP verified" });

  // Optionally: Delete the OTP from the store after successful verification
  delete otpStore[email];
};








const GetID = async (req, res) => {
  const cook = req.cookies.authToken;

  if (!cook) {
    return res.json({
      message: "First register and login",
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(cook, process.env.JWTSECRET);

    // Access the ID from the decoded token
    const userId = decoded._id; // Ensure you access the correct property

    if (!userId) {
      return res.status(400).json({
        message: "ID not found in token",
      });
    }

    // Send the user ID as the response
    return res.json({ userId });
    
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token or token expired",
    });
  }
};

// Export the function using module.exports
module.exports = { RegisterUser, LoginUser, UpdateUser,VerifyOtp,GetID };
