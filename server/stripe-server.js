import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import OpenAI from 'openai';
import crypto from 'crypto';
import pg from 'pg';

dotenv.config();

const app = express();
const port = process.env.PORT || 4242;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const openaiApiKey = process.env.OPENAI_API_KEY || '';
const authSecret = process.env.AUTH_TOKEN_SECRET || '';
const adminEmail = process.env.ADMIN_EMAIL || '';
const adminPassword = process.env.ADMIN_PASSWORD || '';
const resendApiKey = process.env.RESEND_API_KEY || '';
const resendFromEmail = process.env.RESEND_FROM_EMAIL || '';
const adminNotificationEmail = process.env.ADMIN_NOTIFICATION_EMAIL || adminEmail;
const databaseUrl = process.env.DATABASE_URL || '';
const pgHost = process.env.PGHOST || '';
const pgUser = process.env.PGUSER || '';
const pgPassword = process.env.PGPASSWORD || '';
const pgDatabase = process.env.PGDATABASE || '';
const pgPort = Number(process.env.PGPORT || 5432);
const pgSslMode = process.env.PGSSLMODE || '';

const openai =
  openaiApiKey.trim() !== ''
    ? new OpenAI({ apiKey: openaiApiKey })
    : null;

const { Pool } = pg;
const isRender = Boolean(process.env.RENDER) || Boolean(process.env.RENDER_SERVICE_ID);
const shouldUseSsl =
  isRender ||
  pgSslMode === 'require' ||
  pgSslMode === 'verify-full' ||
  (databaseUrl && databaseUrl.includes('render.com'));
const sslConfig = shouldUseSsl ? { rejectUnauthorized: false } : undefined;

const pool =
  databaseUrl
    ? new Pool({
        connectionString: databaseUrl,
        ssl: sslConfig,
      })
    : pgHost && pgUser && pgDatabase
      ? new Pool({
          host: pgHost,
          user: pgUser,
          password: pgPassword,
          database: pgDatabase,
          port: pgPort,
          ssl: sslConfig,
        })
    : null;

if (!pool) {
  console.warn('⚠️ Database is not configured. Set DATABASE_URL or PGHOST/PGUSER/PGDATABASE in .env.');
}

if (!authSecret) {
  console.warn('⚠️ AUTH_TOKEN_SECRET is not set. Admin login will fail.');
}

if (!adminEmail || !adminPassword) {
  console.warn('⚠️ ADMIN_EMAIL/ADMIN_PASSWORD not set. Admin login will fail.');
}

if (!resendApiKey || !resendFromEmail) {
  console.warn('⚠️ RESEND_API_KEY/RESEND_FROM_EMAIL not set. Email notifications will be skipped.');
}

const toBase64Url = (value) => Buffer.from(value).toString('base64url');

const signToken = (payload, expiresInSeconds = 60 * 60 * 24 * 7) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresInSeconds;
  const body = { ...payload, iat, exp };
  const data = `${toBase64Url(JSON.stringify(header))}.${toBase64Url(JSON.stringify(body))}`;
  const signature = crypto.createHmac('sha256', authSecret).update(data).digest('base64url');
  return `${data}.${signature}`;
};

const verifyToken = (token) => {
  if (!token || !authSecret) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  const data = `${header}.${payload}`;
  const expected = crypto.createHmac('sha256', authSecret).update(data).digest('base64url');

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
};

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const iterations = 100000;
  const hash = crypto
    .pbkdf2Sync(String(password), salt, iterations, 32, 'sha256')
    .toString('hex');
  return `pbkdf2_sha256$${iterations}$${salt}$${hash}`;
};

const verifyPassword = (password, storedHash) => {
  if (!storedHash) return false;
  const [algo, iterationsRaw, salt, hash] = String(storedHash).split('$');
  if (algo !== 'pbkdf2_sha256') return false;
  const iterations = Number(iterationsRaw);
  if (!iterations || !salt || !hash) return false;

  const computed = crypto
    .pbkdf2Sync(String(password), salt, iterations, 32, 'sha256')
    .toString('hex');

  const computedBuffer = Buffer.from(computed, 'hex');
  const hashBuffer = Buffer.from(hash, 'hex');
  if (computedBuffer.length !== hashBuffer.length) return false;
  return crypto.timingSafeEqual(computedBuffer, hashBuffer);
};

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.slice('Bearer '.length);
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  req.user = payload;
  return next();
};

const sendResendEmail = async ({ to, subject, html }) => {
  if (!resendApiKey || !resendFromEmail) return;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: resendFromEmail,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resend API error:', response.status, errorText);
    }
  } catch (error) {
    console.error('Resend request failed:', error);
  }
};

const sendLoginNotification = async (email, loginTime) => {
  if (!adminNotificationEmail) return;

  await sendResendEmail({
    to: adminNotificationEmail,
    subject: 'Nova prijava na Astro Dashboard',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #8b5cf6; text-align: center;">🔐 Nova Prijava na Dashboard</h1>
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 12px; color: #fff;">
          <p style="font-size: 16px; margin-bottom: 15px;">
            <strong>Korisnik:</strong> ${email}
          </p>
          <p style="font-size: 16px; margin-bottom: 15px;">
            <strong>Vreme prijave:</strong> ${loginTime}
          </p>
        </div>
        <p style="color: #666; font-size: 12px; text-align: center; margin-top: 20px;">
          Ova notifikacija je automatski generisana od strane Astro Dashboard sistema.
        </p>
      </div>
    `,
  });
};

const sendOrderNotifications = async ({
  customerName,
  email,
  productName,
  birthDate,
  birthPlace,
  birthTime,
  note,
}) => {
  if (adminNotificationEmail) {
    await sendResendEmail({
      to: adminNotificationEmail,
      subject: `Nova narudžbina: ${productName}`,
      html: `
        <h1>Nova narudžbina primljena!</h1>
        <h2>Detalji narudžbine:</h2>
        <ul>
          <li><strong>Proizvod:</strong> ${productName}</li>
          <li><strong>Ime kupca:</strong> ${customerName}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Datum rođenja:</strong> ${birthDate}</li>
          <li><strong>Vreme rođenja:</strong> ${birthTime || 'Nije navedeno'}</li>
          <li><strong>Mesto rođenja:</strong> ${birthPlace}</li>
          ${note ? `<li><strong>Napomena:</strong> ${note}</li>` : ''}
        </ul>
        <p>Posetite dashboard za više detalja.</p>
      `,
    });
  }

  await sendResendEmail({
    to: email,
    subject: `Vaša narudžbina je primljena - ${productName}`,
    html: `
      <h1>Hvala vam na narudžbini, ${customerName}!</h1>
      <p>Vaša narudžbina za <strong>${productName}</strong> je uspešno primljena.</p>
      <h2>Detalji:</h2>
      <ul>
        <li><strong>Datum rođenja:</strong> ${birthDate}</li>
        <li><strong>Vreme rođenja:</strong> ${birthTime || 'Nije navedeno'}</li>
        <li><strong>Mesto rođenja:</strong> ${birthPlace}</li>
      </ul>
      <p>Vaš astrološki izveštaj ćete dobiti na ovaj email u najkraćem mogućem roku.</p>
      <p>Srdačan pozdrav,<br>Astro Portal Tim</p>
    `,
  });
};

// Other routes can use JSON parsing
app.use(cors({ origin: frontendUrl, allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

// Simple rate limit for LLM endpoint (per IP)
const llmLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!authSecret) {
    return res.status(500).json({ error: 'Auth is not configured' });
  }

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const expectedEmail = adminEmail.trim().toLowerCase();

  let dbAdmin = null;

  if (pool) {
    try {
      const { rows } = await pool.query(
        'SELECT id, email, password_hash, status FROM admins WHERE email = $1 LIMIT 1',
        [normalizedEmail]
      );
      if (rows.length > 0) {
        dbAdmin = rows[0];
      }
    } catch (error) {
      console.error('Admin lookup failed:', error);
    }
  }

  if (dbAdmin) {
    if (dbAdmin.status && dbAdmin.status !== 'active') {
      return res.status(403).json({ error: 'Admin account disabled' });
    }
    if (!verifyPassword(password, dbAdmin.password_hash)) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    if (pool) {
      await pool.query('UPDATE admins SET last_login = NOW() WHERE id = $1', [dbAdmin.id]);
    }

    const token = signToken({ email: normalizedEmail, adminId: dbAdmin.id, role: 'admin' });

    const loginTime = new Date().toLocaleString('sr-RS', {
      timeZone: 'Europe/Belgrade',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    sendLoginNotification(normalizedEmail, loginTime);

    return res.json({ token, user: { email: normalizedEmail } });
  }

  if (!adminEmail || !adminPassword) {
    return res.status(500).json({ error: 'Admin credentials not configured' });
  }

  if (normalizedEmail !== expectedEmail || String(password) !== adminPassword) {
    return res.status(401).json({ error: 'Invalid login credentials' });
  }

  const token = signToken({ email: normalizedEmail, role: 'owner' });

  const loginTime = new Date().toLocaleString('sr-RS', {
    timeZone: 'Europe/Belgrade',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  sendLoginNotification(normalizedEmail, loginTime);

  return res.json({ token, user: { email: normalizedEmail } });
});

app.get('/api/auth/session', requireAuth, (req, res) => {
  res.json({ user: { email: req.user?.email || '' } });
});

app.post('/api/admins', requireAuth, async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const { email, password, name } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  try {
    const { rows: existingRows } = await pool.query(
      'SELECT id FROM admins WHERE email = $1 LIMIT 1',
      [normalizedEmail]
    );

    if (existingRows.length > 0) {
      return res.status(409).json({ error: 'Admin already exists' });
    }

    const passwordHash = hashPassword(password);
    const { rows } = await pool.query(
      'INSERT INTO admins (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id',
      [normalizedEmail, passwordHash, name || null]
    );

    return res.status(201).json({ success: true, adminId: rows[0]?.id });
  } catch (error) {
    console.error('Failed to create admin:', error);
    return res.status(500).json({ error: 'Failed to create admin' });
  }
});

app.post('/api/orders', async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const {
    product_id,
    product_name,
    customer_name,
    first_name,
    last_name,
    birth_date,
    birth_time,
    birth_place,
    city,
    country,
    email,
    note,
    consultation_description,
  } = req.body || {};

  if (
    !product_id ||
    !product_name ||
    !customer_name ||
    !first_name ||
    !last_name ||
    !birth_date ||
    !birth_place ||
    !city ||
    !country ||
    !email
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO orders (
        product_id,
        product_name,
        customer_name,
        first_name,
        last_name,
        birth_date,
        birth_time,
        birth_place,
        city,
        country,
        email,
        note,
        consultation_description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id`,
      [
        product_id,
        product_name,
        customer_name,
        first_name,
        last_name,
        birth_date,
        birth_time || null,
        birth_place,
        city,
        country,
        email,
        note || null,
        consultation_description || null,
      ]
    );

    sendOrderNotifications({
      customerName: customer_name,
      email,
      productName: product_name,
      birthDate: birth_date,
      birthPlace: birth_place,
      birthTime: birth_time,
      note,
    });

    return res.status(201).json({ success: true, orderId: rows[0]?.id });
  } catch (error) {
    console.error('Failed to create order:', error);
    return res.status(500).json({ error: 'Failed to create order' });
  }
});

app.get('/api/orders', requireAuth, async (_req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const { rows } = await pool.query(
      `SELECT
        id,
        product_id,
        product_name,
        customer_name,
        first_name,
        last_name,
        birth_date,
        birth_time,
        birth_place,
        city,
        country,
        email,
        note,
        consultation_description,
        status,
        created_at
      FROM orders
      ORDER BY created_at DESC`
    );
    return res.json({ orders: rows });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.patch('/api/orders/:id', requireAuth, async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const { status } = req.body || {};
  const allowedStatuses = ['pending', 'processing', 'completed', 'cancelled'];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, req.params.id]);
    return res.json({ success: true });
  } catch (error) {
    console.error('Failed to update order:', error);
    return res.status(500).json({ error: 'Failed to update order' });
  }
});

app.post('/api/usage', async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const { sign1, sign2, compatibility } = req.body || {};

  if (!sign1 || !sign2 || typeof compatibility !== 'number') {
    return res.status(400).json({ error: 'Missing sign1/sign2/compatibility' });
  }

  try {
    await pool.query(
      'INSERT INTO calculator_usage (sign1, sign2, compatibility) VALUES ($1, $2, $3)',
      [sign1, sign2, compatibility]
    );
    return res.status(201).json({ success: true });
  } catch (error) {
    console.error('Failed to log calculator usage:', error);
    return res.status(500).json({ error: 'Failed to log usage' });
  }
});

app.get('/api/usage', requireAuth, async (_req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const { rows } = await pool.query(
      `SELECT id, sign1, sign2, compatibility, created_at
       FROM calculator_usage
       ORDER BY created_at DESC`
    );
    return res.json({ usage: rows });
  } catch (error) {
    console.error('Failed to fetch usage:', error);
    return res.status(500).json({ error: 'Failed to fetch usage' });
  }
});

// LLM endpoint for compatibility copy
app.post('/api/compatibility-llm', llmLimiter, async (req, res) => {
  if (!openai) {
    return res.status(500).json({ error: 'OpenAI not configured' });
  }

  const { sign1, sign2, compatibility, language = 'sr' } = req.body || {};

  if (!sign1 || !sign2 || typeof compatibility !== 'number') {
    return res.status(400).json({ error: 'Missing sign1/sign2/compatibility' });
  }

  const languageMap = {
    sr: 'Serbian (Latin script)',
    en: 'English',
    fr: 'French',
    de: 'German',
    es: 'Spanish',
    ru: 'Russian',
  };
  const languageLabel = languageMap[language] || 'Serbian (Latin script)';

  const prompt = `
You are an astrologer copywriter. Write ONE short paragraph (max 80 words) in ${languageLabel}.
Respond ONLY in ${languageLabel}.
About the couple ${sign1} & ${sign2} with compatibility ${compatibility}%.
Mention 1-2 key traits for each sign and 1 clear reason why they match or complement each other.
Vary vocabulary each time; make it warm, intriguing, and end with a soft CTA to order the full paid analysis.
No lists, no headings—just a single paragraph.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.95,
      max_tokens: 150,
      messages: [
        { role: 'system', content: `Stay concise, 1 paragraph, persuasive but authentic. Use ${languageLabel} only.` },
        { role: 'user', content: prompt },
      ],
    });

    const text = completion.choices?.[0]?.message?.content?.trim();
    return res.json({ text });
  } catch (err) {
    console.error('LLM error', err);
    return res.status(500).json({ error: 'LLM error' });
  }
});

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
