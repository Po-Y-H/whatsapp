import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { Database } from 'sqlite3';

// Open the SQLite database (this will create the file if it doesn't exist)
const initializeDB = async (): Promise<void> => {
  try {
    const db = await open({
      filename: './mydatabase.db', // You can specify the path where the DB should be created
      driver: sqlite3.Database
    });

    console.log("Connected to SQLite database.");

    // Create the "Message" table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS Message (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phoneNumberId TEXT,
        "from" TEXT,
        "to" TEXT,
        body TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Message table created or already exists.");

    await db.close();

  } catch (err) {
    console.error("Error initializing database:", err);
  }
};

// // Function to insert a new message into the database
// const insertMessage = async (message: { phoneNumberId: string; from: string; to: string; body: string }): Promise<void> => {
//   const db = await open({
//     filename: './mydatabase.db',
//     driver: sqlite3.Database,
//   });

//   await db.run(`
//     INSERT INTO Message (phoneNumberId, "from", "to", body)
//     VALUES (?, ?, ?, ?)
//   `, [
//     message.phoneNumberId,
//     message.from,
//     message.to,
//     message.body,
//   ]);

//   await db.close();
// };

// const getAllMessages = async (): Promise<any[]> => {
//     const db = await open({
//     filename: './mydatabase.db',
//     driver: sqlite3.Database,
//   });
//   const messages = await db.all(`SELECT * FROM Message`);
//   return messages;
// };

export { initializeDB };
