import jwt from "jsonwebtoken";
import "dotenv/config";
export const verifyJWT = (req, res, next) => {
  let authHeader = req.headers['authorization'];

  const Token = authHeader && authHeader.split(" ")[1];
  if (!Token) {
    return res.status(401).json({
      error: "No access Token",
    });
  }
  jwt.verify(Token, process.env.SECRET_ACCESS_TOKEN_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({
        error: "Invalid Access Token",
      });
    }
    console.log(user);
    req.user = user.id;
    

   
    next();
  });

};
