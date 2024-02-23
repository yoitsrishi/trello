import { Request, Response, NextFunction } from 'express';
import { ExpressRequestInterface } from '../types/expressRequest.interface';
import BoardModel from '../models/board';

export const getBoards = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const boards = await BoardModel.find({ userId: req.user.id });
    return res.send(boards);
  } catch (err) {
    return next(err);
  }
};

export const createBoard = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const newBoard = new BoardModel({
      title: req.body.title,
      userId: req.user.id,
    });
    const savedBoard = await newBoard.save();
    return res.send(savedBoard);
  } catch (err) {
    return next(err);
  }
};
