import { Router } from 'express';
import { db } from '../../../db/store';
import { requireAuth, AuthenticatedRequest } from '../../../middleware/authMiddleware';
import { AuditService } from '../../../services/auditService';
import { ServerUser } from '../../../types';

export const authRouter = Router();

// GET /api/v1/auth/me - Current User Profile & Balance
authRouter.get('/me', requireAuth, (req: AuthenticatedRequest, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// POST /api/v1/auth/login
authRouter.post('/login', (req, res) => {
  const { email } = req.body;

  let matchedUser: ServerUser | undefined;
  for (const u of db.users.values()) {
    if (u.email.toLowerCase() === (email || '').toLowerCase()) {
      matchedUser = u;
      break;
    }
  }

  // If user doesn't exist, create demo account or use default
  if (!matchedUser) {
    matchedUser = {
      id: `usr-${Date.now()}`,
      email: email || 'user@cyberpool.vn',
      name: email ? email.split('@')[0] : 'CyberTrader',
      role: 'USER',
      walletBalance: 1000000,
      escrowLocked: 0,
      affiliateEarnings: 0,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      ipAddress: req.ip
    };
    db.users.set(matchedUser.id, matchedUser);
  }

  matchedUser.lastLoginAt = new Date().toISOString();
  matchedUser.ipAddress = req.ip;

  AuditService.log({
    actorId: matchedUser.id,
    actorName: matchedUser.name,
    actorRole: matchedUser.role,
    action: 'USER_LOGIN',
    resource: 'AUTH_SESSION',
    ipAddress: req.ip
  });

  res.json({
    success: true,
    token: matchedUser.id,
    user: matchedUser
  });
});

// POST /api/v1/auth/register
authRouter.post('/register', (req, res) => {
  const { email, name, phone } = req.body;

  const newUser: ServerUser = {
    id: `usr-${Date.now()}`,
    email: email || `user_${Date.now()}@cyberpool.vn`,
    name: name || 'Thành Viên Mới',
    phone,
    role: 'USER',
    walletBalance: 200000,
    escrowLocked: 0,
    affiliateEarnings: 0,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    status: 'active',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    ipAddress: req.ip
  };

  db.users.set(newUser.id, newUser);

  res.json({
    success: true,
    token: newUser.id,
    user: newUser
  });
});
