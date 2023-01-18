import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendmail = async (req, res) => {
    const { email, otp } = req.body;

    // let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        service: "gmail",
        // host: "smtp.ethereal.email",

        // port: 587,
        // secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
            // user: testAccount.user,
            // pass: testAccount.pass,
        },
    });

    let mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "OTP for login",
        text: `Your OTP is ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error sending OTP", error });
    }
};