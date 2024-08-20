import express from "express";
import { TransactionModel } from "../../models/account.model";
import { authorize } from "../auth/auth.middleware";
import { pool } from "../../db/pool";
import { Record, RecordModel } from "../../models/record.model";

const router = express.Router();

router.get("/account/balance/:accountNumber", async (req, res) => {
  try {
    const { accountNumber } = req.params;

    const account = await TransactionModel.findByAccountNumber(accountNumber);
    res.status(200).send(account);
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

router.post("/account/create", async (req, res) => {
  try {
    const { id: userId } = req.user;
    const accountNumber = String(
      Math.floor(100000000 + Math.random() * 900000000)
    );
    const details = {
      balance: req.body.balance,
      accountNumber,
      userId,
    };

    const newAccount = await TransactionModel.create(details);

    res.status(200).send(newAccount);
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

router.post("/account/send", authorize, async (req, res) => {
  try {
    const { balance, accountNumber, recieverAccountNumber } = req.body;
    const { id } = req.user;
    const senderDetails = {
      balance,
      accountNumber: accountNumber,
    };
    const recieverDetails = {
      balance,
      accountNumber: recieverAccountNumber,
    };

    await pool.query("BEGIN");

    const senderAccount = await TransactionModel.subtractBalance(senderDetails);

    const recordOut: Record = {
      userId: id,
      accountId: senderAccount.id,
      senderAccNum: null,
      receiverAccNum: recieverAccountNumber,
      trxType: "out",
      amount: balance,
    };

    await RecordModel.create(recordOut);

    const recieverAccount = await TransactionModel.addBalance(recieverDetails);

    const recordIn: Record = {
      userId: recieverAccount.user_id,
      accountId: recieverAccount.id,
      senderAccNum: accountNumber,
      receiverAccNum: null,
      trxType: "in",
      amount: balance,
    };

    await RecordModel.create(recordIn);

    await pool.query("COMMIT");

    res.status(200).send(senderAccount);
  } catch (error) {
    await pool.query("ROLLBACK");
    res.status(500).send({ message: error });
  }
});

router.post("/account/withdraw", authorize, async (req, res) => {
  try {
    const { balance, accountNumber } = req.body;
    const details = {
      balance,
      accountNumber,
    };

    await pool.query("BEGIN");

    const updatedAccount = await TransactionModel.subtractBalance(details);

    const recordOut: Record = {
      userId: updatedAccount.user_id,
      accountId: updatedAccount.id,
      senderAccNum: null,
      receiverAccNum: null,
      trxType: "out",
      amount: balance,
    };

    await RecordModel.create(recordOut);

    await pool.query("COMMIT");
    res.status(200).send(updatedAccount);
  } catch (error) {
    await pool.query("ROLLBACK");
    res.status(500).send({ message: error });
  }
});

export { router };
