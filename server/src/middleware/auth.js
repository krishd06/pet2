import jwt from 'jsonwebtoken';
import { getDb } from '../db/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'pawmatch_super_secret_jwt_key_2026_dev_secure';

export function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role || 'adopter',
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

export function signGuestToken() {
  const guestId = 'guest_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  return jwt.sign(
    {
      guestId,
      isGuest: true
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.isGuest) {
      req.guest = { guestId: decoded.guestId };
      req.user = null;
    } else {
      req.user = decoded;
      req.guest = null;
    }
    next();
  } catch (err) {
    // If token invalid, allow request to proceed as anonymous unless strictly required
    req.user = null;
    req.guest = null;
    next();
  }
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }
  next();
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
  }
  next();
}

export function requireShelter(req, res, next) {
  if (!req.user || (req.user.role !== 'shelter' && req.user.role !== 'admin')) {
    return res.status(403).json({ error: 'Access denied. Shelter account required.' });
  }
  next();
}

