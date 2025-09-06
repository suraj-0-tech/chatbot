const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Initialize app
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/chatbotDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Schema + Model
const messageSchema = new mongoose.Schema({
  sender: String,
  text: String,
  timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model("Message", messageSchema);

// Fetch chat history
app.get("/messages", async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

// Handle user message
app.post("/send", async (req, res) => {
  const userText = req.body.text;

  // Save user message
  const userMsg = new Message({ sender: "user", text: userText });
  await userMsg.save();

  // Simple bot logic
  let botReply = "I didn’t understand that. 🤔";
  if (userText.toLowerCase().includes("hello")) botReply = "Hello! 👋 How can I help you?";
  if (userText.toLowerCase().includes("bye")) botReply = "Goodbye! 👋 Have a great day.";

  // Save bot message
  const botMsg = new Message({ sender: "bot", text: botReply });
  await botMsg.save();

  res.json({ reply: botReply });
});

// Start server
app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
