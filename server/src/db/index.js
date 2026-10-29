import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let pool = null;

// In-memory fallback database for local development/testing without live Neon credentials
class InMemoryDB {
  constructor() {
    this.tables = {
      users: [],
      pets: [],
      scoring_weights: [],
      cities: [],
      shelters: [],
      animals: [],
      vets: [],
      assessments: [],
      foster_trials: [],
      onboarding_progress: [],
      partners: [],
      shelter_plans: [],
      inquiries: [],
      trial_bookings: [],
      payments: [],
      subscriptions: [],
      service_providers: [],
      leads: [],
      partner_inquiries: []
    };
  }

  async query(text, params = []) {
    const trimmed = text.trim();
    const upper = trimmed.toUpperCase();

    // Health check
    if (upper === 'SELECT 1' || upper === 'SELECT 1 AS OK') {
      return { rows: [{ ok: 1 }] };
    }

    // SELECT
    if (upper.startsWith('SELECT')) {
      const matchFrom = trimmed.match(/FROM\s+([a-zA-Z_]+)/i);
      if (!matchFrom) return { rows: [] };
      const table = matchFrom[1].toLowerCase();
      let rows = [...(this.tables[table] || [])];

      // Flexible WHERE parser for mock development mode
      const whereMatch = trimmed.match(/WHERE\s+(.+?)(?:\s+ORDER\s+BY|\s+LIMIT|$)/i);
      if (whereMatch) {
        const whereClause = whereMatch[1];
        const conditions = whereClause.split(/\s+AND\s+/i);

        rows = rows.filter(r => {
          return conditions.every(cond => {
            const trimmedCond = cond.trim().replace(/^\(|\)$/g, '');

            // active = true / active = false
            if (/active\s*=\s*true/i.test(trimmedCond)) return r.active === true;
            if (/active\s*=\s*false/i.test(trimmedCond)) return r.active === false;

            // LOWER(col) = LOWER($X) or col = $X
            const paramMatch = trimmedCond.match(/(?:LOWER\()?([a-zA-Z_]+)(?:\))?\s*=\s*(?:LOWER\()?\$([0-9]+)(?:\))?/i);
            if (paramMatch) {
              const col = paramMatch[1].toLowerCase();
              const pIdx = parseInt(paramMatch[2], 10) - 1;
              const expected = params[pIdx];
              if (expected === undefined || expected === null) return true;
              if (typeof expected === 'string' && typeof r[col] === 'string') {
                return r[col].toLowerCase() === expected.toLowerCase();
              }
              return r[col] == expected;
            }

            // col = 'literal'
            const literalMatch = trimmedCond.match(/([a-zA-Z_]+)\s*=\s*'([^']+)'/i);
            if (literalMatch) {
              const col = literalMatch[1].toLowerCase();
              const literal = literalMatch[2];
              return String(r[col]).toLowerCase() === literal.toLowerCase();
            }

            return true;
          });
        });
      }

      // ORDER BY support (e.g. is_featured DESC, created_at DESC)
      if (/ORDER\s+BY/i.test(trimmed)) {
        if (/is_featured\s+DESC/i.test(trimmed)) {
          rows.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        } else if (/created_at\s+DESC/i.test(trimmed)) {
          rows.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        }
      }

      // LIMIT
      if (/LIMIT\s+\$([0-9]+)/i.test(trimmed)) {
        const limitParamIndex = parseInt(trimmed.match(/LIMIT\s+\$([0-9]+)/i)[1], 10) - 1;
        const limit = params[limitParamIndex] || 100;
        rows = rows.slice(0, limit);
      } else {
        const directLimit = trimmed.match(/LIMIT\s+([0-9]+)/i);
        if (directLimit) {
          rows = rows.slice(0, parseInt(directLimit[1], 10));
        }
      }

      return { rows };
    }

    // INSERT INTO table (cols) VALUES ($1, ...) RETURNING *
    if (upper.startsWith('INSERT INTO')) {
      const match = trimmed.match(/INSERT INTO\s+([a-zA-Z_]+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
      if (match) {
        const table = match[1].toLowerCase();
        const cols = match[2].split(',').map(c => c.trim().toLowerCase());
        const row = {};
        cols.forEach((col, idx) => {
          row[col] = params[idx];
        });
        if (!row.created_at) row.created_at = new Date().toISOString();
        if (!row.updated_at) row.updated_at = new Date().toISOString();
        
        if (!this.tables[table]) this.tables[table] = [];
        
        // Upsert support for unique user_id, checklist_item_id or primary keys
        const existingIdx = this.tables[table].findIndex(r => r.id === row.id);
        if (existingIdx >= 0) {
          this.tables[table][existingIdx] = { ...this.tables[table][existingIdx], ...row };
        } else {
          this.tables[table].push(row);
        }
        return { rows: [row], rowCount: 1 };
      }
    }

    // UPDATE table SET col1 = $1 WHERE id = $2
    if (upper.startsWith('UPDATE')) {
      const match = trimmed.match(/UPDATE\s+([a-zA-Z_]+)\s+SET\s+(.+)\s+WHERE\s+(.+)/i);
      if (match) {
        const table = match[1].toLowerCase();
        const setClause = match[2];
        const whereClause = match[3];
        const rows = this.tables[table] || [];

        // Find matches
        let updatedCount = 0;
        let lastUpdated = null;
        rows.forEach(r => {
          let matches = false;
          if (/id\s*=\s*\$([0-9]+)/i.test(whereClause)) {
            const pIdx = parseInt(whereClause.match(/id\s*=\s*\$([0-9]+)/i)[1], 10) - 1;
            matches = r.id === params[pIdx];
          }
          if (matches) {
            // Apply assignments
            const assignments = setClause.split(',');
            assignments.forEach(assign => {
              const [col, valRef] = assign.split('=').map(s => s.trim());
              const valParamIdx = parseInt(valRef.replace('$', ''), 10) - 1;
              r[col] = params[valParamIdx];
            });
            r.updated_at = new Date().toISOString();
            updatedCount++;
            lastUpdated = r;
          }
        });
        return { rows: lastUpdated ? [lastUpdated] : [], rowCount: updatedCount };
      }
    }

    // DELETE FROM table WHERE ...
    if (upper.startsWith('DELETE FROM')) {
      const match = trimmed.match(/DELETE FROM\s+([a-zA-Z_]+)\s+WHERE\s+id\s*=\s*\$1/i);
      if (match) {
        const table = match[1].toLowerCase();
        const before = (this.tables[table] || []).length;
        this.tables[table] = (this.tables[table] || []).filter(r => r.id !== params[0]);
        return { rowCount: before - this.tables[table].length };
      }
    }

    return { rows: [] };
  }
}

export const inMemoryDB = new InMemoryDB();

export function getDb() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.trim() === '' || dbUrl.includes('placeholder')) {
    return {
      isMock: true,
      query: (text, params) => inMemoryDB.query(text, params),
      clientType: 'in_memory_dev_store'
    };
  }

  if (!pool) {
    const isNeon = dbUrl.includes('neon.tech') || dbUrl.includes('sslmode=require');
    pool = new pg.Pool({
      connectionString: dbUrl,
      ssl: isNeon ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client:', err);
    });
  }

  return {
    isMock: false,
    query: (text, params) => pool.query(text, params),
    clientType: 'neon_postgres'
  };
}

export async function checkDbHealth() {
  const start = Date.now();
  try {
    const db = getDb();
    await db.query('SELECT 1 AS ok');
    return {
      status: 'healthy',
      clientType: db.clientType,
      latencyMs: Date.now() - start
    };
  } catch (err) {
    return {
      status: 'unhealthy',
      error: err.message,
      latencyMs: Date.now() - start
    };
  }
}
