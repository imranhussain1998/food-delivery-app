import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Not authorized ❌" });
  }

  const token = authHeader.split(" ")[1]; // Expecting: "Bearer <token>"
  // toke mera header me he uska format kuch is tarah he - Authorization me Bearer token 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.id }; // store userId inside req.user
    next();
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    return res.status(403).json({ success: false, message: "Invalid token ❌" });
  }
};

export default authMiddleware;

