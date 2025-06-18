import jwt from "jsonwebtoken";

const generateAccessToken = async (userId, role, email) => {
  const token = await jwt.sign(
    { id: userId, role: role, email: email },
    process.env.SECRET_KEY_ACCESS_TOKEN,
    {
      expiresIn: "900s"
    }
  );
  return token;
};

export default generateAccessToken;
