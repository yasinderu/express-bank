import { pool } from "../db/pool";

export interface Record {
  userId: string;
  accountId: string;
  senderAccNum: string | null;
  receiverAccNum: string | null;
  trxType: string;
  amount: number;
}

export class RecordModel {
  static async findByUserId(userId: string) {
    const { rows } = await pool.query(
      `SELECT records.id,
              users.username,
              records.account_id,
              records.amount, 
              records.created_at,
              accounts.account_number,
              records.sender_acc_num,
              records.reciever_acc_num,
              records.trx_type
      FROM records JOIN users ON records.user_id = users.id 
      JOIN accounts ON accounts.id = records.account_id
      WHERE records.user_id = $1;`,
      [userId]
    );

    return rows;
  }

  static async findAll() {
    const { rows } = await pool.query(
      `SELECT records.id,
              users.username,
              records.account_id,
              records.amount, 
              records.created_at,
              accounts.account_number,
              records.sender_acc_num,
              records.reciever_acc_num,
              records.trx_type
      FROM records JOIN users ON records.user_id = users.id 
      JOIN accounts ON accounts.id = records.account_id;`
    );

    return rows;
  }

  static async create(record: Record) {
    try {
      const {
        userId,
        accountId,
        senderAccNum,
        receiverAccNum,
        trxType,
        amount,
      } = record;
      const { rows } = await pool.query(
        `
            INSERT INTO records (
                user_id,
                account_id, 
                sender_acc_num, 
                reciever_acc_num, 
                trx_type, 
                amount)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING*;
        `,
        [userId, accountId, senderAccNum, receiverAccNum, trxType, amount]
      );

      if (!rows.length) {
        throw new Error();
      }

      return rows[0];
    } catch (error) {
      throw new Error();
    }
  }
}
