// @ts-ignore
import SibApiV3Sdk from "sib-api-v3-sdk";
import fs from "fs";
import "dotenv/config";

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendMail = async ({ email, company, filePath, name }) => {
  if (!filePath) {
    throw new Error("Resume required ❌");
  }

  const sendSmtpEmail = {
    sender: {
      email: process.env.EMAIL_USER,
      name: "Raj Kumar Jha",
    },
    to: [
      {
        email: email,
      },
    ],
    subject: "Application for Frontend Developer Role",
    textContent: `Hello ${name || "Hiring Team"},

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
    attachment: [
      {
        name: "Raj_resume.pdf",
        content: fs.readFileSync(filePath).toString("base64"),
      },
    ],
  };

  return await apiInstance.sendTransacEmail(sendSmtpEmail);
};

export default sendMail;
