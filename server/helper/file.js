import fs from 'fs';
import path from 'path';
import { pool } from './db.js';

const __dirname = import.meta.dirname;

const initializeTestDb = () => {
    const sql = fs.readFileSync(path.resolve(__dirname,"../todo.sql"), "utf8");
    pool.query(sql);
}

export { initializeTestDb };