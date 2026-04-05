// controllers/mailController.js
import sendMail from "../utils/mailer.js";

export const sendMailHandler = async (req, res) => {
  const { email, company, name } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "Resume file missing ❌" });
  }
  try {
    await sendMail({
      email,
      company,
      name,
      filePath: req.file.path,
    });

    res.json({ message: "Mail sent ✅" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed you ❌", err });
  }
};
