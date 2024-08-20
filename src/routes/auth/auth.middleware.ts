import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { TransactionModel } from "../../models/account.model";

const SECRET_KEY: Secret = "jwt-secret";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers?.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    req.user = {
      id: decoded.id,
      username: decoded.username,
    };

    next();
  } catch (error) {
    res.status(401).send({ message: "Unauthorized" });
  }
};

export const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accountNumber } = req.body;
    const userId = req.user.id;
    const account = await TransactionModel.findByAccountNumber(accountNumber);

    if (userId != account.user_id) {
      throw new Error();
    }
    next();
  } catch (error) {
    res.status(401).send({ message: "User is not authorized" });
  }
};
