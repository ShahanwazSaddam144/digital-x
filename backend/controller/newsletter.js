const express = require('express');
const Newsletter = require('../Database/newsletter');

const router = express.Router();

router.post('/newsletter', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newNewsletter = new Newsletter({email});
    await newNewsletter.save();
    res.status(200).json({ message: '✅ Subscribed successfully!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: '❌ Server error.' });
  }
});



module.exports = router;
