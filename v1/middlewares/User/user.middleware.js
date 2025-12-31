const jwt = require("jsonwebtoken");

module.exports.verifyToken = (req, res, next) => {
  const token =
    req.cookies.access_token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Không có token",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.locals.user = decoded; // gắn user vào request
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Token không hợp lệ hoặc hết hạn",
    });
  }
};
