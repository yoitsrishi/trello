import { Request, Response, NextFunction } from 'express';
import { ExpressRequestInterface } from '../types/expressRequest.interface';
import ColumnModel from '../models/column';
import { Server } from 'socket.io';
import { Socket } from '../types/socket.interface';
import { SocketEventsEnum } from '../types/socketEvents.enum';
import { getErrorMessage } from '../helpers';
export const getColumns = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const columns = await ColumnModel.find({ boardId: req.params['boardId'] });
    return res.send(columns);
  } catch (err) {
    return next(err);
  }
};

export const createColumn = async (
  io: Server,
  socket: Socket,
  data: { boardId: string; title: string }
) => {
  try {
    if (!socket.user) {
      socket.emit(
        SocketEventsEnum.columnsCreateFailure,
        'User is not authorized'
      );
      return;
    }
    const newColumn = new ColumnModel({
      title: data.title,
      boardId: data.boardId,
      userId: socket.user.id,
    });

    const savedColumn = await newColumn.save();
    io.to(data.boardId).emit(
      SocketEventsEnum.columnsCreateSuccess,
      savedColumn
    );
    console.log('saveColumn', savedColumn);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    socket.emit(
      SocketEventsEnum.columnsCreateFailure,
      getErrorMessage(errorMessage)
    );
  }
};
