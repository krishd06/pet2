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
  const migrationsDir = path.join(__dirname, '../../db/migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  if (db.isMock) {
    console.log('Using in-memory development store; schema initialized.');
    return { success: true, mode: 'in_memory' };
  }

  try {
    for (const file of files) {
      console.log(`Applying migration: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      await db.query(sql);
    }
    console.log('All PostgreSQL migrations applied successfully on Neon Database!');
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
