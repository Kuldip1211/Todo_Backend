const { json } = require('body-parser');
const express = require('express');
const { RegisterUser, LoginUser, UpdateUser, VerifyOtp, GetID } = require('../cotroller/userController');
const router = express.Router();

// Define routes related to users
router.get('/profile', (req, res) => {
  res.json({
   message:"wel come to user profile"
  })
});

router.post("/register",RegisterUser)

router.post("/login",LoginUser)

router.post("/update",UpdateUser)

router.post("/verify",VerifyOtp)
router.get("/getid",GetID)

module.exports = router;