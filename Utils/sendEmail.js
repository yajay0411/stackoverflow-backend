import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

export const sendmail = ({ email, otpCode, value }) => {

    //testing of this send module is done on ethreal.email.com

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'alan.reichel@ethereal.email',
            pass: 'SvmeH9YsYBQ4YvRzgh'
        }
    });

    let mailOptions = {
        from: 'smtp.ethereal.email',
        to: email,
        subject: `OTP for ${value}`,
        text: `Your OTP is ${otpCode}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
}