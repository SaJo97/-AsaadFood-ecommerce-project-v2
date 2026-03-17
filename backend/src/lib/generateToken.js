import jwt from "jsonwebtoken";
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userInfo: {
        _id: user._id,
        email: user.loginEmail,
        role: user.role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};
