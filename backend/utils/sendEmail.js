const nodemailer = require("nodemailer");

const sendEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "broxedit09@gmail.com",        
        pass: "gbsfftvysbuqskgf"           
      }
    });

    const mailOptions = {
      from: "yourgmail@gmail.com",
      to: email,
      subject: "OTP for Password Reset",
      text: `Your OTP is ${otp}`
    };

    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");
  } catch (error) {
    console.log("Email error:", error);
  }
};

module.exports = sendEmail;