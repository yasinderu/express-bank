import express from "express";
import { RecordModel } from "../../models/record.model";
import { authorize } from "../auth/auth.middleware";

const router = express.Router();

router.get("/records", async (req, res) => {
  try {
    const { id: userId } = req.user;
    const records = await RecordModel.findByUserId(userId);

    res.status(200).send(records);
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

router.get("/records/all", async (req, res) => {
  try {
    const records = await RecordModel.findAll();

    res.status(200).send(records);
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

export { router };
