import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendMail = async () => {
    if (!email || !file) {
      toast.error("Email & Resume required ❌");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("company", company);
    formData.append("name", name);
    formData.append("resume", file);

    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/send`, formData);
      toast.success("Mail sent 🚀");

      setEmail("");
      setCompany("");
      setName("");
      setFile(null);
    } catch {
      toast.error("Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-gradient-to-br from-purple-600 to-blue-500">
      <Toaster />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-lg bg-white/20 p-5 sm:p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg text-white"
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-5 sm:mb-6 text-center">
          Job Mail Sender 🚀
        </h2>

        <motion.input
          whileFocus={{ scale: 1.03 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          type="text"
          placeholder="HR Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input text-base sm:text-lg md:text-lg"
        />

        <motion.input
          whileFocus={{ scale: 1.03 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          type="email"
          placeholder="HR Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input text-base sm:text-lg md:text-lg"
        />

        <motion.input
          whileFocus={{ scale: 1.03 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          type="text"
          placeholder="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="input text-base sm:text-lg md:text-lg"
        />

        <label className="flex flex-col items-center justify-center w-full mb-4 p-3 sm:p-4 border-2 border-dashed border-white/40 rounded-xl cursor-pointer hover:bg-white/10 transition text-center">
          <span className="text-sm mb-2">
            {file ? file.name : "Click to upload Resume 📄"}
          </span>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
        </label>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={sendMail}
          className="w-full py-2.5 sm:py-3 rounded-xl bg-white text-black font-semibold text-base sm:text-lg hover:scale-105 transition"
        >
          {loading ? "Sending..." : "Send Mail"}
        </motion.button>
      </motion.div>
    </div>
  );
}

export default App;
