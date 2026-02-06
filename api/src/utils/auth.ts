import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { JWTResponse } from "../interfaces/auth";

const JWT_SECRET: string = process.env.JWT_SECRET || "fallback-secret";
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "7d";

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (payload: JWTResponse): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as SignOptions);
};

export const verifyToken = (token: string): JWTResponse => {
  return jwt.verify(token, JWT_SECRET) as JWTResponse;
};
