import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { getDb } from '../db/index.js';
import { signToken, signGuestToken } from '../middleware/auth.js';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['adopter', 'shelter']).default('adopter'),
  shelterName: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().optional(),
  description: z.string().optional()
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

    const { name, email, password, role = 'adopter', shelterName, city, phone, address, website, description } = parsed.data;
    const db = getDb();

    // Check existing
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows && existing.rows.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const id = 'usr_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    const passwordHash = await bcrypt.hash(password, 10);

    const insertResult = await db.query(
      `INSERT INTO users (id, email, password_hash, role, name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, role, name, created_at`,
      [id, email, passwordHash, role, name]
    );

    const newUser = insertResult.rows[0];

    // If shelter role, create corresponding shelter profile (unverified by default until admin review)
    let shelterProfile = null;
    if (role === 'shelter') {
      const shelterId = 'sh_' + Math.random().toString(36).substr(2, 9);
      const shName = shelterName || name;
      const shCity = city || 'Mumbai';
      const shPhone = phone || '+91 98000 00000';
      const shAddress = address || 'Registered Rescue Facility';
      const shDesc = description || 'Dedicated animal shelter and foster sanctuary';
      const shWebsite = website || '';

      const shResult = await db.query(
        `INSERT INTO shelters (id, user_id, name, city, address, phone, email, website, description, verified, is_featured, plan_name)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING *`,
        [shelterId, newUser.id, shName, shCity, shAddress, shPhone, email, shWebsite, shDesc, false, false, 'Free']
      );
      shelterProfile = shResult.rows && shResult.rows[0];
    }

    const token = signToken(newUser);

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
        shelter: shelterProfile
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

    let shelterProfile = null;
    if (user.role === 'shelter') {
      const shRes = await db.query('SELECT * FROM shelters WHERE user_id = $1', [user.id]);
      if (shRes.rows && shRes.rows.length > 0) {
        shelterProfile = shRes.rows[0];
      }
    }

    // Check active subscription
    const subRes = await db.query('SELECT * FROM subscriptions WHERE user_id = $1 AND status = $2', [user.id, 'active']);
    const subscription = subRes.rows && subRes.rows[0] ? subRes.rows[0] : null;

    return res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        shelter: shelterProfile,
        isPremium: Boolean(subscription && subscription.plan_tier === 'premium')
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
  const db = getDb();
  let shelterProfile = null;
  if (req.user.role === 'shelter') {
    const shRes = await db.query('SELECT * FROM shelters WHERE user_id = $1', [req.user.id]);
    if (shRes.rows && shRes.rows.length > 0) {
      shelterProfile = shRes.rows[0];
    }
  }

  const subRes = await db.query('SELECT * FROM subscriptions WHERE user_id = $1 AND status = $2', [req.user.id, 'active']);
  const subscription = subRes.rows && subRes.rows[0] ? subRes.rows[0] : null;

  return res.json({
    user: {
      ...req.user,
      shelter: shelterProfile,
      isPremium: Boolean(subscription && subscription.plan_tier === 'premium')
    }
  });
}

export async function createGuestToken(req, res) {
  try {
    const token = signGuestToken();
    return res.json({ guestToken: token });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate guest token' });
  }
}
