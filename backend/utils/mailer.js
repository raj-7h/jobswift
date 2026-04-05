import { google } from "googleapis";
import fs from "fs";
import path from "path";
import "dotenv/config";

const OAuth2 = google.auth.OAuth2;

// Create OAuth2 client
const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground",
);

// Set refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

// Create Gmail API instance
const gmail = google.gmail({ version: "v1", auth: oauth2Client });

// Helper to create raw email
const createMessage = ({ to, subject, message, filePath, fileName }) => {
  const boundary = "__BOUNDARY__";

  let mail = [
    `From: "Raj Kumar Jha" <${process.env.EMAIL_USER}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    `Date: ${new Date().toUTCString()}`,
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "",
    message,
    "",
  ];

  if (filePath) {
    const fileContent = fs.readFileSync(filePath).toString("base64");
    const filename = fileName || path.basename(filePath);

    mail.push(
      `--${boundary}`,
      "Content-Type: application/pdf",
      "Content-Transfer-Encoding: base64",
      `Content-Disposition: attachment; filename="${filename}"`,
      "",
      fileContent,
      ""
    );
  }

  
  mail.push(`--${boundary}--`);

  return Buffer.from(mail.join("\r\n"))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const sendMail = async ({ email, company, filePath, name, fileName }) => {
  if (!filePath) {
    throw new Error("Resume is required ❌");
  }

const message = `
Hi ${name || "Hiring Team"},

I hope you're doing well.

I’m excited to apply for a FRONTEND DEVELOPER (Fresher) opportunity at ${company || "your company"}. I have hands-on experience in React.js, JavaScript, HTML, and CSS, building responsive and user-friendly web applications.

Here is my key project:

Pizza Delivery Web App
https://padre-gino-s-pizza.vercel.app

Along with frontend development, I have experience with Git/GitHub, API testing using Postman, and strong skills in debugging, performance optimization, and cross-browser compatibility.

You can explore more of my work here:

GitHub: https://github.com/raj-7h
LinkedIn: https://www.linkedin.com/in/raj-jha7h

Please find my resume attached. I would appreciate the opportunity to contribute and grow with your team.

Thank you for your time and consideration.

Warm regards,
Raj Kumar Jha
📞 ${process.env.PHONE_USER} | ✉️ ${process.env.EMAIL_USER}
`;

  const rawMessage = createMessage({
    to: email,
    subject: "Application for Frontend Developer Role",
    message,
    filePath,
    fileName,
  });

  return gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: rawMessage,
    },
  });
};

export default sendMail;
