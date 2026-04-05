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
   const messageId = `<${Date.now()}${Math.random().toString(36).substring(7)}@gmail.com>`;
  let mail = [
    `From: "Raj Kumar Jha" <${process.env.EMAIL_USER}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `Message-ID: ${messageId}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    `Date: ${new Date().toUTCString()}`,
    "X-Mailer: Gmail-API-NodeJS",
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: 7bit",
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
<h3>Hi ${name || "Hiring Team"},</h3>

<p>I hope you're doing well.</p>

<p>I’m excited to apply for a <b>Frontend Developer (Fresher)</b> opportunity at <b>${company || "your company"}</b>. I have hands-on experience in React.js, JavaScript, HTML, and CSS, building responsive and user-friendly web applications.</p>

<p><b>Here is my key project:</b></p>

<ul>
  <li>
    Pizza Delivery Web App<br/>
    🔗 <a href="https://padre-gino-s-pizza.vercel.app">View Project</a>
  </li>
  <li>
    VaultTrack (Digital Asset Tracker)<br/>
    🔗 <a href="https://vault-track-a-crypto-app.vercel.app">View Project</a>
  </li>
</ul>

<p>Along with frontend development, I have experience with Git/GitHub, API testing using Postman, and strong skills in debugging, performance optimization, and cross-browser compatibility.</p>

<p>You can explore more of my work here:</p>

<ul>
  <li>GitHub: <a href="https://github.com/raj-7h">github.com/raj-7h</a></li>
  <li>LinkedIn: <a href="https://www.linkedin.com/in/raj-jha7h">linkedin.com/in/raj-jha7h</a></li>
</ul>

<p>Please find my resume attached. I would appreciate the opportunity to contribute and grow with your team.</p>

<p>Thank you for your time and consideration.</p>

<p>
Warm regards,<br/>
Raj Kumar Jha<br/>
📞 ${process.env.PHONE_USER} | ✉️ ${process.env.EMAIL_USER}
</p>
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
