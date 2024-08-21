import { pool } from "../db/pool";

export interface Account {
  id?: string;
  balance: string;
  accountNumber: string;
}

export interface NewAccount extends Account {
  userId: string;
}

class TransactionModel {
  static async findAll() {
    const { rows } = await pool.query("SELECT * FROM accounts");

    return rows;
  }

  static async findByAccountNumber(accountNumber: string) {
    const { rows } = await pool.query(
      `
        SELECT accounts.id as account_id, users.username, accounts.balance, accounts.account_number, accounts.user_id
        FROM accounts JOIN users ON users.id = accounts.user_id
        WHERE accounts.account_number = $1;
    `,
      [accountNumber]
    );

    return rows[0];
  }

  static async findByUserId(userId: string) {
    const { rows } = await pool.query(
      `
        SELECT accounts.id as account_id, users.username, accounts.balance, accounts.account_number, accounts.user_id
        FROM accounts JOIN users ON users.id = accounts.user_id
        WHERE accounts.user_id = $1;
    `,
      [userId]
    );

    return rows;
  }

  static async create(newAccount: NewAccount) {
    const { balance, accountNumber, userId } = newAccount;
    const { rows } = await pool.query(
      `
        INSERT INTO accounts (account_number, balance, user_id) VALUES ($1, $2, $3) RETURNING*;
    `,
      [accountNumber, balance, userId]
    );

    return rows[0];
  }

  static async subtractBalance(account: Account) {
    try {
      const { balance, accountNumber } = account;
      const { rows } = await pool.query(
        `
        UPDATE accounts SET balance = (balance - $1)
        WHERE account_number = $2 RETURNING*;
    `,
        [balance, accountNumber]
      );
      if (!rows.length) {
        throw new Error("error");
      }
      return rows[0];
    } catch (error) {
      throw new Error("error");
    }
  }

  static async addBalance(account: Account) {
    try {
      const { balance, accountNumber } = account;
      const { rows } = await pool.query(
        `
        UPDATE accounts SET balance = (balance + $1)
        WHERE account_number = $2 RETURNING*;
    `,
        [balance, accountNumber]
      );

      if (!rows.length) {
        throw new Error();
      }

      return rows[0];
    } catch (error) {
      throw new Error("error");
    }
  }
}

export { TransactionModel };
