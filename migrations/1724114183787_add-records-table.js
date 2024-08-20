/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.sql(`
        CREATE TABLE records (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            account_id INTEGER REFERENCES accounts(id),
            sender_acc_num VARCHAR(10),
            reciever_acc_num VARCHAR(10),
            trx_type VARCHAR(5) NOT NULL,
            amount NUMERIC NOT NULL DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.sql(`
        DROP TABLE records;
    `);
};
