const botProtection = (req, res, next) => {
  const userAgent = req.headers["user-agent"];

  // If no User-Agent or suspicious keyword matches...
  if (
    !userAgent ||
    /bot|crawl|spider|curl|wget|python|go-http/i.test(userAgent)
  ) {
    return res.status(403).json({ message: "Access denied for bots." });
  }

  next(); // ✅ Pass to the next middleware or route
};
module.exports = botProtection;