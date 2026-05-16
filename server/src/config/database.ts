import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, process.env.DB_PATH || '../database/atomgoal.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath, { verbose: console.log });

// Initialize database if empty
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
if (tables.length === 0) {
    console.log("Initializing database schema...");
    const schema = fs.readFileSync(path.resolve(__dirname, '../../../database/schema.sql'), 'utf8');
    db.exec(schema);
    
    console.log("Seeding database...");
    const seed = fs.readFileSync(path.resolve(__dirname, '../../../database/seed.sql'), 'utf8');
    db.exec(seed);
}

export default db;
