import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { Database } from 'sqlite3';
import {Message, OutgoingMessage} from '../src/models/message'

// Function to insert a new message into the database
const insertIncomingMessage = async (message: Message): Promise<void> => {
  const db = await open({
    filename: './mydatabase.db',
    driver: sqlite3.Database,
  });

  await db.run(`
    INSERT INTO Message (phoneNumberId, "from", "to", body)
    VALUES (?, ?, ?, ?)
  `, [
    message.phoneNumberId,
    message.from,
    null,
    message.body,
  ]);

  await db.close();
};

const insertOutgoingMessage = async (outgoingMessage: OutgoingMessage): Promise<void> => {
    const db = await open({
      filename: './mydatabase.db',
      driver: sqlite3.Database,
    });
  
    await db.run(`
      INSERT INTO Message (phoneNumberId, "from", "to", body)
      VALUES (?, ?, ?, ?)
    `, [
      null,
      null,
      outgoingMessage.to,
      outgoingMessage.body,
    ]);
  
    await db.close();
  };
  
const getAllMessages = async (): Promise<any[]> => {
    const db = await open({
    filename: './mydatabase.db',
    driver: sqlite3.Database,
  });
  const messages = await db.all(`SELECT * FROM Message`);
  return messages;
};


const getAllReceivedMessages = async (): Promise<any[]> => {
    const db = await open({
    filename: './mydatabase.db',
    driver: sqlite3.Database,
  });
  const messages = await db.all(`SELECT * FROM Message WHERE "to" IS NULL`);
  return messages;
};

const getAllSentMessages = async (): Promise<any[]> => {
    const db = await open({
    filename: './mydatabase.db',
    driver: sqlite3.Database,
  });
  const messages = await db.all(`SELECT * FROM Message WHERE "from" IS NULL`);
  return messages;
};


export {getAllReceivedMessages, getAllSentMessages, insertIncomingMessage, insertOutgoingMessage, getAllMessages };
