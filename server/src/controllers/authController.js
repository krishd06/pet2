import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { getDb } from '../db/index.js';
import { signToken, signGuestToken } from '../middleware/auth.js';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export async function register(req, res) {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { name, email, password } = parsed.data;
    const db = getDb();

    // Check existing
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows && existing.rows.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const id = 'usr_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    const passwordHash = await bcrypt.hash(password, 10);
    const role = 'adopter';

    const insertResult = await db.query(
      `INSERT INTO users (id, email, password_hash, role, name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, role, name, created_at`,
      [id, email, passwordHash, role, name]
    );

    const newUser = insertResult.rows[0];
    const token = signToken(newUser);

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Failed to create account. Please try again.' });
  }
}

export async function login(req, res) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { email, password } = parsed.data;
    const db = getDb();

    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!result.rows || result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = signToken(user);

    return res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Failed to login. Please try again.' });
  }
}

export async function getMe(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  return res.json({ user: req.user });
}

export async function createGuestToken(req, res) {
  try {
    const token = signGuestToken();
    return res.json({ guestToken: token });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate guest token' });
  }
}
