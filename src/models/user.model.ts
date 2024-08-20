import { pool } from "../db/pool";

class UserModel {
  static async findAll() {
    const { rows } = await pool.query(`
        SELECT id, username FROM users
    `);

    return rows;
  }

  static async create(username: string, password: string) {
    const { rows } = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username;",
      [username, password]
    );

    return rows[0];
  }

  static async findByUsername(username: string) {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    return rows[0];
  }
}

export { UserModel };
