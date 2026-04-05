// utils/mailer.js
import nodemailer from "nodemailer";
import "dotenv/config";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  connectionTimeout: 10000, // 10 seconds
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.SECRET_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Prevents SSL issues on cloud servers
  },
});

const sendMail = async ({ email, company, filePath, name }) => {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Application for Frontend Developer Role`,
    text: `Hello ${name || "Hiring Team"},

I hope you're doing well. I’m excited to apply for a Frontend Developer (Fresher) opportunity at ${company || "your company"}. I have hands on experience in React.js, JavaScript, HTML, and CSS, building responsive and user-friendly web applications.

Here are some of my key projects:

• Pizza Delivery Web App  
🔗 https://padre-gino-s-pizza.vercel.app  

• VaultTrack (Crypto Tracker)  
🔗 https://vault-track-a-crypto-app.vercel.app  

Along with frontend development, I have experience with Git/GitHub, API testing using Postman, and strong skills in debugging, performance optimization, and cross-browser compatibility.

You can explore more of my work here:  
• GitHub: https://github.com/raj-7h  
• LinkedIn: www.linkedin.com/in/raj-jha7h  

Please find my resume attached. I would appreciate the opportunity to contribute and grow with your team.

Thank you for your time and consideration.

Warm regards,  
Raj Kumar Jha  
📞 ${process.env.PHONE_USER} | ✉️ ${process.env.EMAIL_USER}`,
    attachments: filePath
      ? [
          {
            filename: "Raj_resume.pdf",
            path: filePath,
          },
        ]
      : (() => {
          throw new Error("Resume is required ❌");
        })(),
  });
};

export default sendMail;
