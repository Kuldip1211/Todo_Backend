const nodemailer = require('nodemailer');
const dotenv= require('dotenv') 
dotenv.config()

// Corrected authentication field to "pass"
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use any email service
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAILPASSWORD, // Correct field is "pass", not "password"
    },
});

const sendOtpEmail = (email, otp) => {
    const mailOptions = {
        from: String(process.env.EMAIL),
        to: email,
        subject: 'Your OTP Code',
        html: `<h1>${otp}</h1><br><h3>Welcome to out TOdo_app</h3>`,
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };
