// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function verifyToken(req, res, next) {
  // Log whenever the middleware is called
  console.log("[DEBUG] verifyToken triggered...");

  // Check the Authorization header
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    console.log("[DEBUG] No valid Bearer token found in headers:", authHeader);
    return res.status(401).json({ error: 'Unauthorized, no token provided' });
  }

  // Extract the token (omit the "Bearer " prefix)
  const token = authHeader.split(' ')[1];
  console.log("[DEBUG] Found token:", token);

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("[DEBUG] JWT verification error:", err.message);
      return res.status(403).json({ error: 'Forbidden, invalid token' });
    }
    // If successful, log the decoded payload
    console.log("[DEBUG] Token decoded successfully:", decoded);
    // Attach decoded payload to req.user
    req.user = decoded;
    // Proceed to next middleware / controller
    next();
  });
}

function isAdmin(req, res, next) {
  console.log("[DEBUG] isAdmin check -> isAdmin?", req.user?.isAdmin);
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: 'Forbidden, admin access only' });
  }
  next();
}

module.exports = { verifyToken, isAdmin };
