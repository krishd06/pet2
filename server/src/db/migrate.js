import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDb } from './index.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigrations() {
  console.log('--- Running PostgreSQL Migrations for PawMatch India ---');
  const db = getDb();
  const migrationPath = path.join(__dirname, '../../db/migrations/001_create_tables.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  if (db.isMock) {
    console.log('Using in-memory development store; schema initialized.');
    return { success: true, mode: 'in_memory' };
  }

  try {
    await db.query(sql);
    console.log('PostgreSQL migrations applied successfully on Neon Database!');
    return { success: true, mode: 'neon_postgres' };
  } catch (err) {
    console.error('Migration error:', err.message);
    throw err;
  }
}

// Allow direct CLI invocation: node src/db/migrate.js
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
