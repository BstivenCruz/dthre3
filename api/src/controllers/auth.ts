import { Request, Response, NextFunction } from "express";
import boom from "@hapi/boom";

import sendResponse from "../utils/sendResponse";

import * as User from "../models/user";
import * as Student from "../models/student";

import { loginSchema, registerSchema, idSchema } from "../schemas/auth";
import { comparePassword, generateToken } from "../utils/auth";

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.validate(req.body).value;

    const user = await User.getByEmail(email);
    if (!user) {
      return next(boom.unauthorized("Invalid email"));
    }

    if (!user.auth.passwordHash) {
      return next(boom.unauthorized("User account is not properly configured"));
    }

    const isValid = await comparePassword(password, user.auth.passwordHash);
    if (!isValid) {
      return next(boom.unauthorized("Invalid password"));
    }

    const token = generateToken({
      userId: user.user.id,
      email: user.user.email,
      role: user.user.role,
    });

    const { auth, ...userWithoutPassword } = user;

    const response = {
      user: userWithoutPassword,
      token,
    };

    sendResponse(req, res, response);
  } catch (e: any) {
    return next(boom.badImplementation(e));
  }
};

const upsert = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = registerSchema.validate(req.body).value;

    const user = await User.upsert(JSON.stringify(data));
    if (!user) {
      return next(boom.badImplementation("User not created"));
    }
    const token = generateToken({
      userId: user.user.id,
      email: user.user.email,
      role: user.user.role,
    });

    const response = {
      user: user,
      token: token,
    };

    sendResponse(req, res, response);
  } catch (e: any) {
    return next(boom.badImplementation(e));
  }
};

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = idSchema.validate(req.params).value;
    if (!userId) {
      return next(boom.badRequest("userId es requerido"));
    }

    const user = await User.getById(userId);
    if (!user) {
      return next(boom.notFound("Usuario no encontrado"));
    }

    const response: any = {
      user: user.user,
    };

    if (user.user.role === "estudiante") {
      const studentProfile = await Student.getByUserId(user.user.id);
      if (studentProfile) {
        response.studentProfile = studentProfile;
      }
    }

    return sendResponse(req, res, response);
  } catch (e: any) {
    return next(boom.badImplementation(e));
  }
};

export { login, upsert, getMe };
