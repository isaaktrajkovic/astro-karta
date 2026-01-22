import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import OpenAI from 'openai';
import crypto from 'crypto';
import fs from 'fs';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import Stripe from 'stripe';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 4242;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const frontendUrlsEnv = process.env.FRONTEND_URLS || '';
const openaiApiKey = process.env.OPENAI_API_KEY || '';
const authSecret = process.env.AUTH_TOKEN_SECRET || '';
const adminEmail = process.env.ADMIN_EMAIL || '';
const adminPassword = process.env.ADMIN_PASSWORD || '';
const resendApiKey = process.env.RESEND_API_KEY || '';
const resendFromEmail = process.env.RESEND_FROM_EMAIL || '';
const adminNotificationEmail = process.env.ADMIN_NOTIFICATION_EMAIL || adminEmail;
const adminNotificationEmails = [
  adminNotificationEmail,
  'irina311.ilic@gmail.com',
].filter(Boolean);
const apiBaseUrl = process.env.API_BASE_URL || `http://localhost:${port}`;
const normalizedApiBaseUrl = apiBaseUrl.replace(/\/+$/, '');
const databaseUrl = process.env.DATABASE_URL || '';
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
const pgHost = process.env.PGHOST || '';
const pgUser = process.env.PGUSER || '';
const pgPassword = process.env.PGPASSWORD || '';
const pgDatabase = process.env.PGDATABASE || '';
const pgPort = Number(process.env.PGPORT || 5432);
const pgSslMode = process.env.PGSSLMODE || '';
const horoscopeDefaultTimezone = process.env.HOROSCOPE_TIMEZONE || 'Europe/Belgrade';
const horoscopeSendHour = Number(process.env.HOROSCOPE_SEND_HOUR || 8);
const horoscopeDurationDays = Number(process.env.HOROSCOPE_DURATION_DAYS || 30);
const horoscopeSchedulerIntervalMs = Number(process.env.HOROSCOPE_SCHEDULER_INTERVAL_MS || 5 * 60 * 1000);
const horoscopeSchedulerEnabled = process.env.HOROSCOPE_SCHEDULER_ENABLED !== 'false';
const horoscopeBatchSize = Number(process.env.HOROSCOPE_BATCH_SIZE || 200);
const dailyContextUrlTemplates = (process.env.DAILY_CONTEXT_URLS || process.env.DAILY_CONTEXT_URL || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const dailyContextTimeoutMs = Number(process.env.DAILY_CONTEXT_TIMEOUT_MS || 3500);
const dailyContextCacheTtlMs = Number(process.env.DAILY_CONTEXT_CACHE_TTL_MS || 6 * 60 * 60 * 1000);
const dailyContextMaxLen = Number(process.env.DAILY_CONTEXT_MAX_LEN || 800);
const dailyContextUserAgent =
  process.env.DAILY_CONTEXT_USER_AGENT ||
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const dailyContextAcceptLanguage = process.env.DAILY_CONTEXT_ACCEPT_LANGUAGE || 'en-US,en;q=0.9';
const compatibilityCacheTtlMs = Number(process.env.COMPATIBILITY_CACHE_TTL_MS || 7 * 24 * 60 * 60 * 1000);
const compatibilityCacheMax = Number(process.env.COMPATIBILITY_CACHE_MAX || 500);
const compatibilityCache = new Map();
const dailyContextCache = new Map();
const analyticsEventTypes = new Set([
  'page_view',
  'order_view',
  'order_success_view',
  'checkout_started',
  'order_created',
  'order_completed',
]);
const orderCurrency = 'EUR';

const uploadsDir = path.join(__dirname, 'uploads');
const blogUploadsDir = path.join(uploadsDir, 'blog');
fs.mkdirSync(blogUploadsDir, { recursive: true });

const normalizeOrigin = (value) => String(value || '').trim().replace(/\/+$/, '');

const buildAllowedOrigins = () => {
  const origins = new Set();
  const addOrigin = (value) => {
    const normalized = normalizeOrigin(value);
    if (normalized) origins.add(normalized);
  };

  addOrigin(frontendUrl);
  frontendUrlsEnv
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .forEach(addOrigin);

  const frontendNormalized = normalizeOrigin(frontendUrl);
  if (frontendNormalized.includes('://www.')) {
    addOrigin(frontendNormalized.replace('://www.', '://'));
  } else if (frontendNormalized.includes('://')) {
    addOrigin(frontendNormalized.replace('://', '://www.'));
  }

  addOrigin('http://localhost:5173');
  addOrigin('http://127.0.0.1:5173');

  return origins;
};

const allowedOrigins = buildAllowedOrigins();

const openai =
  openaiApiKey.trim() !== ''
    ? new OpenAI({ apiKey: openaiApiKey })
    : null;
const stripe =
  stripeSecretKey.trim() !== ''
    ? new Stripe(stripeSecretKey, { apiVersion: '2024-04-10' })
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
if (!stripeSecretKey) {
  console.warn('⚠️ STRIPE_SECRET_KEY not set. Stripe checkout will be disabled.');
}

const languageLabelByCode = {
  sr: 'Serbian (Latin script)',
  en: 'English',
  fr: 'French',
  de: 'German',
  es: 'Spanish',
  ru: 'Russian',
};

const dateLocaleByLanguage = {
  sr: 'sr-RS',
  en: 'en-US',
  fr: 'fr-FR',
  de: 'de-DE',
  es: 'es-ES',
  ru: 'ru-RU',
};

const zodiacLabelsByLanguage = {
  sr: {
    aries: 'Ovan',
    taurus: 'Bik',
    gemini: 'Blizanci',
    cancer: 'Rak',
    leo: 'Lav',
    virgo: 'Devica',
    libra: 'Vaga',
    scorpio: 'Škorpija',
    sagittarius: 'Strelac',
    capricorn: 'Jarac',
    aquarius: 'Vodolija',
    pisces: 'Ribe',
  },
  en: {
    aries: 'Aries',
    taurus: 'Taurus',
    gemini: 'Gemini',
    cancer: 'Cancer',
    leo: 'Leo',
    virgo: 'Virgo',
    libra: 'Libra',
    scorpio: 'Scorpio',
    sagittarius: 'Sagittarius',
    capricorn: 'Capricorn',
    aquarius: 'Aquarius',
    pisces: 'Pisces',
  },
  fr: {
    aries: 'Bélier',
    taurus: 'Taureau',
    gemini: 'Gémeaux',
    cancer: 'Cancer',
    leo: 'Lion',
    virgo: 'Vierge',
    libra: 'Balance',
    scorpio: 'Scorpion',
    sagittarius: 'Sagittaire',
    capricorn: 'Capricorne',
    aquarius: 'Verseau',
    pisces: 'Poissons',
  },
  de: {
    aries: 'Widder',
    taurus: 'Stier',
    gemini: 'Zwillinge',
    cancer: 'Krebs',
    leo: 'Löwe',
    virgo: 'Jungfrau',
    libra: 'Waage',
    scorpio: 'Skorpion',
    sagittarius: 'Schütze',
    capricorn: 'Steinbock',
    aquarius: 'Wassermann',
    pisces: 'Fische',
  },
  es: {
    aries: 'Aries',
    taurus: 'Tauro',
    gemini: 'Géminis',
    cancer: 'Cáncer',
    leo: 'Leo',
    virgo: 'Virgo',
    libra: 'Libra',
    scorpio: 'Escorpio',
    sagittarius: 'Sagitario',
    capricorn: 'Capricornio',
    aquarius: 'Acuario',
    pisces: 'Piscis',
  },
  ru: {
    aries: 'Овен',
    taurus: 'Телец',
    gemini: 'Близнецы',
    cancer: 'Рак',
    leo: 'Лев',
    virgo: 'Дева',
    libra: 'Весы',
    scorpio: 'Скорпион',
    sagittarius: 'Стрелец',
    capricorn: 'Козерог',
    aquarius: 'Водолей',
    pisces: 'Рыбы',
  },
};

const horoscopeSectionLabelsByLanguage = {
  sr: { work: 'Posao', health: 'Zdravlje', love: 'Ljubav' },
  en: { work: 'Work', health: 'Health', love: 'Love' },
  fr: { work: 'Travail', health: 'Santé', love: 'Amour' },
  de: { work: 'Arbeit', health: 'Gesundheit', love: 'Liebe' },
  es: { work: 'Trabajo', health: 'Salud', love: 'Amor' },
  ru: { work: 'Работа', health: 'Здоровье', love: 'Любовь' },
};

const zodiacSignKeys = Object.keys(zodiacLabelsByLanguage.sr);

const signPersonaByLanguage = {
  sr: {
    aries: 'brz, hrabar, inicijativan; traži izazov i direktnost',
    taurus: 'stabilan, strpljiv, praktičan; voli sigurnost i ritam',
    gemini: 'radoznao, komunikativan, fleksibilan; traži ideje i razmenu',
    cancer: 'emotivan, zaštitnički, intuitivan; traži bliskost i sigurnost',
    leo: 'ponosan, kreativan, srčan; traži priznanje i toplinu',
    virgo: 'analitičan, precizan, posvećen; traži red i korisnost',
    libra: 'diplomatičan, taktičan, estetski; traži ravnotežu i sklad',
    scorpio: 'intenzivan, dubok, lojalan; traži istinu i transformaciju',
    sagittarius: 'optimističan, avanturistički, otvoren; traži širinu i slobodu',
    capricorn: 'ambiciozan, disciplinovan, istrajan; traži rezultate i strukturu',
    aquarius: 'nezavisan, originalan, human; traži ideje i slobodu',
    pisces: 'empatičan, maštovit, nežan; traži smisao i povezanost',
  },
  en: {
    aries: 'fast, bold, initiating; seeks challenge and directness',
    taurus: 'steady, patient, practical; seeks security and rhythm',
    gemini: 'curious, communicative, flexible; seeks ideas and exchange',
    cancer: 'emotional, protective, intuitive; seeks closeness and safety',
    leo: 'proud, creative, warm; seeks recognition and warmth',
    virgo: 'analytical, precise, devoted; seeks order and usefulness',
    libra: 'diplomatic, tactful, aesthetic; seeks balance and harmony',
    scorpio: 'intense, deep, loyal; seeks truth and transformation',
    sagittarius: 'optimistic, adventurous, open; seeks freedom and expansion',
    capricorn: 'ambitious, disciplined, persistent; seeks structure and results',
    aquarius: 'independent, original, humanitarian; seeks ideas and freedom',
    pisces: 'empathetic, imaginative, gentle; seeks meaning and connection',
  },
};

const seasonalFocusByLanguage = {
  sr: {
    aries: 'inicijativa, hrabrost, prvi korak',
    taurus: 'stabilnost, telo, finansije, ritam',
    gemini: 'komunikacija, učenje, kretanje',
    cancer: 'emocije, dom, bliskost',
    leo: 'kreativnost, samopouzdanje, vidljivost',
    virgo: 'rutina, detalji, zdravlje',
    libra: 'ravnoteža, odnosi, estetika',
    scorpio: 'dubina, transformacija, granice',
    sagittarius: 'širenje, optimizam, putovanja',
    capricorn: 'disciplina, odgovornost, dugoročno',
    aquarius: 'inovacije, sloboda, zajednica',
    pisces: 'intuicija, empatija, oporavak',
  },
  en: {
    aries: 'initiative, courage, first steps',
    taurus: 'stability, body, finances, rhythm',
    gemini: 'communication, learning, movement',
    cancer: 'emotions, home, closeness',
    leo: 'creativity, confidence, visibility',
    virgo: 'routine, details, health',
    libra: 'balance, relationships, aesthetics',
    scorpio: 'depth, transformation, boundaries',
    sagittarius: 'expansion, optimism, travel',
    capricorn: 'discipline, responsibility, long-term goals',
    aquarius: 'innovation, freedom, community',
    pisces: 'intuition, empathy, recovery',
  },
};

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
  if (!resendApiKey || !resendFromEmail) {
    return { ok: false, error: 'Resend not configured' };
  }

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

    const responseText = await response.text();

    if (!response.ok) {
      console.error('Resend API error:', response.status, responseText);
      return { ok: false, error: responseText || response.statusText };
    }

    let responseJson = null;
    if (responseText) {
      try {
        responseJson = JSON.parse(responseText);
      } catch {
        responseJson = null;
      }
    }

    return { ok: true, id: responseJson?.id };
  } catch (error) {
    console.error('Resend request failed:', error);
    return { ok: false, error: error instanceof Error ? error.message : 'Resend request failed' };
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
  language,
}) => {
  const normalizedLanguage = getSupportedLanguage(language);
  const copy = getOrderEmailCopy(language);
  const templateValues = {
    name: customerName,
    product: productName,
  };
  const heroTitle = formatOrderTemplate(copy.heroTitle, templateValues);
  const heroSubtitle = formatOrderTemplate(copy.heroSubtitle, templateValues);
  const formattedBirthDate = formatBirthDateForEmail(birthDate, normalizedLanguage);
  const safeBirthDate = escapeHtml(formattedBirthDate || birthDate);
  const safeBirthTime = escapeHtml(birthTime || '-');
  const safeBirthPlace = escapeHtml(birthPlace);
  const safeNote = note ? escapeHtml(note) : '';

  if (adminNotificationEmails.length > 0) {
    await sendResendEmail({
      to: adminNotificationEmails,
      subject: `Nova narudžbina: ${productName}`,
      html: `
        <h1>Nova narudžbina primljena!</h1>
        <h2>Detalji narudžbine:</h2>
        <ul>
          <li><strong>Proizvod:</strong> ${productName}</li>
          <li><strong>Ime kupca:</strong> ${customerName}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Datum rođenja:</strong> ${safeBirthDate}</li>
          <li><strong>Vreme rođenja:</strong> ${safeBirthTime || 'Nije navedeno'}</li>
          <li><strong>Mesto rođenja:</strong> ${safeBirthPlace}</li>
          ${note ? `<li><strong>Napomena:</strong> ${safeNote}</li>` : ''}
        </ul>
        <p>Posetite dashboard za više detalja.</p>
      `,
    });
  }

  await sendResendEmail({
    to: email,
    subject: copy.subject(productName),
    html: `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0b0a13; padding:24px; font-family:Arial, sans-serif; color:#e8e4ff;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; background-color:#17122b; border:1px solid #2a2248; border-radius:16px; overflow:hidden;">
              <tr>
                <td style="background:linear-gradient(135deg,#7c3aed 0%,#db2777 100%); padding:24px 28px; color:#fff;">
                  <h1 style="margin:0 0 6px; font-size:24px; line-height:1.3;">${heroTitle}</h1>
                  <p style="margin:0; font-size:14px; opacity:.95;">${heroSubtitle}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:24px 28px;">
                  <h2 style="margin:0 0 12px; font-size:16px; color:#c9b8ff; text-transform:uppercase; letter-spacing:.08em;">${copy.detailsTitle}</h2>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;">
                    <tr>
                      <td style="padding:8px 0; color:#a59ac7;">${copy.labels.birthDate}</td>
                      <td style="padding:8px 0; text-align:right; color:#ffffff;">${safeBirthDate}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0; color:#a59ac7;">${copy.labels.birthTime}</td>
                      <td style="padding:8px 0; text-align:right; color:#ffffff;">${safeBirthTime}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0; color:#a59ac7;">${copy.labels.birthPlace}</td>
                      <td style="padding:8px 0; text-align:right; color:#ffffff;">${safeBirthPlace}</td>
                    </tr>
                    ${
                      note
                        ? `
                    <tr>
                      <td style="padding:8px 0; color:#a59ac7; vertical-align:top;">${copy.labels.note}</td>
                      <td style="padding:8px 0; text-align:right; color:#ffffff; white-space:pre-wrap;">${safeNote}</td>
                    </tr>`
                        : ''
                    }
                  </table>
                  <p style="margin:20px 0 0; font-size:14px; color:#d7cff5;">
                    ${copy.reportLine}
                  </p>
                  <p style="margin:16px 0 0; font-size:14px; color:#c9b8ff;">${copy.signOffLine1}<br>${copy.signOffLine2}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 28px; background-color:#120f22; color:#8d82b8; font-size:12px; text-align:center;">
                  ${copy.footer}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
  });
};

const sendManualReportEmail = async ({
  email,
  firstName,
  productName,
  subject,
  message,
  language,
}) => {
  const copy = getManualReportEmailCopy(language);
  const greetingName = firstName ? ` ${firstName}` : '';
  const intro = formatOrderTemplate(copy.intro, { product: productName });
  const subjectLine = formatPlainTemplate(copy.subject, { product: productName });
  const trimmedSubject = String(subject || '').trim();
  const finalSubject = trimmedSubject || subjectLine;

  const paragraphs = String(message || '')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const body = paragraphs.length
    ? paragraphs
        .map((paragraph) => {
          const withBreaks = escapeHtml(paragraph).replace(/\n/g, '<br />');
          return `<p style="margin: 0 0 10px;">${withBreaks}</p>`;
        })
        .join('')
    : '<p style="margin: 0;">-</p>';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; color: #e8e4ff; background-color: #0b0a13;">
      <h1 style="font-size: 22px; margin: 0 0 8px;">${escapeHtml(copy.greeting)}${escapeHtml(greetingName)}</h1>
      <p style="margin: 0 0 16px; color: #b7b0d9;">${intro}</p>
      <div style="background: #171429; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
        ${body}
      </div>
      <p style="margin: 0 0 12px; color: #b7b0d9;">${escapeHtml(copy.outro)}</p>
      <p style="margin: 0; font-size: 12px; color: #8a82b8;">${escapeHtml(copy.footer)}</p>
    </div>
  `;

  return sendResendEmail({
    to: email,
    subject: finalSubject,
    html,
  });
};

const horoscopeSubscriptionPlans = new Map([
  ['monthly-basic', 'basic'],
]);

const productPriceCentsById = new Map([
  ['monthly-basic', 0],
  ['report-natal', 11000],
  ['report-yearly', 7000],
  ['report-solar', 9000],
  ['report-synastry', 15000],
  ['report-questions', 3500],
  ['report-love', 1000],
  ['report-career', 1200],
  ['consult-email', 600],
  ['consult-vip', 1200],
  ['consult-live', 1500],
  ['physical-talisman', 3000],
  ['physical-crystal', 4000],
]);

const getProductPriceCents = (productId) => {
  const price = productPriceCentsById.get(productId);
  return Number.isFinite(price) ? price : 0;
};

const clampPercent = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.min(Math.max(Math.round(numeric), 0), 100);
};

const buildOrderPayload = (body) => {
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
    language,
    timezone,
    gender,
    referral_code,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    referrer,
    landing_path,
    session_id,
  } = body || {};

  const normalizedBirthTime = String(birth_time || '').trim();
  const normalizedGender = normalizeGender(gender);
  const normalizedLanguage = getSupportedLanguage(language);
  const normalizedCustomerName = String(customer_name || `${first_name || ''} ${last_name || ''}`).trim();
  const normalizedUtmSource = normalizeAnalyticsValue(utm_source, 120);
  const normalizedUtmMedium = normalizeAnalyticsValue(utm_medium, 120);
  const normalizedUtmCampaign = normalizeAnalyticsValue(utm_campaign, 160);
  const normalizedUtmTerm = normalizeAnalyticsValue(utm_term, 160);
  const normalizedUtmContent = normalizeAnalyticsValue(utm_content, 160);
  const normalizedReferrer = normalizeAnalyticsValue(referrer, 800);
  const normalizedLandingPath = normalizeAnalyticsValue(landing_path, 400);
  const normalizedSessionId = normalizeAnalyticsValue(session_id, 120);

  if (
    !product_id ||
    !product_name ||
    !normalizedCustomerName ||
    !first_name ||
    !last_name ||
    !birth_date ||
    !normalizedBirthTime ||
    !birth_place ||
    !city ||
    !country ||
    !email
  ) {
    return { error: 'Missing required fields' };
  }

  return {
    data: {
      product_id,
      product_name,
      customer_name: normalizedCustomerName,
      first_name,
      last_name,
      birth_date,
      birth_time: normalizedBirthTime,
      birth_place,
      city,
      country,
      email,
      gender: normalizedGender,
      note,
      consultation_description,
      language: normalizedLanguage,
      timezone,
      referral_code,
      utm_source: normalizedUtmSource,
      utm_medium: normalizedUtmMedium,
      utm_campaign: normalizedUtmCampaign,
      utm_term: normalizedUtmTerm,
      utm_content: normalizedUtmContent,
      referrer: normalizedReferrer,
      landing_path: normalizedLandingPath,
      session_id: normalizedSessionId,
    },
  };
};

const getOrderPricing = async ({ product_id, referral_code }) => {
  const basePriceCents = getProductPriceCents(product_id);
  let referralId = null;
  let referralCode = null;
  let discountPercent = 0;
  let discountAmountCents = 0;
  let finalPriceCents = basePriceCents;
  let commissionPercent = 0;
  let commissionAmountCents = 0;
  let referralPaidCents = 0;

  const normalizedReferralCode = normalizeReferralCode(referral_code);
  if (normalizedReferralCode) {
    const { rows: referralRows } = await pool.query(
      `SELECT id, code, discount_percent, commission_percent, is_active
       FROM referrals
       WHERE code = $1
       LIMIT 1`,
      [normalizedReferralCode]
    );
    const referral = referralRows[0];
    if (!referral || !referral.is_active) {
      return { error: 'Invalid referral code' };
    }
    referralId = referral.id;
    referralCode = referral.code;
    discountPercent = clampPercent(referral.discount_percent);
    commissionPercent = clampPercent(referral.commission_percent);
    discountAmountCents = Math.round((basePriceCents * discountPercent) / 100);
    finalPriceCents = Math.max(basePriceCents - discountAmountCents, 0);
    commissionAmountCents = Math.round((finalPriceCents * commissionPercent) / 100);
  }

  return {
    basePriceCents,
    referralId,
    referralCode,
    discountPercent,
    discountAmountCents,
    finalPriceCents,
    commissionPercent,
    commissionAmountCents,
    referralPaidCents,
  };
};

const insertOrderRecord = async (payload, pricing) => {
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
      gender,
      note,
      consultation_description,
      language,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      referrer,
      landing_path,
      session_id,
      referral_id,
      referral_code,
      base_price_cents,
      discount_percent,
      discount_amount_cents,
      final_price_cents,
      referral_commission_percent,
      referral_commission_cents,
      referral_paid_cents,
      referral_paid,
      referral_paid_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34)
    RETURNING id`,
    [
      payload.product_id,
      payload.product_name,
      payload.customer_name,
      payload.first_name,
      payload.last_name,
      payload.birth_date,
      payload.birth_time,
      payload.birth_place,
      payload.city,
      payload.country,
      payload.email,
      payload.gender,
      payload.note || null,
      payload.consultation_description || null,
      payload.language,
      payload.utm_source || null,
      payload.utm_medium || null,
      payload.utm_campaign || null,
      payload.utm_term || null,
      payload.utm_content || null,
      payload.referrer || null,
      payload.landing_path || null,
      payload.session_id || null,
      pricing.referralId,
      pricing.referralCode,
      pricing.basePriceCents,
      pricing.discountPercent,
      pricing.discountAmountCents,
      pricing.finalPriceCents,
      pricing.commissionPercent,
      pricing.commissionAmountCents,
      pricing.referralPaidCents,
      false,
      null,
    ]
  );

  return rows[0]?.id;
};

const logOrderCreatedEvent = async (orderId, payload, pricing) => {
  if (!orderId) return;
  await logAnalyticsEvent({
    event_type: 'order_created',
    order_id: orderId,
    product_id: payload.product_id,
    value_cents: pricing.finalPriceCents,
    currency: orderCurrency,
    referral_code: pricing.referralCode || payload.referral_code || null,
    utm_source: payload.utm_source,
    utm_medium: payload.utm_medium,
    utm_campaign: payload.utm_campaign,
    utm_term: payload.utm_term,
    utm_content: payload.utm_content,
    referrer: payload.referrer,
    path: payload.landing_path,
    session_id: payload.session_id,
  });
};

const logCheckoutStartedEvent = async (orderId, payload, pricing) => {
  if (!orderId) return;
  await logAnalyticsEvent({
    event_type: 'checkout_started',
    order_id: orderId,
    product_id: payload.product_id,
    value_cents: pricing.finalPriceCents,
    currency: orderCurrency,
    referral_code: pricing.referralCode || payload.referral_code || null,
    utm_source: payload.utm_source,
    utm_medium: payload.utm_medium,
    utm_campaign: payload.utm_campaign,
    utm_term: payload.utm_term,
    utm_content: payload.utm_content,
    referrer: payload.referrer,
    path: payload.landing_path,
    session_id: payload.session_id,
  });
};

const logOrderCompletedEvent = async (order) => {
  if (!order?.id) return;
  await logAnalyticsEvent({
    event_type: 'order_completed',
    order_id: order.id,
    product_id: order.product_id,
    value_cents: order.final_price_cents,
    currency: orderCurrency,
    referral_code: order.referral_code,
    utm_source: order.utm_source,
    utm_medium: order.utm_medium,
    utm_campaign: order.utm_campaign,
    utm_term: order.utm_term,
    utm_content: order.utm_content,
    referrer: order.referrer,
    path: order.landing_path,
    session_id: order.session_id,
  });
};

const fulfillOrderFromRow = async (order, timezoneOverride) => {
  const normalizedLanguage = getSupportedLanguage(order.language);

  await sendOrderNotifications({
    customerName: order.customer_name,
    email: order.email,
    productName: order.product_name,
    birthDate: order.birth_date,
    birthPlace: order.birth_place,
    birthTime: order.birth_time,
    note: order.note,
    language: normalizedLanguage,
  });

  const plan = horoscopeSubscriptionPlans.get(order.product_id);
  if (!plan) return;

  try {
    const subscription = await createHoroscopeSubscription({
      orderId: order.id,
      email: order.email,
      firstName: order.first_name,
      lastName: order.last_name,
      birthDate: order.birth_date,
      birthTime: order.birth_time,
      gender: normalizeGender(order.gender),
      language: normalizedLanguage,
      timezone: timezoneOverride || horoscopeDefaultTimezone,
      plan,
      sendNow: true,
    });

    if (subscription) {
      if (!openai || !resendApiKey || !resendFromEmail) {
        console.warn('Daily horoscope send skipped: OpenAI/Resend not configured.');
      } else {
        const sendAt = new Date();
        setTimeout(() => {
          deliverSubscriptionHoroscope(subscription, new Map(), {
            sendAt,
            forceNextDay: true,
            isImmediate: true,
          }).catch((sendError) => {
            console.error('Failed to send initial horoscope:', sendError);
          });
        }, 0);
      }
    }
  } catch (subscriptionError) {
    console.error('Failed to create horoscope subscription:', subscriptionError);
  }
};

const normalizeReferralCode = (value) => String(value || '').trim().toUpperCase();
const normalizeBlogSlug = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .trim();

const createExcerpt = (content) => {
  const cleaned = String(content || '').replace(/\s+/g, ' ').trim();
  if (cleaned.length <= 180) return cleaned;
  return `${cleaned.slice(0, 177)}...`;
};

const parseJsonArray = (value) => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const blogUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, blogUploadsDir),
    filename: (_req, file, cb) => {
      const safeExt = path.extname(file.originalname || '').slice(0, 10);
      cb(null, `${Date.now()}-${crypto.randomUUID()}${safeExt}`);
    },
  }),
  fileFilter: (_req, file, cb) => {
    if (file.fieldname === 'images' && file.mimetype.startsWith('image/')) {
      return cb(null, true);
    }
    if (file.fieldname === 'attachments' && file.mimetype === 'application/pdf') {
      return cb(null, true);
    }
    return cb(new Error('Unsupported file type'));
  },
  limits: {
    files: 6,
    fileSize: 15 * 1024 * 1024,
  },
}).fields([
  { name: 'images', maxCount: 3 },
  { name: 'attachments', maxCount: 3 },
]);

const buildBlogAsset = (file) => ({
  url: `${normalizedApiBaseUrl}/uploads/blog/${file.filename}`,
  name: file.originalname,
  mime: file.mimetype,
});

const ensureUniqueBlogSlug = async (baseSlug) => {
  const normalizedBase = baseSlug || 'blog-post';
  let slug = normalizedBase;
  let suffix = 1;
  while (true) {
    const { rowCount } = await pool.query('SELECT 1 FROM blog_posts WHERE slug = $1 LIMIT 1', [slug]);
    if (!rowCount) return slug;
    suffix += 1;
    slug = `${normalizedBase}-${suffix}`;
  }
};

const getSupportedLanguage = (language) =>
  Object.prototype.hasOwnProperty.call(languageLabelByCode, language) ? language : 'sr';

const getLanguageLabel = (language) => languageLabelByCode[getSupportedLanguage(language)];

const getDateLocale = (language) => dateLocaleByLanguage[getSupportedLanguage(language)] || 'sr-RS';

const getZodiacLabel = (signKey, language) => {
  const labels = zodiacLabelsByLanguage[getSupportedLanguage(language)] || zodiacLabelsByLanguage.sr;
  return labels?.[signKey] || signKey;
};

const getTimeZoneParts = (date, timeZone) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const values = {};
  for (const part of parts) {
    if (part.type !== 'literal') {
      values[part.type] = part.value;
    }
  }
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
  };
};

const normalizeTimezone = (timezone) => {
  if (!timezone || typeof timezone !== 'string') {
    return horoscopeDefaultTimezone;
  }
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezone });
    return timezone;
  } catch {
    return horoscopeDefaultTimezone;
  }
};

const normalizeBirthTime = (birthTime) => {
  if (!birthTime) return null;
  const match = String(birthTime).trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const normalizeSendHour = (value) => {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') {
    if (Number.isInteger(value) && value >= 0 && value <= 23) return value;
    return null;
  }
  const trimmed = String(value).trim();
  const timeMatch = trimmed.match(/^(\d{1,2})(?::(\d{2}))?$/);
  if (!timeMatch) return null;
  const hours = Number(timeMatch[1]);
  if (!Number.isFinite(hours) || hours < 0 || hours > 23) return null;
  return hours;
};

const normalizeGender = (gender) => {
  const normalized = String(gender || '').trim().toLowerCase();
  if (normalized === 'male' || normalized === 'female') {
    return normalized;
  }
  return 'unspecified';
};

const getTimeZoneOffsetMs = (date, timeZone) => {
  const locale = 'en-US';
  const zonedDate = new Date(date.toLocaleString(locale, { timeZone }));
  return date.getTime() - zonedDate.getTime();
};

const getZonedDateFromParts = (parts, timeZone) => {
  const utcDate = new Date(
    Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour || 0, parts.minute || 0, 0, 0)
  );
  const offset = getTimeZoneOffsetMs(utcDate, timeZone);
  return new Date(utcDate.getTime() + offset);
};

const getNextSendAt = (fromDate, timeZone, sendHour) => {
  const parts = getTimeZoneParts(fromDate, timeZone);
  let candidate = getZonedDateFromParts({ ...parts, hour: sendHour, minute: 0 }, timeZone);
  if (candidate <= fromDate) {
    const nextDay = new Date(fromDate.getTime() + 24 * 60 * 60 * 1000);
    const nextParts = getTimeZoneParts(nextDay, timeZone);
    candidate = getZonedDateFromParts({ ...nextParts, hour: sendHour, minute: 0 }, timeZone);
  }
  return candidate;
};

const getNextSendAtAfterImmediate = (fromDate, timeZone, sendHour) => {
  const parts = getTimeZoneParts(fromDate, timeZone);
  const utcDate = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + 1, sendHour, 0, 0, 0));
  const offset = getTimeZoneOffsetMs(utcDate, timeZone);
  return new Date(utcDate.getTime() + offset);
};

const getLocalDateKey = (date, timeZone) => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date);
};

const getLocalizedDateLabel = (date, timeZone, language) => {
  const locale = getDateLocale(language);
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const getZodiacSignFromDateString = (birthDate) => {
  if (!birthDate || typeof birthDate !== 'string') return null;
  const [year, month, day] = birthDate.split('-').map((part) => Number(part));
  if (!year || !month || !day) return null;

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
  return 'pisces';
};

const escapeHtml = (value) =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const normalizeAnalyticsValue = (value, maxLen = 300) => {
  if (value === null || value === undefined) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  return trimmed.length > maxLen ? trimmed.slice(0, maxLen) : trimmed;
};

const normalizeAnalyticsCents = (value) => {
  if (value === null || value === undefined) return null;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return Math.max(0, Math.floor(numeric));
};

const getReferrerHost = (referrer) => {
  const normalized = normalizeAnalyticsValue(referrer, 800);
  if (!normalized) return null;
  try {
    return new URL(normalized).hostname || null;
  } catch {
    return null;
  }
};

const buildAnalyticsEvent = (payload = {}) => {
  const eventType = normalizeAnalyticsValue(payload.event_type, 80);
  if (!eventType || !analyticsEventTypes.has(eventType)) {
    return null;
  }

  const referrer = normalizeAnalyticsValue(payload.referrer, 800);
  return {
    event_type: eventType,
    path: normalizeAnalyticsValue(payload.path, 400),
    referrer,
    referrer_host: getReferrerHost(referrer),
    utm_source: normalizeAnalyticsValue(payload.utm_source, 120),
    utm_medium: normalizeAnalyticsValue(payload.utm_medium, 120),
    utm_campaign: normalizeAnalyticsValue(payload.utm_campaign, 160),
    utm_term: normalizeAnalyticsValue(payload.utm_term, 160),
    utm_content: normalizeAnalyticsValue(payload.utm_content, 160),
    referral_code: normalizeAnalyticsValue(payload.referral_code, 120),
    product_id: normalizeAnalyticsValue(payload.product_id, 120),
    order_id: Number.isInteger(Number(payload.order_id)) ? Number(payload.order_id) : null,
    value_cents: normalizeAnalyticsCents(payload.value_cents),
    currency: normalizeAnalyticsValue(payload.currency, 12),
    session_id: normalizeAnalyticsValue(payload.session_id, 120),
    user_agent: normalizeAnalyticsValue(payload.user_agent, 240),
  };
};

const logAnalyticsEvent = async (payload) => {
  if (!pool) return;
  const event = buildAnalyticsEvent(payload);
  if (!event) return;

  try {
    await pool.query(
      `INSERT INTO analytics_events (
        event_type,
        path,
        referrer,
        referrer_host,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content,
        referral_code,
        product_id,
        order_id,
        value_cents,
        currency,
        session_id,
        user_agent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
      [
        event.event_type,
        event.path,
        event.referrer,
        event.referrer_host,
        event.utm_source,
        event.utm_medium,
        event.utm_campaign,
        event.utm_term,
        event.utm_content,
        event.referral_code,
        event.product_id,
        event.order_id,
        event.value_cents,
        event.currency,
        event.session_id,
        event.user_agent,
      ]
    );
  } catch (error) {
    console.error('Failed to store analytics event:', error);
  }
};

const formatBirthDateForEmail = (birthDate, language) => {
  if (!birthDate) return '';
  let year;
  let month;
  let day;

  if (birthDate instanceof Date && !Number.isNaN(birthDate.valueOf())) {
    year = birthDate.getUTCFullYear();
    month = birthDate.getUTCMonth() + 1;
    day = birthDate.getUTCDate();
  } else if (typeof birthDate === 'string') {
    const trimmed = birthDate.trim();
    const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      year = Number(match[1]);
      month = Number(match[2]);
      day = Number(match[3]);
    } else {
      const parsed = new Date(trimmed);
      if (!Number.isNaN(parsed.valueOf())) {
        year = parsed.getUTCFullYear();
        month = parsed.getUTCMonth() + 1;
        day = parsed.getUTCDate();
      }
    }
  }

  if (!year || !month || !day) return String(birthDate);

  const utcDate = new Date(Date.UTC(year, month - 1, day));
  const locale = getDateLocale(language);
  return new Intl.DateTimeFormat(locale, {
    timeZone: 'UTC',
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(utcDate);
};

const formatOrderTemplate = (template, values) =>
  String(template || '').replace(/\{(\w+)\}/g, (_match, key) => escapeHtml(values?.[key] ?? ''));

const formatPlainTemplate = (template, values) =>
  String(template || '').replace(/\{(\w+)\}/g, (_match, key) => String(values?.[key] ?? ''));

const getOrderEmailCopy = (language) => {
  const normalized = getSupportedLanguage(language);
  const copy = {
    sr: {
      subject: (productName) => `Vaša narudžbina je primljena - ${productName}`,
      heroTitle: 'Hvala vam na narudžbini, {name}!',
      heroSubtitle: 'Vaša narudžbina za {product} je uspešno primljena.',
      detailsTitle: 'Detalji',
      labels: {
        birthDate: 'Datum rođenja',
        birthTime: 'Vreme rođenja',
        birthPlace: 'Mesto rođenja',
        note: 'Napomena',
      },
      reportLine: 'Vaš astrološki izveštaj ćete dobiti na ovaj email u najkraćem mogućem roku.',
      signOffLine1: 'Srdačan pozdrav,',
      signOffLine2: 'Astro Portal Tim',
      footer: 'Ova poruka je automatski poslata. Ako imate pitanja, odgovorite na ovaj email.',
    },
    en: {
      subject: (productName) => `Your order has been received - ${productName}`,
      heroTitle: 'Thank you for your order, {name}!',
      heroSubtitle: 'Your order for {product} has been received successfully.',
      detailsTitle: 'Details',
      labels: {
        birthDate: 'Birth date',
        birthTime: 'Birth time',
        birthPlace: 'Place of birth',
        note: 'Note',
      },
      reportLine: 'Your astrological report will be sent to this email as soon as possible.',
      signOffLine1: 'Best regards,',
      signOffLine2: 'Astro Portal Team',
      footer: 'This message was sent automatically. If you have questions, reply to this email.',
    },
    fr: {
      subject: (productName) => `Votre commande a été reçue - ${productName}`,
      heroTitle: 'Merci pour votre commande, {name} !',
      heroSubtitle: 'Votre commande pour {product} a bien été reçue.',
      detailsTitle: 'Détails',
      labels: {
        birthDate: 'Date de naissance',
        birthTime: 'Heure de naissance',
        birthPlace: 'Lieu de naissance',
        note: 'Note',
      },
      reportLine: 'Votre rapport astrologique sera envoyé à cet email dès que possible.',
      signOffLine1: 'Cordialement,',
      signOffLine2: 'Équipe Astro Portal',
      footer: 'Ce message a été envoyé automatiquement. Si vous avez des questions, répondez à cet email.',
    },
    de: {
      subject: (productName) => `Ihre Bestellung ist eingegangen - ${productName}`,
      heroTitle: 'Vielen Dank für Ihre Bestellung, {name}!',
      heroSubtitle: 'Ihre Bestellung für {product} ist erfolgreich eingegangen.',
      detailsTitle: 'Details',
      labels: {
        birthDate: 'Geburtsdatum',
        birthTime: 'Geburtszeit',
        birthPlace: 'Geburtsort',
        note: 'Notiz',
      },
      reportLine: 'Ihr astrologischer Bericht wird so schnell wie möglich an diese E-Mail gesendet.',
      signOffLine1: 'Mit freundlichen Grüßen,',
      signOffLine2: 'Astro Portal Team',
      footer: 'Diese Nachricht wurde automatisch gesendet. Bei Fragen antworten Sie auf diese E-Mail.',
    },
    es: {
      subject: (productName) => `Tu pedido ha sido recibido - ${productName}`,
      heroTitle: 'Gracias por tu pedido, {name}!',
      heroSubtitle: 'Tu pedido de {product} se ha recibido correctamente.',
      detailsTitle: 'Detalles',
      labels: {
        birthDate: 'Fecha de nacimiento',
        birthTime: 'Hora de nacimiento',
        birthPlace: 'Lugar de nacimiento',
        note: 'Nota',
      },
      reportLine: 'Tu informe astrológico se enviará a este correo lo antes posible.',
      signOffLine1: 'Un saludo cordial,',
      signOffLine2: 'Equipo Astro Portal',
      footer: 'Este mensaje se envió automáticamente. Si tienes preguntas, responde a este correo.',
    },
    ru: {
      subject: (productName) => `Ваш заказ получен - ${productName}`,
      heroTitle: 'Спасибо за ваш заказ, {name}!',
      heroSubtitle: 'Ваш заказ на {product} успешно получен.',
      detailsTitle: 'Детали',
      labels: {
        birthDate: 'Дата рождения',
        birthTime: 'Время рождения',
        birthPlace: 'Место рождения',
        note: 'Примечание',
      },
      reportLine: 'Ваш астрологический отчет будет отправлен на этот email в ближайшее время.',
      signOffLine1: 'С уважением,',
      signOffLine2: 'Команда Astro Portal',
      footer: 'Это сообщение отправлено автоматически. Если у вас есть вопросы, ответьте на это письмо.',
    },
  };
  return copy[normalized] || copy.sr;
};

const getManualReportEmailCopy = (language) => {
  const normalized = getSupportedLanguage(language);
  const copy = {
    sr: {
      subject: 'Vaš izveštaj je spreman - {product}',
      greeting: 'Zdravo',
      intro: 'Vaš izveštaj za {product} je spreman.',
      outro: 'Ako imate pitanja, slobodno odgovorite na ovaj email.',
      footer: 'Ova poruka je automatski poslata.',
    },
    en: {
      subject: 'Your report is ready - {product}',
      greeting: 'Hello',
      intro: 'Your report for {product} is ready.',
      outro: 'If you have questions, feel free to reply to this email.',
      footer: 'This message was sent automatically.',
    },
    fr: {
      subject: 'Votre rapport est prêt - {product}',
      greeting: 'Bonjour',
      intro: 'Votre rapport pour {product} est prêt.',
      outro: 'Si vous avez des questions, n’hésitez pas à répondre à cet email.',
      footer: 'Ce message a été envoyé automatiquement.',
    },
    de: {
      subject: 'Ihr Bericht ist bereit - {product}',
      greeting: 'Hallo',
      intro: 'Ihr Bericht für {product} ist bereit.',
      outro: 'Wenn Sie Fragen haben, antworten Sie gerne auf diese E-Mail.',
      footer: 'Diese Nachricht wurde automatisch gesendet.',
    },
    es: {
      subject: 'Tu informe está listo - {product}',
      greeting: 'Hola',
      intro: 'Tu informe para {product} está listo.',
      outro: 'Si tienes preguntas, responde a este correo.',
      footer: 'Este mensaje se envió automáticamente.',
    },
    ru: {
      subject: 'Ваш отчет готов - {product}',
      greeting: 'Здравствуйте',
      intro: 'Ваш отчет по {product} готов.',
      outro: 'Если у вас есть вопросы, ответьте на это письмо.',
      footer: 'Это сообщение отправлено автоматически.',
    },
  };
  return copy[normalized] || copy.sr;
};

const getHoroscopeEmailCopy = (language) => {
  const normalized = getSupportedLanguage(language);
  const copy = {
    sr: {
      subject: 'Vaš dnevni horoskop',
      immediateGreeting: 'Zdravo',
      greeting: 'Dobro jutro',
      intro: 'Vaš personalizovani horoskop',
      outro: 'Želimo vam miran i uspešan dan.',
      unsubscribe: 'Ako ne želite da dobijate ovaj horoskop, odjavite se ovde.',
    },
    en: {
      subject: 'Your daily horoscope',
      immediateGreeting: 'Hello',
      greeting: 'Good morning',
      intro: 'Your personalized horoscope',
      outro: 'Wishing you a calm and successful day.',
      unsubscribe: 'If you want to unsubscribe, click here.',
    },
  };
  return copy[normalized] || copy.sr;
};

const parseJsonFromText = (text) => {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const fillTemplate = (template, params) =>
  String(template || '').replace(/\{(\w+)\}/g, (_match, key) => encodeURIComponent(params?.[key] ?? ''));

const cleanDailyContext = (value) => {
  const stripped = String(value || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ');
  const normalized = stripped.replace(/\s+/g, ' ').trim();
  if (!normalized) return '';
  return normalized.length > dailyContextMaxLen ? `${normalized.slice(0, dailyContextMaxLen)}…` : normalized;
};

const getDailyContextCacheKey = (dateKey, language, signKey) => `${dateKey}:${language}:${signKey || 'all'}`;

const extractMetaDescription = (html) => {
  const patterns = [
    /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return match[1];
  }
  return '';
};

const fetchDailyContextFromUrl = async (url) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), dailyContextTimeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': dailyContextUserAgent,
        'Accept-Language': dailyContextAcceptLanguage,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    const raw = await response.text();
    if (!raw) return '';

    try {
      const parsed = JSON.parse(raw);
      const candidate = parsed?.text || parsed?.summary || parsed?.data?.text || '';
      return cleanDailyContext(candidate);
    } catch {
      const meta = extractMetaDescription(raw);
      return cleanDailyContext(meta || raw);
    }
  } catch (error) {
    console.error('Daily context fetch failed:', error);
    return '';
  } finally {
    clearTimeout(timeout);
  }
};

const getDailyContext = async ({ dateKey, language, signKey }) => {
  if (!dailyContextUrlTemplates.length || !dateKey) return null;
  const cacheKey = getDailyContextCacheKey(dateKey, language, signKey);
  const cached = dailyContextCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.text;
  }

  const urls = dailyContextUrlTemplates
    .map((template) => fillTemplate(template, { date: dateKey, language, sign: signKey || '' }))
    .filter(Boolean);
  if (!urls.length) return null;

  const snippets = [];
  for (const url of urls) {
    const text = await fetchDailyContextFromUrl(url);
    if (text) snippets.push(text);
  }

  const combined = cleanDailyContext(snippets.join(' '));
  if (!combined) return null;

  dailyContextCache.set(cacheKey, {
    text: combined,
    expiresAt: Date.now() + dailyContextCacheTtlMs,
  });
  return combined;
};

const getSignPersona = (signKey, language) => {
  const map = signPersonaByLanguage[language] || signPersonaByLanguage.en;
  return map?.[signKey] || '';
};

const getSeasonalFocus = (dateKey, language) => {
  const signKey = getZodiacSignFromDateString(dateKey);
  if (!signKey) return '';
  const map = seasonalFocusByLanguage[language] || seasonalFocusByLanguage.en;
  return map?.[signKey] || '';
};

const buildCompatibilityCacheKey = (sign1, sign2, compatibility, language) => {
  const first = String(sign1 || '').trim().toLowerCase();
  const second = String(sign2 || '').trim().toLowerCase();
  const pair = [first, second].sort().join(':');
  return `${pair}:${compatibility}:${language}`;
};

const getCachedCompatibility = (key) => {
  const entry = compatibilityCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    compatibilityCache.delete(key);
    return null;
  }
  return entry.text;
};

const setCachedCompatibility = (key, text) => {
  if (!text) return;
  if (compatibilityCache.size >= compatibilityCacheMax) {
    const oldestKey = compatibilityCache.keys().next().value;
    if (oldestKey) compatibilityCache.delete(oldestKey);
  }
  compatibilityCache.set(key, { text, expiresAt: Date.now() + compatibilityCacheTtlMs });
};

const hasExactSign = (text, signLabel) => {
  if (!text || !signLabel) return false;
  const pattern = new RegExp(`(^|[^\\p{L}])${escapeRegex(signLabel)}([^\\p{L}]|$)`, 'iu');
  return pattern.test(text);
};

const containsDisallowedSign = (text, allowedLabels, allLabels) => {
  const allowed = new Set(allowedLabels);
  return allLabels.some((label) => !allowed.has(label) && hasExactSign(text, label));
};

const validateSignMentions = (text, sign1Label, sign2Label, signLabels) => {
  if (!text) return false;
  if (!hasExactSign(text, sign1Label) || !hasExactSign(text, sign2Label)) {
    return false;
  }
  const mentioned = signLabels.filter((label) => hasExactSign(text, label));
  return mentioned.every((label) => label === sign1Label || label === sign2Label);
};

const generateDailyHoroscope = async ({
  signKey,
  language,
  dateLabel,
  horoscopeDate,
  plan = 'basic',
  birthTime,
  gender,
}) => {
  if (!openai) return null;
  const normalizedLanguage = getSupportedLanguage(language);
  const signLabel = getZodiacLabel(signKey, normalizedLanguage);
  const sectionLabels = horoscopeSectionLabelsByLanguage[normalizedLanguage] || horoscopeSectionLabelsByLanguage.sr;
  const languageLabel = getLanguageLabel(normalizedLanguage);
  const normalizedPlan = plan === 'premium' ? 'premium' : 'basic';
  const normalizedBirthTime = normalizeBirthTime(birthTime);
  const normalizedGender = normalizeGender(gender);
  const signPersona = getSignPersona(signKey, normalizedLanguage);
  const seasonalFocus = horoscopeDate ? getSeasonalFocus(horoscopeDate, normalizedLanguage) : '';
  const dailyContext = horoscopeDate
    ? await getDailyContext({ dateKey: horoscopeDate, language: normalizedLanguage, signKey })
    : null;
  const birthTimeLine = normalizedBirthTime
    ? `Birth time (24h): ${normalizedBirthTime}. Use it to adjust the tone and focus, but do NOT mention the time directly.`
    : 'Birth time is not available; do not reference or infer it.';
  const genderLine =
    normalizedGender === 'male'
      ? 'Use masculine grammatical gender when the language supports it (especially in Serbian). Do not mention gender explicitly.'
      : normalizedGender === 'female'
        ? 'Use feminine grammatical gender when the language supports it (especially in Serbian). Do not mention gender explicitly.'
        : 'Use gender-neutral wording and avoid gendered adjectives when possible. Do not mention gender explicitly.';
  const contextLines = [
    signPersona ? `Sign personality anchor (do not mention the sign name): ${signPersona}.` : '',
    seasonalFocus ? `Seasonal focus based on today's date: ${seasonalFocus}.` : '',
    dailyContext
      ? `Daily context from online sources (use only if relevant; do not quote or mention sources): ${dailyContext}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');

  const prompt = normalizedPlan === 'premium'
    ? `
You are an astrologer. Write a detailed daily horoscope for ${signLabel} for ${dateLabel} in ${languageLabel}.
${contextLines}
${birthTimeLine}
${genderLine}
Return ONLY a JSON object with keys "work", "health", and "love".
Each value must contain 3 paragraphs separated by a blank line. Each paragraph should be 2-3 sentences.
Each paragraph must include one concrete scenario and one actionable suggestion.
Write in second person, warm, specific, and grounded in everyday details.
Base the horoscope on the daily context above and rewrite it fully in your own words. Do not quote or mention sources.
Ensure the wording is fresh and different each day; do not reuse or repeat sentences across sections.
Do not mention any zodiac sign names, the ascendant, or the moon sign. Avoid lists and emojis.`
    : `
You are an astrologer. Write a daily horoscope for ${signLabel} for ${dateLabel} in ${languageLabel}.
${contextLines}
${genderLine}
Return ONLY a JSON object with keys "work", "health", and "love".
Each value should be a short paragraph of 1-2 sentences, warm, specific, and written in second person.
Include one concrete scenario and one actionable suggestion in each section.
Base the horoscope on the daily context above and rewrite it fully in your own words. Do not quote or mention sources.
Ensure the wording is fresh and different each day; do not reuse or repeat sentences across sections.
Do not mention any zodiac sign names and avoid lists or emojis.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: normalizedPlan === 'premium' ? 0.7 : 0.65,
      max_tokens: normalizedPlan === 'premium' ? 700 : 220,
      messages: [
        { role: 'system', content: `Return JSON only. Use ${languageLabel}.` },
        { role: 'user', content: prompt },
      ],
    });

    const rawText = completion.choices?.[0]?.message?.content?.trim() || '';
    const parsed = parseJsonFromText(rawText);
    if (!parsed) return null;

    const work = String(parsed.work || '').trim();
    const health = String(parsed.health || '').trim();
    const love = String(parsed.love || '').trim();
    if (!work || !health || !love) return null;

    if (normalizedPlan === 'premium') {
      const hasParagraphs = (value) =>
        value.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean).length >= 3;
      if (!hasParagraphs(work) || !hasParagraphs(health) || !hasParagraphs(love)) {
        return null;
      }
    }

    const allLabels = Object.values(zodiacLabelsByLanguage[normalizedLanguage] || {});
    if (containsDisallowedSign(`${work} ${health} ${love}`, [], allLabels)) {
      return null;
    }

    return {
      work,
      health,
      love,
      labels: sectionLabels,
    };
  } catch (error) {
    console.error('Failed to generate daily horoscope:', error);
    return null;
  }
};

const getOrCreateDailyHoroscope = async ({ horoscopeDate, signKey, language, dateLabel, gender }) => {
  if (!pool) return null;
  const normalizedLanguage = getSupportedLanguage(language);
  const normalizedGender = normalizeGender(gender);
  try {
    const { rows } = await pool.query(
      `SELECT work_text, health_text, love_text
       FROM daily_horoscopes
       WHERE horoscope_date = $1 AND zodiac_sign = $2 AND language = $3 AND gender = $4
       LIMIT 1`,
      [horoscopeDate, signKey, normalizedLanguage, normalizedGender]
    );
    if (rows.length > 0) {
      return {
        work: rows[0].work_text,
        health: rows[0].health_text,
        love: rows[0].love_text,
        labels: horoscopeSectionLabelsByLanguage[normalizedLanguage] || horoscopeSectionLabelsByLanguage.sr,
      };
    }
  } catch (error) {
    console.error('Failed to fetch cached horoscope:', error);
  }

  const generated = await generateDailyHoroscope({
    signKey,
    language: normalizedLanguage,
    dateLabel,
    horoscopeDate,
    plan: 'basic',
    gender: normalizedGender,
  });
  if (!generated) return null;

  try {
    await pool.query(
      `INSERT INTO daily_horoscopes (
        horoscope_date,
        zodiac_sign,
        language,
        gender,
        work_text,
        health_text,
        love_text
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (horoscope_date, zodiac_sign, language, gender)
      DO UPDATE SET
        work_text = EXCLUDED.work_text,
        health_text = EXCLUDED.health_text,
        love_text = EXCLUDED.love_text`,
      [
        horoscopeDate,
        signKey,
        normalizedLanguage,
        normalizedGender,
        generated.work,
        generated.health,
        generated.love,
      ]
    );
  } catch (error) {
    console.error('Failed to store daily horoscope:', error);
  }

  return generated;
};

const sendDailyHoroscopeEmail = async ({
  email,
  firstName,
  dateLabel,
  sections,
  unsubscribeUrl,
  language,
  isImmediate = false,
}) => {
  const copy = getHoroscopeEmailCopy(language);
  const greeting = isImmediate && copy.immediateGreeting ? copy.immediateGreeting : copy.greeting;
  const greetingName = firstName ? ` ${firstName}` : '';
  const workLabel = sections.labels?.work || 'Posao';
  const healthLabel = sections.labels?.health || 'Zdravlje';
  const loveLabel = sections.labels?.love || 'Ljubav';
  const splitParagraphs = (value) =>
    String(value || '')
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  const renderSection = (label, value) => {
    const paragraphs = splitParagraphs(value);
    const body = paragraphs.length
      ? paragraphs
          .map((paragraph) => `<p style="margin: 0 0 8px;">${escapeHtml(paragraph)}</p>`)
          .join('')
      : `<p style="margin: 0;">-</p>`;
    return `
      <div style="margin-bottom: 12px;">
        <div style="font-weight: 600; margin: 0 0 6px;">${escapeHtml(label)}:</div>
        ${body}
      </div>
    `;
  };

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; color: #e8e4ff; background-color: #0b0a13;">
      <h1 style="font-size: 22px; margin: 0 0 8px;">${escapeHtml(greeting)}${escapeHtml(greetingName)}</h1>
      <p style="margin: 0 0 16px; color: #b7b0d9;">${escapeHtml(copy.intro)} · ${escapeHtml(dateLabel)}</p>
      <div style="background: #171429; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
        ${renderSection(workLabel, sections.work)}
        ${renderSection(healthLabel, sections.health)}
        ${renderSection(loveLabel, sections.love)}
      </div>
      <p style="margin: 0 0 16px; color: #b7b0d9;">${escapeHtml(copy.outro)}</p>
      <p style="margin: 0; font-size: 12px; color: #8a82b8;">
        <a href="${escapeHtml(unsubscribeUrl)}" style="color: #8a82b8; text-decoration: underline;">
          ${escapeHtml(copy.unsubscribe)}
        </a>
      </p>
    </div>
  `;

  return sendResendEmail({
    to: email,
    subject: copy.subject,
    html,
  });
};

const logHoroscopeDelivery = async ({
  subscriptionId,
  email,
  zodiacSign,
  horoscopeDate,
  status,
  providerId,
  errorMessage,
}) => {
  if (!pool) return;
  try {
    await pool.query(
      `INSERT INTO horoscope_delivery_log (
        subscription_id,
        email,
        zodiac_sign,
        horoscope_date,
        status,
        provider_id,
        error_message
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        String(subscriptionId),
        email,
        zodiacSign,
        horoscopeDate,
        status,
        providerId || null,
        errorMessage || null,
      ]
    );
  } catch (error) {
    console.error('Failed to log horoscope delivery:', error);
  }
};

const deliverSubscriptionHoroscope = async (subscription, cache = new Map(), options = {}) => {
  const { sendAt: overrideSendAt, forceNextDay = false, isImmediate = false } = options || {};
  const timezone = normalizeTimezone(subscription.timezone);
  const language = getSupportedLanguage(subscription.language);
  const plan = subscription.plan === 'premium' ? 'premium' : 'basic';
  const birthTime = normalizeBirthTime(subscription.birth_time);
  const gender = normalizeGender(subscription.gender);
  const sendHour = normalizeSendHour(subscription.send_hour) ?? horoscopeSendHour;
  const sendAt = overrideSendAt
    ? new Date(overrideSendAt)
    : subscription.next_send_at
      ? new Date(subscription.next_send_at)
      : new Date();
  const endAt = subscription.end_at ? new Date(subscription.end_at) : null;
  const sendCount = subscription.send_count || 0;
  const now = new Date();

  if (sendCount >= horoscopeDurationDays || (endAt && endAt <= now)) {
    await pool.query(
      `UPDATE horoscope_subscriptions
       SET status = 'completed', next_send_at = NULL
       WHERE id = $1`,
      [subscription.id]
    );
    return { ok: false, skipped: true };
  }

  const horoscopeDate = getLocalDateKey(sendAt, timezone);
  const cacheKey = plan === 'basic'
    ? `${horoscopeDate}:${language}:${subscription.zodiac_sign}:${gender}`
    : null;
  let horoscope = cacheKey ? cache.get(cacheKey) : null;
  const dateLabel = getLocalizedDateLabel(sendAt, timezone, language);

  if (!horoscope) {
    horoscope = plan === 'basic'
      ? await getOrCreateDailyHoroscope({
          horoscopeDate,
          signKey: subscription.zodiac_sign,
          language,
          dateLabel,
          gender,
        })
          : await generateDailyHoroscope({
              signKey: subscription.zodiac_sign,
              language,
              dateLabel,
              horoscopeDate,
              plan,
              birthTime,
              gender,
            });
    if (!horoscope) {
      await logHoroscopeDelivery({
        subscriptionId: subscription.id,
        email: subscription.email,
        zodiacSign: subscription.zodiac_sign,
        horoscopeDate,
        status: 'failed',
        errorMessage: 'horoscope_generation_failed',
      });
      return { ok: false };
    }
    if (cacheKey) {
      cache.set(cacheKey, horoscope);
    }
  }

  const unsubscribeUrl = `${apiBaseUrl}/api/horoscope/unsubscribe?token=${subscription.unsubscribe_token}`;

  const sendResult = await sendDailyHoroscopeEmail({
    email: subscription.email,
    firstName: subscription.first_name,
    dateLabel,
    sections: horoscope,
    unsubscribeUrl,
    language,
    isImmediate,
  });

  await logHoroscopeDelivery({
    subscriptionId: subscription.id,
    email: subscription.email,
    zodiacSign: subscription.zodiac_sign,
    horoscopeDate,
    status: sendResult?.ok ? 'sent' : 'failed',
    providerId: sendResult?.id,
    errorMessage: sendResult?.ok ? null : sendResult?.error || 'send_failed',
  });

  if (!sendResult?.ok) {
    return { ok: false };
  }

  const updatedSendCount = sendCount + 1;
  const completed = updatedSendCount >= horoscopeDurationDays;
  const nextSendAt = completed
    ? null
    : forceNextDay
      ? getNextSendAtAfterImmediate(sendAt, timezone, sendHour)
      : getNextSendAt(new Date(sendAt.getTime() + 1000), timezone, sendHour);

  await pool.query(
    `UPDATE horoscope_subscriptions
     SET last_sent_at = $1,
         send_count = $2,
         next_send_at = $3,
         status = $4
     WHERE id = $5`,
    [now, updatedSendCount, nextSendAt, completed ? 'completed' : 'active', subscription.id]
  );

  return { ok: true };
};

async function createHoroscopeSubscription({
  orderId,
  email,
  firstName,
  lastName,
  birthDate,
  birthTime,
  gender,
  language,
  timezone,
  plan,
  sendHour,
  sendNow = false,
}) {
  if (!pool) return;
  const zodiacSign = getZodiacSignFromDateString(birthDate);
  if (!zodiacSign) return;

  const normalizedLanguage = getSupportedLanguage(language);
  const normalizedTimezone = normalizeTimezone(timezone);
  const normalizedBirthTime = normalizeBirthTime(birthTime);
  const normalizedGender = normalizeGender(gender);
  const normalizedPlan = plan === 'premium' ? 'premium' : 'basic';
  const normalizedSendHour = normalizeSendHour(sendHour) ?? horoscopeSendHour;

  const now = new Date();
  const endAt = new Date(now);
  endAt.setDate(endAt.getDate() + horoscopeDurationDays);

  const nextSendAt = sendNow
    ? now
    : getNextSendAt(now, normalizedTimezone, normalizedSendHour);
  const unsubscribeToken = crypto.randomBytes(24).toString('hex');

  const { rows } = await pool.query(
    `INSERT INTO horoscope_subscriptions (
      order_id,
      email,
      first_name,
      last_name,
      zodiac_sign,
      language,
      timezone,
      plan,
      birth_time,
      gender,
      send_hour,
      status,
      start_at,
      end_at,
      next_send_at,
      unsubscribe_token
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'active', $12, $13, $14, $15)
    RETURNING id, email, first_name, last_name, zodiac_sign, language, timezone, plan, birth_time, gender, send_hour, next_send_at, end_at, send_count, unsubscribe_token`,
    [
      orderId || null,
      email,
      firstName || null,
      lastName || null,
      zodiacSign,
      normalizedLanguage,
      normalizedTimezone,
      normalizedPlan,
      normalizedBirthTime,
      normalizedGender,
      normalizedSendHour,
      now,
      endAt,
      nextSendAt,
      unsubscribeToken,
    ]
  );

  return rows[0] || null;
}

let horoscopeDispatchRunning = false;

const dispatchDailyHoroscopes = async () => {
  if (horoscopeDispatchRunning || !horoscopeSchedulerEnabled) return;
  if (!pool) return;
  if (!openai) return;
  if (!resendApiKey || !resendFromEmail) return;

  horoscopeDispatchRunning = true;

  try {
    const { rows: subscriptions } = await pool.query(
      `SELECT
        id,
        email,
        first_name,
        last_name,
        zodiac_sign,
        language,
        timezone,
        plan,
        birth_time,
        gender,
        send_hour,
        next_send_at,
        end_at,
        send_count,
        unsubscribe_token
      FROM horoscope_subscriptions
      WHERE status = 'active'
        AND next_send_at IS NOT NULL
        AND next_send_at <= NOW()
      ORDER BY next_send_at ASC
      LIMIT $1`,
      [horoscopeBatchSize]
    );

    if (!subscriptions.length) {
      horoscopeDispatchRunning = false;
      return;
    }

    const cache = new Map();

    for (const subscription of subscriptions) {
      await deliverSubscriptionHoroscope(subscription, cache);
    }
  } catch (error) {
    console.error('Failed to dispatch horoscopes:', error);
  } finally {
    horoscopeDispatchRunning = false;
  }
};

const startHoroscopeScheduler = () => {
  if (!horoscopeSchedulerEnabled) return;
  setTimeout(() => {
    dispatchDailyHoroscopes().catch(() => null);
  }, 5000);

  setInterval(() => {
    dispatchDailyHoroscopes().catch(() => null);
  }, horoscopeSchedulerIntervalMs);
};

// Other routes can use JSON parsing
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const normalized = normalizeOrigin(origin);
      if (allowedOrigins.has(normalized)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use('/uploads', express.static(uploadsDir));
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe || !stripeWebhookSecret) {
    return res.status(500).send('Stripe webhook not configured');
  }

  const signature = req.headers['stripe-signature'];
  if (!signature) {
    return res.status(400).send('Missing Stripe signature');
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, stripeWebhookSecret);
  } catch (error) {
    console.error('Stripe webhook signature error:', error);
    return res.status(400).send('Invalid signature');
  }

  if (!pool) {
    return res.status(500).send('Database not configured');
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = Number(session?.metadata?.order_id || session?.client_reference_id);
      if (Number.isInteger(orderId) && orderId > 0) {
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
            email,
            gender,
            note,
            language,
            final_price_cents,
            referral_code,
            utm_source,
            utm_medium,
            utm_campaign,
            utm_term,
            utm_content,
            referrer,
            landing_path,
            session_id,
            status
          FROM orders
          WHERE id = $1
          LIMIT 1`,
          [orderId]
        );
        const order = rows[0];
        if (order) {
          const { rowCount } = await pool.query(
            `UPDATE orders
             SET status = 'processing'
             WHERE id = $1 AND status = 'pending'`,
            [orderId]
          );
          if (rowCount) {
            const timezoneOverride = session?.metadata?.timezone || null;
            await fulfillOrderFromRow(order, timezoneOverride);
          }
          logOrderCompletedEvent(order);
        }
      }
    }
  } catch (error) {
    console.error('Stripe webhook handling error:', error);
    return res.status(500).send('Webhook handler failed');
  }

  return res.json({ received: true });
});
app.use(express.json());

const parseAnalyticsDate = (value) => {
  if (!value) return null;
  const match = String(value).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!year || !month || !day) return null;
  return new Date(Date.UTC(year, month - 1, day));
};

const buildAnalyticsWhere = (filters) => {
  const clauses = ['created_at >= $1', 'created_at < $2'];
  const values = [filters.from, filters.to];

  const add = (field, value) => {
    if (!value) return;
    values.push(value);
    clauses.push(`${field} = $${values.length}`);
  };

  add('utm_source', filters.utm_source);
  add('utm_campaign', filters.utm_campaign);
  add('referral_code', filters.referral_code);
  add('product_id', filters.product_id);

  return { where: clauses.join(' AND '), values };
};

app.post('/api/analytics/event', async (req, res) => {
  await logAnalyticsEvent({
    ...req.body,
    user_agent: req.headers['user-agent'],
  });
  return res.json({ success: true });
});

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

app.get('/api/analytics/summary', requireAuth, async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const now = new Date();
  const defaultTo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const defaultFrom = new Date(defaultTo);
  defaultFrom.setUTCDate(defaultFrom.getUTCDate() - 29);

  const fromParam = parseAnalyticsDate(req.query.from);
  const toParam = parseAnalyticsDate(req.query.to);
  const fromDate = fromParam || defaultFrom;
  const toDate = toParam || defaultTo;
  const toExclusive = new Date(toDate);
  toExclusive.setUTCDate(toExclusive.getUTCDate() + 1);

  const normalizeFilter = (value, maxLen = 160) => {
    const normalized = normalizeAnalyticsValue(value, maxLen);
    if (!normalized || normalized === 'all') return null;
    return normalized;
  };

  const filters = {
    from: fromDate.toISOString(),
    to: toExclusive.toISOString(),
    utm_source: normalizeFilter(req.query.utm_source, 120),
    utm_campaign: normalizeFilter(req.query.utm_campaign, 160),
    referral_code: normalizeFilter(req.query.referral_code, 120),
    product_id: normalizeFilter(req.query.product_id, 120),
  };

  const { where, values } = buildAnalyticsWhere(filters);

  try {
    const { rows: totalsRows } = await pool.query(
      `SELECT
        COUNT(*) FILTER (WHERE event_type = 'page_view')::int AS page_views,
        COUNT(DISTINCT session_id) FILTER (WHERE event_type = 'page_view' AND session_id IS NOT NULL)::int AS unique_visitors,
        COUNT(*) FILTER (WHERE event_type = 'order_created')::int AS order_created,
        COUNT(*) FILTER (WHERE event_type = 'checkout_started')::int AS checkout_started,
        COUNT(*) FILTER (WHERE event_type = 'order_completed')::int AS order_completed,
        COALESCE(SUM(value_cents) FILTER (WHERE event_type = 'order_completed'), 0)::int AS revenue_cents
       FROM analytics_events
       WHERE ${where}`,
      values
    );

    const { rows: dailyRows } = await pool.query(
      `SELECT
        TO_CHAR(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS date,
        COUNT(*) FILTER (WHERE event_type = 'page_view')::int AS page_views,
        COUNT(DISTINCT session_id) FILTER (WHERE event_type = 'page_view' AND session_id IS NOT NULL)::int AS unique_visitors,
        COUNT(*) FILTER (WHERE event_type = 'order_created')::int AS order_created,
        COUNT(*) FILTER (WHERE event_type = 'order_completed')::int AS order_completed,
        COALESCE(SUM(value_cents) FILTER (WHERE event_type = 'order_completed'), 0)::int AS revenue_cents
       FROM analytics_events
       WHERE ${where}
       GROUP BY date
       ORDER BY date ASC`,
      values
    );

    const { rows: pageRows } = await pool.query(
      `SELECT path, COUNT(*)::int AS count
       FROM analytics_events
       WHERE ${where} AND event_type = 'page_view' AND path IS NOT NULL
       GROUP BY path
       ORDER BY count DESC
       LIMIT 10`,
      values
    );

    const { rows: referrerRows } = await pool.query(
      `SELECT referrer_host AS referrer, COUNT(*)::int AS count
       FROM analytics_events
       WHERE ${where} AND event_type = 'page_view' AND referrer_host IS NOT NULL
       GROUP BY referrer_host
       ORDER BY count DESC
       LIMIT 10`,
      values
    );

    const { rows: productRows } = await pool.query(
      `SELECT
        product_id,
        COUNT(*) FILTER (WHERE event_type = 'order_created')::int AS order_created,
        COUNT(*) FILTER (WHERE event_type = 'order_completed')::int AS order_completed,
        COALESCE(SUM(value_cents) FILTER (WHERE event_type = 'order_completed'), 0)::int AS revenue_cents
       FROM analytics_events
       WHERE ${where} AND product_id IS NOT NULL
       GROUP BY product_id
       ORDER BY order_created DESC`,
      values
    );

    const optionValues = [filters.from, filters.to];
    const { rows: sourceRows } = await pool.query(
      `SELECT DISTINCT utm_source
       FROM analytics_events
       WHERE created_at >= $1 AND created_at < $2 AND utm_source IS NOT NULL
       ORDER BY utm_source`,
      optionValues
    );
    const { rows: campaignRows } = await pool.query(
      `SELECT DISTINCT utm_campaign
       FROM analytics_events
       WHERE created_at >= $1 AND created_at < $2 AND utm_campaign IS NOT NULL
       ORDER BY utm_campaign`,
      optionValues
    );
    const { rows: referralRows } = await pool.query(
      `SELECT DISTINCT referral_code
       FROM analytics_events
       WHERE created_at >= $1 AND created_at < $2 AND referral_code IS NOT NULL
       ORDER BY referral_code`,
      optionValues
    );
    const { rows: productOptions } = await pool.query(
      `SELECT DISTINCT product_id
       FROM analytics_events
       WHERE created_at >= $1 AND created_at < $2 AND product_id IS NOT NULL
       ORDER BY product_id`,
      optionValues
    );

    return res.json({
      totals: totalsRows[0] || {
        page_views: 0,
        unique_visitors: 0,
        order_created: 0,
        checkout_started: 0,
        order_completed: 0,
        revenue_cents: 0,
      },
      daily: dailyRows || [],
      top_pages: pageRows || [],
      top_referrers: referrerRows || [],
      top_products: productRows || [],
      options: {
        utm_sources: sourceRows.map((row) => row.utm_source),
        utm_campaigns: campaignRows.map((row) => row.utm_campaign),
        referral_codes: referralRows.map((row) => row.referral_code),
        products: productOptions.map((row) => row.product_id),
      },
    });
  } catch (error) {
    console.error('Failed to fetch analytics summary:', error);
    return res.status(500).json({ error: 'Failed to fetch analytics summary' });
  }
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

  const built = buildOrderPayload(req.body);
  if (built.error) {
    return res.status(400).json({ error: built.error });
  }

  const payload = built.data;

  try {
    const pricing = await getOrderPricing(payload);
    if (pricing.error) {
      return res.status(400).json({ error: pricing.error });
    }

    const orderId = await insertOrderRecord(payload, pricing);
    await logOrderCreatedEvent(orderId, payload, pricing);
    if (pricing.finalPriceCents <= 0) {
      await logOrderCompletedEvent({
        id: orderId,
        product_id: payload.product_id,
        final_price_cents: pricing.finalPriceCents,
        referral_code: pricing.referralCode || payload.referral_code || null,
        utm_source: payload.utm_source,
        utm_medium: payload.utm_medium,
        utm_campaign: payload.utm_campaign,
        utm_term: payload.utm_term,
        utm_content: payload.utm_content,
        referrer: payload.referrer,
        landing_path: payload.landing_path,
        session_id: payload.session_id,
      });
    }

    sendOrderNotifications({
      customerName: payload.customer_name,
      email: payload.email,
      productName: payload.product_name,
      birthDate: payload.birth_date,
      birthPlace: payload.birth_place,
      birthTime: payload.birth_time,
      note: payload.note,
      language: payload.language,
    });

    const plan = horoscopeSubscriptionPlans.get(payload.product_id);
    if (plan) {
      try {
        const subscription = await createHoroscopeSubscription({
          orderId,
          email: payload.email,
          firstName: payload.first_name,
          lastName: payload.last_name,
          birthDate: payload.birth_date,
          birthTime: payload.birth_time,
          gender: payload.gender,
          language: payload.language,
          timezone: payload.timezone,
          plan,
          sendNow: true,
        });

        if (subscription) {
          if (!openai || !resendApiKey || !resendFromEmail) {
            console.warn('Daily horoscope send skipped: OpenAI/Resend not configured.');
          } else {
            const sendAt = new Date();
            setTimeout(() => {
              deliverSubscriptionHoroscope(subscription, new Map(), {
                sendAt,
                forceNextDay: true,
                isImmediate: true,
              }).catch((sendError) => {
                console.error('Failed to send initial horoscope:', sendError);
              });
            }, 0);
          }
        }
      } catch (subscriptionError) {
        console.error('Failed to create horoscope subscription:', subscriptionError);
      }
    }

    return res.status(201).json({ success: true, orderId });
  } catch (error) {
    console.error('Failed to create order:', error);
    return res.status(500).json({ error: 'Failed to create order' });
  }
});

app.post('/api/stripe/create-checkout-session', async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not configured' });
  }
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  const built = buildOrderPayload(req.body);
  if (built.error) {
    return res.status(400).json({ error: built.error });
  }

  const payload = built.data;

  try {
    const pricing = await getOrderPricing(payload);
    if (pricing.error) {
      return res.status(400).json({ error: pricing.error });
    }

    if (!pricing.finalPriceCents || pricing.finalPriceCents <= 0) {
      return res.status(400).json({ error: 'Free orders do not require checkout' });
    }

    const orderId = await insertOrderRecord(payload, pricing);
    if (!orderId) {
      return res.status(500).json({ error: 'Failed to create order' });
    }

    const frontendBase = normalizeOrigin(frontendUrl) || normalizedApiBaseUrl;
    const successUrl = `${frontendBase}/order-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${frontendBase}/order-cancel`;

    let session;
    try {
      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        submit_type: 'pay',
        customer_email: payload.email,
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: String(orderId),
        metadata: {
          order_id: String(orderId),
          product_id: String(payload.product_id || ''),
          referral_code: String(pricing.referralCode || ''),
          timezone: String(payload.timezone || ''),
        },
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: payload.product_name,
              },
              unit_amount: pricing.finalPriceCents,
            },
            quantity: 1,
          },
        ],
      });
    } catch (error) {
      await pool.query('DELETE FROM orders WHERE id = $1', [orderId]);
      throw error;
    }

    await logOrderCreatedEvent(orderId, payload, pricing);
    await logCheckoutStartedEvent(orderId, payload, pricing);

    return res.json({ id: session.id, url: session.url || null });
  } catch (error) {
    console.error('Failed to create Stripe checkout session:', error);
    return res.status(500).json({ error: 'Failed to create checkout session' });
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
        gender,
        note,
        consultation_description,
        language,
        referral_id,
        referral_code,
        base_price_cents,
        discount_percent,
        discount_amount_cents,
        final_price_cents,
        referral_commission_percent,
        referral_commission_cents,
        referral_paid_cents,
        referral_paid,
        referral_paid_at,
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

app.post('/api/orders/bulk-delete', requireAuth, async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const { ids } = req.body || {};
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'Missing order ids' });
  }

  const normalizedIds = Array.from(
    new Set(
      ids
        .map((id) => Number(id))
        .filter((id) => Number.isInteger(id) && id > 0)
    )
  );

  if (!normalizedIds.length) {
    return res.status(400).json({ error: 'Invalid order ids' });
  }

  try {
    const { rowCount } = await pool.query(
      'DELETE FROM orders WHERE id = ANY($1::int[])',
      [normalizedIds]
    );
    return res.json({ success: true, deleted: rowCount || 0 });
  } catch (error) {
    console.error('Failed to delete orders:', error);
    return res.status(500).json({ error: 'Failed to delete orders' });
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

app.post('/api/orders/:id/send-report', requireAuth, async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const orderId = Number(req.params.id);
  if (!Number.isInteger(orderId) || orderId <= 0) {
    return res.status(400).json({ error: 'Invalid order id' });
  }

  const { subject, message, language } = req.body || {};
  const trimmedMessage = String(message || '').trim();
  if (!trimmedMessage) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const { rows } = await pool.query(
      `SELECT id, email, first_name, product_name, language
       FROM orders
       WHERE id = $1
       LIMIT 1`,
      [orderId]
    );
    const order = rows[0];
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const normalizedLanguage = getSupportedLanguage(order.language || language);
    const sendResult = await sendManualReportEmail({
      email: order.email,
      firstName: order.first_name,
      productName: order.product_name,
      subject,
      message: trimmedMessage,
      language: normalizedLanguage,
    });

    if (!sendResult?.ok) {
      return res.status(500).json({ error: sendResult?.error || 'Failed to send report' });
    }

    let statusUpdated = true;
    try {
      await pool.query('UPDATE orders SET status = $1 WHERE id = $2', ['completed', orderId]);
    } catch (statusError) {
      statusUpdated = false;
      console.error('Failed to update order status after report send:', statusError);
    }

    return res.json({ success: true, statusUpdated });
  } catch (error) {
    console.error('Failed to send report:', error);
    return res.status(500).json({ error: 'Failed to send report' });
  }
});

app.get('/api/referrals/validate', async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const code = normalizeReferralCode(req.query?.code);
  if (!code) {
    return res.json({ valid: false });
  }

  try {
    const { rows } = await pool.query(
      `SELECT code, discount_percent
       FROM referrals
       WHERE code = $1 AND is_active = true
       LIMIT 1`,
      [code]
    );
    if (!rows.length) {
      return res.json({ valid: false });
    }
    return res.json({ valid: true, code: rows[0].code, discountPercent: clampPercent(rows[0].discount_percent) });
  } catch (error) {
    console.error('Failed to validate referral:', error);
    return res.status(500).json({ error: 'Failed to validate referral' });
  }
});

app.get('/api/referrals', requireAuth, async (_req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const { rows } = await pool.query(
      `SELECT
        r.id,
        r.code,
        r.owner_first_name,
        r.owner_last_name,
        r.discount_percent,
        r.commission_percent,
        r.is_active,
        r.created_at,
        COUNT(o.id)::int AS order_count,
        COUNT(o.id) FILTER (WHERE o.status = 'pending')::int AS pending_count,
        COUNT(o.id) FILTER (WHERE o.status = 'processing')::int AS processing_count,
        COUNT(o.id) FILTER (WHERE o.status = 'completed')::int AS completed_count,
        COUNT(o.id) FILTER (WHERE o.status = 'cancelled')::int AS cancelled_count,
        COALESCE(SUM(o.final_price_cents), 0)::int AS total_revenue_cents,
        COALESCE(SUM(COALESCE(o.referral_commission_cents, 0)), 0)::int AS total_commission_cents,
        COALESCE(SUM(COALESCE(o.referral_paid_cents, 0)), 0)::int AS paid_commission_cents,
        COALESCE(SUM(GREATEST(COALESCE(o.referral_commission_cents, 0) - COALESCE(o.referral_paid_cents, 0), 0)), 0)::int AS unpaid_commission_cents
      FROM referrals r
      LEFT JOIN orders o ON o.referral_id = r.id
      GROUP BY r.id
      ORDER BY r.created_at DESC`
    );
    return res.json({ referrals: rows });
  } catch (error) {
    console.error('Failed to fetch referrals:', error);
    return res.status(500).json({ error: 'Failed to fetch referrals' });
  }
});

app.post('/api/referrals', requireAuth, async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const {
    code,
    owner_first_name,
    owner_last_name,
    discount_percent,
    commission_percent,
    is_active,
  } = req.body || {};

  const normalizedCode = normalizeReferralCode(code);
  const ownerFirstName = String(owner_first_name || '').trim();
  const ownerLastName = String(owner_last_name || '').trim();
  if (!normalizedCode || !ownerFirstName || !ownerLastName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO referrals (
        code,
        owner_first_name,
        owner_last_name,
        discount_percent,
        commission_percent,
        is_active
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id`,
      [
        normalizedCode,
        ownerFirstName,
        ownerLastName,
        clampPercent(discount_percent),
        clampPercent(commission_percent),
        is_active !== false,
      ]
    );
    return res.status(201).json({ success: true, referralId: rows[0]?.id });
  } catch (error) {
    if (error?.code === '23505') {
      return res.status(409).json({ error: 'Referral code already exists' });
    }
    console.error('Failed to create referral:', error);
    return res.status(500).json({ error: 'Failed to create referral' });
  }
});

app.patch('/api/referrals/:id', requireAuth, async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const referralId = Number(req.params.id);
  if (!Number.isInteger(referralId) || referralId <= 0) {
    return res.status(400).json({ error: 'Invalid referral id' });
  }

  const {
    code,
    owner_first_name,
    owner_last_name,
    discount_percent,
    commission_percent,
    is_active,
  } = req.body || {};

  const normalizedCode = normalizeReferralCode(code);
  const ownerFirstName = String(owner_first_name || '').trim();
  const ownerLastName = String(owner_last_name || '').trim();
  if (!normalizedCode || !ownerFirstName || !ownerLastName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { rowCount } = await pool.query(
      `UPDATE referrals
       SET code = $1,
           owner_first_name = $2,
           owner_last_name = $3,
           discount_percent = $4,
           commission_percent = $5,
           is_active = $6
       WHERE id = $7`,
      [
        normalizedCode,
        ownerFirstName,
        ownerLastName,
        clampPercent(discount_percent),
        clampPercent(commission_percent),
        is_active !== false,
        referralId,
      ]
    );
    if (!rowCount) {
      return res.status(404).json({ error: 'Referral not found' });
    }
    return res.json({ success: true });
  } catch (error) {
    if (error?.code === '23505') {
      return res.status(409).json({ error: 'Referral code already exists' });
    }
    console.error('Failed to update referral:', error);
    return res.status(500).json({ error: 'Failed to update referral' });
  }
});

app.get('/api/referrals/:id/orders', requireAuth, async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const referralId = Number(req.params.id);
  if (!Number.isInteger(referralId) || referralId <= 0) {
    return res.status(400).json({ error: 'Invalid referral id' });
  }

  try {
    const { rows } = await pool.query(
      `SELECT
        id,
        customer_name,
        product_name,
        discount_percent,
        referral_commission_percent,
        final_price_cents,
        referral_commission_cents,
        referral_paid_cents,
        referral_paid,
        referral_paid_at,
        status,
        created_at
      FROM orders
      WHERE referral_id = $1
      ORDER BY created_at DESC`,
      [referralId]
    );
    return res.json({ orders: rows });
  } catch (error) {
    console.error('Failed to fetch referral orders:', error);
    return res.status(500).json({ error: 'Failed to fetch referral orders' });
  }
});

const handleBlogUpload = (req, res, next) => {
  blogUpload(req, res, (error) => {
    if (error) {
      return res.status(400).json({ error: error.message || 'Invalid upload' });
    }
    return next();
  });
};

const formatBlogRow = (row) => ({
  ...row,
  images: parseJsonArray(row.image_urls),
  attachments: parseJsonArray(row.attachment_urls),
});

app.get('/api/blog', async (_req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const { rows } = await pool.query(
      `SELECT
        id,
        title,
        slug,
        excerpt,
        image_urls,
        attachment_urls,
        is_published,
        published_at,
        created_at
      FROM blog_posts
      WHERE is_published = true
      ORDER BY published_at DESC`
    );
    return res.json({ posts: rows.map(formatBlogRow) });
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

app.get('/api/blog/:slug', async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const slug = String(req.params.slug || '').trim();
  if (!slug) {
    return res.status(400).json({ error: 'Invalid blog slug' });
  }

  try {
    const { rows } = await pool.query(
      `SELECT
        id,
        title,
        slug,
        excerpt,
        content,
        image_urls,
        attachment_urls,
        is_published,
        published_at,
        created_at
      FROM blog_posts
      WHERE slug = $1 AND is_published = true
      LIMIT 1`,
      [slug]
    );
    if (!rows.length) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    return res.json({ post: formatBlogRow(rows[0]) });
  } catch (error) {
    console.error('Failed to fetch blog post:', error);
    return res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

app.post('/api/blog', requireAuth, handleBlogUpload, async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const title = String(req.body?.title || '').trim();
  const content = String(req.body?.content || '').trim();
  const excerptInput = String(req.body?.excerpt || '').trim();

  if (!title || !content) {
    return res.status(400).json({ error: 'Missing title or content' });
  }

  try {
    const slugBase = normalizeBlogSlug(title) || 'blog-post';
    const slug = await ensureUniqueBlogSlug(slugBase);
    const images = (req.files?.images || []).map(buildBlogAsset);
    const attachments = (req.files?.attachments || []).map(buildBlogAsset);
    const excerpt = excerptInput || createExcerpt(content);

    const { rows } = await pool.query(
      `INSERT INTO blog_posts (
        title,
        slug,
        excerpt,
        content,
        image_urls,
        attachment_urls,
        is_published,
        published_at
      ) VALUES ($1, $2, $3, $4, $5, $6, true, NOW())
      RETURNING id, title, slug, excerpt, content, image_urls, attachment_urls, is_published, published_at, created_at`,
      [
        title,
        slug,
        excerpt,
        content,
        JSON.stringify(images),
        JSON.stringify(attachments),
      ]
    );

    return res.status(201).json({ success: true, post: formatBlogRow(rows[0]) });
  } catch (error) {
    console.error('Failed to create blog post:', error);
    return res.status(500).json({ error: 'Failed to create blog post' });
  }
});

app.patch('/api/orders/:id/referral-paid', requireAuth, async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const orderId = Number(req.params.id);
  if (!Number.isInteger(orderId) || orderId <= 0) {
    return res.status(400).json({ error: 'Invalid order id' });
  }

  const { paid, paid_cents } = req.body || {};

  try {
    if (paid_cents !== undefined && paid_cents !== null) {
      const paidCentsNumber = Number(paid_cents);
      if (!Number.isFinite(paidCentsNumber)) {
        return res.status(400).json({ error: 'Invalid paid_cents' });
      }
      const normalizedPaidCents = Math.max(0, Math.floor(paidCentsNumber));

      const { rows } = await pool.query(
        `SELECT referral_commission_cents
         FROM orders
         WHERE id = $1
         LIMIT 1`,
        [orderId]
      );
      const order = rows[0];
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const commissionCents = Math.max(0, Number(order.referral_commission_cents || 0));
      const cappedPaidCents = Math.min(normalizedPaidCents, commissionCents);
      const isPaid = commissionCents > 0 && cappedPaidCents >= commissionCents;
      const paidAt = isPaid ? new Date() : null;

      await pool.query(
        `UPDATE orders
         SET referral_paid = $1,
             referral_paid_at = $2,
             referral_paid_cents = $3
         WHERE id = $4`,
        [isPaid, paidAt, cappedPaidCents, orderId]
      );

      return res.json({ success: true, paid_cents: cappedPaidCents, is_paid: isPaid });
    }

    const isPaid = Boolean(paid);
    const paidAt = isPaid ? new Date() : null;
    const { rowCount } = await pool.query(
      `UPDATE orders
       SET referral_paid = $1,
           referral_paid_at = $2,
           referral_paid_cents = CASE
             WHEN $1 THEN referral_commission_cents
             ELSE 0
           END
       WHERE id = $3`,
      [isPaid, paidAt, orderId]
    );
    if (!rowCount) {
      return res.status(404).json({ error: 'Order not found' });
    }
    return res.json({ success: true });
  } catch (error) {
    console.error('Failed to update referral payment status:', error);
    return res.status(500).json({ error: 'Failed to update referral payment status' });
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

app.get('/api/horoscope/subscriptions', requireAuth, async (_req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const { rows } = await pool.query(
      `SELECT
        id,
        order_id,
        email,
        first_name,
        last_name,
        zodiac_sign,
        language,
        timezone,
        gender,
        plan,
        birth_time,
        send_hour,
        status,
        start_at,
        end_at,
        next_send_at,
        last_sent_at,
        send_count,
        unsubscribed_at,
        created_at
      FROM horoscope_subscriptions
      ORDER BY created_at DESC`
    );
    return res.json({ subscriptions: rows });
  } catch (error) {
    console.error('Failed to fetch horoscope subscriptions:', error);
    return res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

app.post('/api/horoscope/subscriptions/:id/cancel', requireAuth, async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const subscriptionId = Number(req.params.id);
  if (!Number.isInteger(subscriptionId) || subscriptionId <= 0) {
    return res.status(400).json({ error: 'Invalid subscription id' });
  }

  try {
    const { rowCount } = await pool.query(
      `UPDATE horoscope_subscriptions
       SET status = 'unsubscribed', next_send_at = NULL, unsubscribed_at = NOW()
       WHERE id = $1`,
      [subscriptionId]
    );
    if (!rowCount) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    return res.json({ success: true });
  } catch (error) {
    console.error('Failed to cancel horoscope subscription:', error);
    return res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

app.get('/api/horoscope/deliveries', requireAuth, async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const requestedLimit = Number(req.query.limit || 200);
  const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 1000) : 200;

  try {
    const { rows } = await pool.query(
      `SELECT
        id,
        subscription_id,
        email,
        zodiac_sign,
        horoscope_date,
        status,
        provider_id,
        error_message,
        created_at
      FROM horoscope_delivery_log
      ORDER BY created_at DESC
      LIMIT $1`,
      [limit]
    );
    return res.json({ deliveries: rows });
  } catch (error) {
    console.error('Failed to fetch horoscope deliveries:', error);
    return res.status(500).json({ error: 'Failed to fetch deliveries' });
  }
});

app.patch('/api/horoscope/subscriptions/:id/send-hour', requireAuth, async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const subscriptionId = Number(req.params.id);
  if (!Number.isInteger(subscriptionId) || subscriptionId <= 0) {
    return res.status(400).json({ error: 'Invalid subscription id' });
  }

  const { send_hour } = req.body || {};
  const normalizedSendHour = normalizeSendHour(send_hour);
  if (normalizedSendHour === null) {
    return res.status(400).json({ error: 'Invalid send hour' });
  }

  try {
    const { rows } = await pool.query(
      `SELECT id, timezone, status
       FROM horoscope_subscriptions
       WHERE id = $1
       LIMIT 1`,
      [subscriptionId]
    );
    const subscription = rows[0];
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const normalizedTimezone = normalizeTimezone(subscription.timezone);
    const nextSendAt = subscription.status === 'active'
      ? getNextSendAt(new Date(), normalizedTimezone, normalizedSendHour)
      : null;

    const { rows: updatedRows } = await pool.query(
      `UPDATE horoscope_subscriptions
       SET send_hour = $1,
           next_send_at = CASE WHEN status = 'active' THEN $2 ELSE next_send_at END
       WHERE id = $3
       RETURNING id, send_hour, next_send_at`,
      [normalizedSendHour, nextSendAt, subscriptionId]
    );

    return res.json({ success: true, subscription: updatedRows[0] });
  } catch (error) {
    console.error('Failed to update send hour:', error);
    return res.status(500).json({ error: 'Failed to update send hour' });
  }
});

app.post('/api/horoscope/test-subscription', requireAuth, async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const {
    email,
    first_name,
    last_name,
    zodiac_sign,
    birth_date,
    birth_time,
    gender,
    plan = 'basic',
    language = 'sr',
    timezone,
    send_now = true,
  } = req.body || {};

  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!normalizedEmail) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const normalizedBirthDate = String(birth_date || '').trim();
  const computedSign = getZodiacSignFromDateString(normalizedBirthDate);
  if (!computedSign) {
    return res.status(400).json({ error: 'Invalid birth date' });
  }

  const normalizedSign = String(zodiac_sign || '').trim().toLowerCase();
  if (!zodiacSignKeys.includes(normalizedSign)) {
    return res.status(400).json({ error: 'Invalid zodiac sign' });
  }
  if (normalizedSign !== computedSign) {
    return res.status(400).json({ error: 'Zodiac sign does not match birth date' });
  }

  const normalizedPlan = plan === 'premium' ? 'premium' : 'basic';
  const normalizedLanguage = getSupportedLanguage(language);
  const normalizedTimezone = normalizeTimezone(timezone);
  const normalizedBirthTime = normalizeBirthTime(birth_time);
  const normalizedGender = normalizeGender(gender);
  const normalizedSendHour = normalizeSendHour(req.body?.send_hour) ?? horoscopeSendHour;

  const now = new Date();
  const endAt = new Date(now);
  endAt.setDate(endAt.getDate() + horoscopeDurationDays);

  const nextSendAt = send_now
    ? now
    : getNextSendAt(now, normalizedTimezone, normalizedSendHour);
  const unsubscribeToken = crypto.randomBytes(24).toString('hex');

  try {
    const { rows } = await pool.query(
      `INSERT INTO horoscope_subscriptions (
        order_id,
        email,
        first_name,
        last_name,
        zodiac_sign,
        language,
        timezone,
        plan,
        birth_time,
        gender,
        send_hour,
        status,
        start_at,
        end_at,
        next_send_at,
        unsubscribe_token
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'active', $12, $13, $14, $15)
      RETURNING id, email, first_name, last_name, zodiac_sign, language, timezone, plan, birth_time, gender, send_hour, next_send_at, end_at, send_count, unsubscribe_token`,
      [
        null,
        normalizedEmail,
        first_name || null,
        last_name || null,
        normalizedSign,
        normalizedLanguage,
        normalizedTimezone,
        normalizedPlan,
        normalizedBirthTime,
        normalizedGender,
        normalizedSendHour,
        now,
        endAt,
        nextSendAt,
        unsubscribeToken,
      ]
    );

    const subscription = rows[0];
    if (!subscription) {
      return res.status(500).json({ error: 'Failed to create subscription' });
    }

    if (send_now) {
      if (!openai || !resendApiKey || !resendFromEmail) {
        return res.status(400).json({ error: 'Email/OpenAI not configured' });
      }

      const sendResult = await deliverSubscriptionHoroscope(subscription, new Map(), {
        sendAt: new Date(),
        forceNextDay: true,
        isImmediate: true,
      });
      return res.json({
        success: true,
        subscription_id: subscription.id,
        sent: Boolean(sendResult?.ok),
      });
    }

    return res.json({ success: true, subscription_id: subscription.id, sent: false });
  } catch (error) {
    console.error('Failed to create test subscription:', error);
    return res.status(500).json({ error: 'Failed to create test subscription' });
  }
});

app.get('/api/horoscope/unsubscribe', async (req, res) => {
  if (!pool) {
    return res.status(500).send('Database not configured');
  }

  const token = String(req.query.token || '').trim();
  if (!token) {
    return res.status(400).send('Invalid unsubscribe token');
  }

  const confirm = String(req.query.confirm || '').trim();
  if (confirm !== '1') {
    const confirmUrl = `${normalizedApiBaseUrl}/api/horoscope/unsubscribe?token=${encodeURIComponent(token)}&confirm=1`;
    const cancelUrl = frontendUrl || normalizedApiBaseUrl;
    return res.status(200).send(`
      <div style="font-family: Arial, sans-serif; background: #0b0a13; color: #e8e4ff; padding: 40px; text-align: center;">
        <h1 style="margin-bottom: 12px;">Potvrda odjave</h1>
        <p style="margin: 0 0 16px;">Da li ste sigurni da želite da se odjavite sa dnevnog horoskopa?</p>
        <div style="display: inline-flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
          <a href="${confirmUrl}" style="background: #7c6bf5; color: #fff; text-decoration: none; padding: 10px 18px; border-radius: 999px;">
            Odjavi me
          </a>
          <a href="${cancelUrl}" style="color: #8a82b8; text-decoration: underline; padding: 10px 18px;">
            Odustani
          </a>
        </div>
      </div>
      <script>
        (function () {
          var confirmUrl = ${JSON.stringify(confirmUrl)};
          var cancelUrl = ${JSON.stringify(cancelUrl)};
          var confirmed = window.confirm('Da li ste sigurni da želite da se odjavite sa dnevnog horoskopa?');
          if (confirmed) {
            window.location.href = confirmUrl;
          } else if (cancelUrl) {
            window.location.href = cancelUrl;
          }
        })();
      </script>
    `);
  }

  try {
    const { rowCount } = await pool.query(
      `UPDATE horoscope_subscriptions
       SET status = 'unsubscribed', next_send_at = NULL, unsubscribed_at = NOW()
       WHERE unsubscribe_token = $1`,
      [token]
    );

    const success = rowCount > 0;
    const message = success
      ? 'Uspešno ste se odjavili sa dnevnog horoskopa.'
      : 'Ovaj link nije validan ili je već iskorišćen.';

    return res.status(success ? 200 : 404).send(`
      <div style="font-family: Arial, sans-serif; background: #0b0a13; color: #e8e4ff; padding: 40px; text-align: center;">
        <h1 style="margin-bottom: 12px;">Hvala</h1>
        <p>${message}</p>
      </div>
    `);
  } catch (error) {
    console.error('Failed to unsubscribe:', error);
    return res.status(500).send('Server error');
  }
});

// LLM endpoint for compatibility copy
app.post('/api/compatibility-llm', llmLimiter, async (req, res) => {
  if (!openai) {
    return res.status(500).json({ error: 'OpenAI not configured' });
  }

  const { sign1, sign2, compatibility, language = 'sr' } = req.body || {};
  const normalizedSign1 = String(sign1 || '').trim().toLowerCase();
  const normalizedSign2 = String(sign2 || '').trim().toLowerCase();

  if (!normalizedSign1 || !normalizedSign2 || typeof compatibility !== 'number') {
    return res.status(400).json({ error: 'Missing sign1/sign2/compatibility' });
  }

  const normalizedLanguage = getSupportedLanguage(language);
  const cacheKey = buildCompatibilityCacheKey(normalizedSign1, normalizedSign2, compatibility, normalizedLanguage);
  const cachedText = getCachedCompatibility(cacheKey);
  if (cachedText) {
    return res.json({ text: cachedText });
  }

  const languageLabel = getLanguageLabel(normalizedLanguage);
  const signLabels = zodiacLabelsByLanguage[normalizedLanguage] || zodiacLabelsByLanguage.sr;
  const sign1Label = signLabels?.[normalizedSign1] || normalizedSign1;
  const sign2Label = signLabels?.[normalizedSign2] || normalizedSign2;

  const prompt = `
You are an astrologer copywriter. Write ONE short paragraph (max 80 words) in ${languageLabel}.
Respond ONLY in ${languageLabel}.
Use EXACT sign names: "${sign1Label}" and "${sign2Label}". Do not mention any other zodiac sign names.
About the couple ${sign1Label} & ${sign2Label} with compatibility ${compatibility}%.
Mention 1-2 key traits for each sign and 1 clear reason why they match or complement each other.
Vary vocabulary each time; make it warm, intriguing, and end with a soft CTA to order the full paid analysis.
No lists, no headings—just a single paragraph.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.35,
      max_tokens: 120,
      messages: [
        { role: 'system', content: `Stay concise, 1 paragraph, persuasive but authentic. Use ${languageLabel} only.` },
        { role: 'user', content: prompt },
      ],
    });

    const text = completion.choices?.[0]?.message?.content?.trim();
    const allSignLabels = Object.values(signLabels || {});
    if (!validateSignMentions(text, sign1Label, sign2Label, allSignLabels)) {
      return res.json({ text: null });
    }
    setCachedCompatibility(cacheKey, text);
    return res.json({ text });
  } catch (err) {
    console.error('LLM error', err);
    return res.status(500).json({ error: 'LLM error' });
  }
});

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
  startHoroscopeScheduler();
});
