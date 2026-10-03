import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { User, Notice, Achievement, Sport, Enquiry } from './models.js';

const r = Router();
const wrap = (fn) => (req, res, next) => fn(req, res).catch(next);
const limiter = (max, mins) => rateLimit({ windowMs: mins * 60 * 1000, limit: max });

const auth = (...roles) => (req, res, next) => {
  try {
    req.user = jwt.verify((req.headers.authorization || '').replace('Bearer ', ''), process.env.JWT_SECRET);
  } catch { return res.status(401).json({ error: 'Login required' }); }
  if (roles.length && !roles.includes(req.user.role)) return res.status(403).json({ error: 'Not allowed' });
  next();
};

r.post('/auth/login', limiter(10, 15), wrap(async (req, res) => {
  const { email, password } = z.object({ email: z.string().email(), password: z.string().min(8) }).parse(req.body);
  const u = await User.findOne({ email: email.toLowerCase() });
  if (!u || !(await bcrypt.compare(password, u.passwordHash))) return res.status(401).json({ error: 'Wrong email or password' });
  res.json({ token: jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, { expiresIn: '8h' }), role: u.role });
}));

const live = () => {
  const now = new Date();
  return { publishAt: { $lte: now }, $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] };
};

// Public GET (filtered, paginated). Admin/editor POST, PUT, DELETE (validated).
function crud(path, Model, schema, { filter = () => ({}), sort = { createdAt: -1 } } = {}) {
  r.get(`/${path}`, wrap(async (req, res) => {
    const { category, program } = req.query;
    const q = { ...filter(), ...(category && { category: String(category) }), ...(program && { program: String(program) }) };
    const page = Math.max(1, parseInt(req.query.page) || 1);
    res.json(await Model.find(q).sort(sort).skip((page - 1) * 20).limit(20).lean());
  }));
  r.post(`/${path}`, auth('admin', 'editor'), wrap(async (req, res) => res.status(201).json(await Model.create(schema.parse(req.body)))));
  r.put(`/${path}/:id`, auth('admin', 'editor'), wrap(async (req, res) =>
    res.json(await Model.findByIdAndUpdate(req.params.id, schema.partial().parse(req.body), { new: true }))));
  r.delete(`/${path}/:id`, auth('admin', 'editor'), wrap(async (req, res) => { await Model.findByIdAndDelete(req.params.id); res.json({ ok: true }); }));
}

crud('notices', Notice, z.object({
  title: z.string().min(3).max(150), body: z.string().max(5000).optional(),
  category: z.enum(['Admissions', 'Exams', 'Events', 'General']).default('General'),
  program: z.enum(['All', 'Boarding', 'Defence', 'IIT-NEET']).default('All'),
  pinned: z.boolean().default(false),
  publishAt: z.coerce.date().default(() => new Date()), expiresAt: z.coerce.date().nullable().default(null),
}), { filter: live, sort: { pinned: -1, publishAt: -1 } });

crud('achievements', Achievement, z.object({
  title: z.string().min(3).max(150), story: z.string().min(10).max(5000),
  category: z.enum(['Sports', 'Academic', 'NDA', 'IIT-NEET']), year: z.number().int().optional(),
  image: z.string().url().optional(), published: z.boolean().default(true),
}), { filter: () => ({ published: true }) });

crud('sports', Sport, z.object({
  name: z.string().min(2).max(60), coach: z.string().max(80).optional(),
  description: z.string().max(1000).optional(), achievements: z.array(z.string().max(200)).default([]),
}));

// Admissions enquiries: public submit (rate limited), staff-only list and status update
r.post('/enquiries', limiter(5, 60), wrap(async (req, res) => {
  const d = z.object({
    parentName: z.string().min(2).max(80), phone: z.string().regex(/^[0-9+\- ]{10,15}$/),
    program: z.enum(['Boarding', 'Defence', 'IIT-NEET']), grade: z.string().max(20).optional(),
  }).parse(req.body);
  await Enquiry.create(d);
  res.status(201).json({ ok: true });
}));
r.get('/enquiries', auth('admin', 'editor'), wrap(async (req, res) => res.json(await Enquiry.find().sort({ createdAt: -1 }).limit(100).lean())));
r.patch('/enquiries/:id', auth('admin', 'editor'), wrap(async (req, res) => {
  const { status } = z.object({ status: z.enum(['new', 'contacted', 'visited', 'admitted', 'closed']) }).parse(req.body);
  res.json(await Enquiry.findByIdAndUpdate(req.params.id, { status }, { new: true }));
}));

export default r;
