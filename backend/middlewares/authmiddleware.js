const jwt = require("jsonwebtoken");

//  VERIFY TOKEN
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded; // user data store
    next(); // next middleware handler 
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ADMIN ONLY
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

module.exports = { verifyToken, isAdmin };