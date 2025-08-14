const JWT = require("jsonwebtoken");

// Middleware function to check for valid tokens
function tokenChecker(req, res, next) {
  let token;
  const authHeader = req.get("Authorization");

  if (authHeader) {
    token = authHeader.slice(7);
  }

  try {
    console.log("Token received:", token);
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    console.log("Decoded payload:", payload);
    const user_id = payload.sub;
    console.log("User ID from sub claim:", user_id);

    if (!user_id) {
      throw new Error("No sub claim in JWT token");
    }

    // Add the user_id from the payload to the Express req object.
    req.user_id = user_id;
    next();
  } catch (err) {
    console.log("Token verification error:", err);
    res.status(401).json({ message: "auth error" });
  }
}

module.exports = tokenChecker;
