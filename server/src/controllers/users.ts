import { NextFunction, Request, Response } from 'express';
import UserModel from '../models/user';
import { UserDocument } from '../types/user.interface';
import { Error } from 'mongoose';
import jwt from 'jsonwebtoken';
import { secret } from './../config';
import { ExpressRequestInterface } from '../types/expressRequest.interface';

const normalizeUser = (user: UserDocument) => {
  const token = jwt.sign({ id: user.id, email: user.email }, secret);
  return {
    email: user.email,
    username: user.username,
    id: user.id,
    token,
  };
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newUser = new UserModel({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });
    const savedUser = await newUser.save();
    return res.send(normalizeUser(savedUser));
  } catch (err) {
    if (err instanceof Error.ValidationError) {
      const messages = Object.values(err.errors).map((err) => err.message);
      return res.status(422).json(messages);
    }
    return next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email }).select(
      '+password'
    );
    const errors = { emailOrPassword: 'Incorrect email or Password' };
    if (!user) {
      return res.status(422).json(errors);
    }
    const isSamePassword = await user.validatePassword(req.body.password);

    if (!isSamePassword) {
      return res.status(422).json(errors);
    }
    return res.send(normalizeUser(user));
  } catch (err) {
    return next(err);
  }
};

export const currentUser = (req: ExpressRequestInterface, res: Response) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  return res.send(normalizeUser(req.user));
};
