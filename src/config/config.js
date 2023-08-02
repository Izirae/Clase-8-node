import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  mongoSecret: process.env.MONGO_SECRET,
  jwtKey: process.env.JWT_KEY,
  gitClientId: process.env.PASSPORT_GIT_CLIENT_ID,
  gitClientsecret: process.env.PASSPORT_GIT_CLIENT_SECRET,
  githubCallbackPath: process.env.PASSPORT_CALLBACK_URL,
  passwordUser: process.env.PASSWORD_NEW_USER
};
