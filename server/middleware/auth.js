const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // 1. Get token from the industry-standard Authorization header
  const authHeader = req.header("Authorization");

  // 2. Check if no token is present
  if (!authHeader) {
    return res.status(401).json({ error: "No token, authorization denied 🛑" });
  }

  // 3. Extract the actual token by removing the "Bearer " prefix
  const token = authHeader.replace("Bearer ", "");

  // 4. Verify the token mathematically
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach the decoded user payload to the request object
    req.user = decoded.user;

    // 6. Move on to the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).json({ error: "Token is not valid 🛑" });
  }
};
