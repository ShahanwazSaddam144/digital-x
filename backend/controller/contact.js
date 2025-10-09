const express = require("express");
const Contact = require("../Database/contact");

const router = express.Router();

router.post('/contact', async (req, res) => {
  const { Name, Email, Phone, Message } = req.body;

  if (!Name || !Email || !Phone || !Message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newContact = new Contact({ Name, Email, Phone, Message });
    await newContact.save();

    res.status(200).json({ message: '✅ Thank you for contacting us!' });
  } catch (err) {
    console.error('Contact Form Error:', err.message);
    res.status(500).json({ message: '❌ Server error. Please try again later.' });
  }
});

module.exports = router;
