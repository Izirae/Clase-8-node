import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from "bcrypt";

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validatePassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["coderCookie"];
  }
  return token;
};