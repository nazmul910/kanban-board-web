import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import AppError from "../utils/AppError";
import prisma from "../lib/prisma";
import config from "../config";

import {
  IJwtPayload,
  ILoginUser,
  IRegisterUser,
} from "./auth.interface";


const registerUser = async (payload: IRegisterUser) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (existingUser) {
    throw new AppError(409, "User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    config.SaltRounds
  );

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

const loginUser = async (payload: ILoginUser) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new AppError(401, "Invalid email or password");
  }

  const jwtPayload: IJwtPayload = {
    userId: user.id,
    email: user.email,
  };

  const accessToken = jwt.sign(
    jwtPayload,
    config.jwt.accessSecret,
    {
      expiresIn: config.jwt.accessExpiresIn,
    }
  );

  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return {
    user: userData,
    accessToken,
  };
};

const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user;
};

export const AuthService = {
  registerUser,
  loginUser,
  getCurrentUser,
};