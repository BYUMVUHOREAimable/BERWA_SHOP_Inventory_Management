
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Get token from header
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'berwa_shop_secret');

    // Add user from payload
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token is not valid' });
  }
};

module.exports = authenticateToken;
