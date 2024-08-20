import express from "express";
import { router as userRouter } from "./routes/auth/user";
import { router as accountRouter } from "./routes/transactions/account";
import { router as recordRouter } from "./routes/records/record";
import { authenticate } from "./routes/auth/auth.middleware";

export default function () {
  const app = express();
  app.use(express.json());

  // app.use("/", (req, res) => {
  //   res.send("Welcome to express bank application");
  // });

  app.use(userRouter);
  app.use(authenticate, accountRouter);
  app.use(authenticate, recordRouter);

  return app;
}
