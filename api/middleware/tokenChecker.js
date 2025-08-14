const JWT = require("jsonwebtoken");

function tokenChecker(req, res, next) {
  const authHeader = req.get("Authorization") || "";
  let token = "";

  if (authHeader.toLowerCase().startsWith("bearer ")) {
    token = authHeader.slice(7).trim(); // after "Bearer "
  } else {
    token = authHeader.trim(); // allow raw token
  }

  if (!token) return res.status(401).json({ message: "auth error" });

  try {
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    req.user_id = payload.sub;

    if (!req.user_id) return res.status(401).json({ message: "auth error" });

    // optional: rotate token
    res.locals.token = JWT.sign({ sub: req.user_id }, process.env.JWT_SECRET, { expiresIn: "10m" });

    next();
  } catch (err) {
    return res.status(401).json({ message: "auth error" });
  }
}

module.exports = tokenChecker;