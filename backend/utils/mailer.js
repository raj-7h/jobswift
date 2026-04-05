// utils/mailer.js
import fs from "fs";
import Brevo from "@getbrevo/brevo";

import "dotenv/config";

let defaultClient = Brevo.ApiClient.instance;
let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

let emailAPI = new Brevo.TransactionalEmailsApi();

const sendMail = async ({ email, company, filePath, name }) => {
  let message = new Brevo.SendSmtpEmail();

  message.subject = "Application for Frontend Developer Role";

  message.htmlContent = `
    <p>Hello ${name || "Hiring Team"},</p>

    <p>I hope you're doing well. I’m excited to apply for a Frontend Developer (Fresher) opportunity at ${company || "your company"}.</p>

    <p>I have hands-on experience in React.js, JavaScript, HTML, and CSS, building responsive and user-friendly web applications.</p>

    <p><b>Projects:</b></p>
    <ul>
      <li>Pizza Delivery Web App - https://padre-gino-s-pizza.vercel.app</li>
      <li>VaultTrack (Crypto Tracker) - https://vault-track-a-crypto-app.vercel.app</li>
    </ul>

    <p>GitHub: https://github.com/raj-7h</p>
    <p>LinkedIn: www.linkedin.com/in/raj-jha7h</p>

    <p>Thanks & Regards,<br/>Raj Kumar Jha<br/>📞 ${process.env.PHONE_USER} | ✉️ ${process.env.EMAIL_USER}</p>
    `;

  message.sender = {
    name: "Raj Jha",
    email: process.env.EMAIL_USER,
  };

  message.to = [{ email }];

  if (filePath) {
    message.attachment = [
      {
        content: fs.readFileSync(filePath).toString("base64"),
        name: "Raj_resume.pdf",
      },
    ];
  } else {
    throw new Error("Resume is required ❌");
  }

  try {
    const response = await emailAPI.sendTransacEmail(message);
    console.log("Email sent:", response.body);
  } catch (error) {
    console.error("Error sending email:", error.body || error);
  }
};

export default sendMail;
