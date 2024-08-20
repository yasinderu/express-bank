import { UserToken } from "./customTypes";

declare global {
  namespace Express {
    export interface Request {
      user: UserToken;
    }
  }
}

export {};
