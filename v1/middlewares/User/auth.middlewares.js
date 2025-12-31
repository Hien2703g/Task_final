const User = require("../../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies.tokenUser;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await User.findOne({ tokenUser: token }).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Attach user to request for later use
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
