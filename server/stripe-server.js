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
const apiBaseUrl = process.env.API_BASE_URL || `http://localhost:${port}`;
const databaseUrl = process.env.DATABASE_URL || '';
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
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0b0a13; padding:24px; font-family:Arial, sans-serif; color:#e8e4ff;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; background-color:#17122b; border:1px solid #2a2248; border-radius:16px; overflow:hidden;">
              <tr>
                <td style="background:linear-gradient(135deg,#7c3aed 0%,#db2777 100%); padding:24px 28px; color:#fff;">
                  <h1 style="margin:0 0 6px; font-size:24px; line-height:1.3;">Hvala vam na narudžbini, ${customerName}!</h1>
                  <p style="margin:0; font-size:14px; opacity:.95;">Vaša narudžbina za <strong>${productName}</strong> je uspešno primljena.</p>
                </td>
              </tr>
              <tr>
                <td style="padding:24px 28px;">
                  <h2 style="margin:0 0 12px; font-size:16px; color:#c9b8ff; text-transform:uppercase; letter-spacing:.08em;">Detalji</h2>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;">
                    <tr>
                      <td style="padding:8px 0; color:#a59ac7;">Datum rođenja</td>
                      <td style="padding:8px 0; text-align:right; color:#ffffff;">${birthDate}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0; color:#a59ac7;">Vreme rođenja</td>
                      <td style="padding:8px 0; text-align:right; color:#ffffff;">${birthTime || '-'}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0; color:#a59ac7;">Mesto rođenja</td>
                      <td style="padding:8px 0; text-align:right; color:#ffffff;">${birthPlace}</td>
                    </tr>
                    ${
                      note
                        ? `
                    <tr>
                      <td style="padding:8px 0; color:#a59ac7; vertical-align:top;">Napomena</td>
                      <td style="padding:8px 0; text-align:right; color:#ffffff; white-space:pre-wrap;">${note}</td>
                    </tr>`
                        : ''
                    }
                  </table>
                  <p style="margin:20px 0 0; font-size:14px; color:#d7cff5;">
                    Vaš astrološki izveštaj ćete dobiti na ovaj email u najkraćem mogućem roku.
                  </p>
                  <p style="margin:16px 0 0; font-size:14px; color:#c9b8ff;">Srdačan pozdrav,<br>Astro Portal Tim</p>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 28px; background-color:#120f22; color:#8d82b8; font-size:12px; text-align:center;">
                  Ova poruka je automatski poslata. Ako imate pitanja, odgovorite na ovaj email.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
  });
};

const horoscopeSubscriptionProductIds = new Set(['monthly-basic']);

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

const getHoroscopeEmailCopy = (language) => {
  const normalized = getSupportedLanguage(language);
  const copy = {
    sr: {
      subject: 'Vaš dnevni horoskop',
      greeting: 'Dobro jutro',
      intro: 'Personalizovani horoskop za',
      outro: 'Želimo vam miran i uspešan dan.',
      unsubscribe: 'Ako ne želite da dobijate ovaj horoskop, odjavite se ovde.',
    },
    en: {
      subject: 'Your daily horoscope',
      greeting: 'Good morning',
      intro: 'Your personalized horoscope for',
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

const generateDailyHoroscope = async ({ signKey, language, dateLabel }) => {
  if (!openai) return null;
  const normalizedLanguage = getSupportedLanguage(language);
  const signLabel = getZodiacLabel(signKey, normalizedLanguage);
  const sectionLabels = horoscopeSectionLabelsByLanguage[normalizedLanguage] || horoscopeSectionLabelsByLanguage.sr;
  const languageLabel = getLanguageLabel(normalizedLanguage);

  const prompt = `
You are an astrologer. Write a daily horoscope for ${signLabel} for ${dateLabel} in ${languageLabel}.
Return ONLY a JSON object with keys "work", "health", and "love".
Each value should be 1-2 sentences, warm, and written in second person.
Do not mention any other zodiac signs and avoid lists or emojis.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.65,
      max_tokens: 200,
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

    const allLabels = Object.values(zodiacLabelsByLanguage[normalizedLanguage] || {});
    if (containsDisallowedSign(`${work} ${health} ${love}`, [signLabel], allLabels)) {
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

const getOrCreateDailyHoroscope = async ({ horoscopeDate, signKey, language, dateLabel }) => {
  if (!pool) return null;
  const normalizedLanguage = getSupportedLanguage(language);
  try {
    const { rows } = await pool.query(
      `SELECT work_text, health_text, love_text
       FROM daily_horoscopes
       WHERE horoscope_date = $1 AND zodiac_sign = $2 AND language = $3
       LIMIT 1`,
      [horoscopeDate, signKey, normalizedLanguage]
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
  });
  if (!generated) return null;

  try {
    await pool.query(
      `INSERT INTO daily_horoscopes (
        horoscope_date,
        zodiac_sign,
        language,
        work_text,
        health_text,
        love_text
      ) VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (horoscope_date, zodiac_sign, language)
      DO UPDATE SET
        work_text = EXCLUDED.work_text,
        health_text = EXCLUDED.health_text,
        love_text = EXCLUDED.love_text`,
      [
        horoscopeDate,
        signKey,
        normalizedLanguage,
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
  signLabel,
  dateLabel,
  sections,
  unsubscribeUrl,
  language,
}) => {
  const copy = getHoroscopeEmailCopy(language);
  const greetingName = firstName ? `, ${firstName}` : '';
  const workLabel = sections.labels?.work || 'Posao';
  const healthLabel = sections.labels?.health || 'Zdravlje';
  const loveLabel = sections.labels?.love || 'Ljubav';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; color: #e8e4ff; background-color: #0b0a13;">
      <h1 style="font-size: 22px; margin: 0 0 8px;">${escapeHtml(copy.greeting)}${escapeHtml(greetingName)}</h1>
      <p style="margin: 0 0 16px; color: #b7b0d9;">${escapeHtml(copy.intro)} <strong>${escapeHtml(signLabel)}</strong> · ${escapeHtml(dateLabel)}</p>
      <div style="background: #171429; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
        <p style="margin: 0 0 10px;"><strong>${escapeHtml(workLabel)}:</strong> ${escapeHtml(sections.work)}</p>
        <p style="margin: 0 0 10px;"><strong>${escapeHtml(healthLabel)}:</strong> ${escapeHtml(sections.health)}</p>
        <p style="margin: 0;"><strong>${escapeHtml(loveLabel)}:</strong> ${escapeHtml(sections.love)}</p>
      </div>
      <p style="margin: 0 0 16px; color: #b7b0d9;">${escapeHtml(copy.outro)}</p>
      <p style="margin: 0; font-size: 12px; color: #8a82b8;">
        <a href="${escapeHtml(unsubscribeUrl)}" style="color: #8a82b8; text-decoration: underline;">
          ${escapeHtml(copy.unsubscribe)}
        </a>
      </p>
    </div>
  `;

  await sendResendEmail({
    to: email,
    subject: `${copy.subject} · ${signLabel}`,
    html,
  });
};

async function createHoroscopeSubscription({
  orderId,
  email,
  firstName,
  lastName,
  birthDate,
  language,
  timezone,
}) {
  if (!pool) return;
  const zodiacSign = getZodiacSignFromDateString(birthDate);
  if (!zodiacSign) return;

  const normalizedLanguage = getSupportedLanguage(language);
  const normalizedTimezone = normalizeTimezone(timezone);

  const now = new Date();
  const endAt = new Date(now);
  endAt.setDate(endAt.getDate() + horoscopeDurationDays);

  const nextSendAt = getNextSendAt(now, normalizedTimezone, horoscopeSendHour);
  const unsubscribeToken = crypto.randomBytes(24).toString('hex');

  await pool.query(
    `INSERT INTO horoscope_subscriptions (
      order_id,
      email,
      first_name,
      last_name,
      zodiac_sign,
      language,
      timezone,
      status,
      start_at,
      end_at,
      next_send_at,
      unsubscribe_token
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'active', $8, $9, $10, $11)`,
    [
      orderId || null,
      email,
      firstName || null,
      lastName || null,
      zodiacSign,
      normalizedLanguage,
      normalizedTimezone,
      now,
      endAt,
      nextSendAt,
      unsubscribeToken,
    ]
  );
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
    const now = new Date();

    for (const subscription of subscriptions) {
      const timezone = normalizeTimezone(subscription.timezone);
      const language = getSupportedLanguage(subscription.language);
      const sendAt = new Date(subscription.next_send_at);
      const endAt = subscription.end_at ? new Date(subscription.end_at) : null;
      const sendCount = subscription.send_count || 0;

      if (sendCount >= horoscopeDurationDays || (endAt && endAt <= now)) {
        await pool.query(
          `UPDATE horoscope_subscriptions
           SET status = 'completed', next_send_at = NULL
           WHERE id = $1`,
          [subscription.id]
        );
        continue;
      }

      const horoscopeDate = getLocalDateKey(sendAt, timezone);
      const cacheKey = `${horoscopeDate}:${language}:${subscription.zodiac_sign}`;
      let horoscope = cache.get(cacheKey);

      if (!horoscope) {
        const dateLabel = getLocalizedDateLabel(sendAt, timezone, language);
        horoscope = await getOrCreateDailyHoroscope({
          horoscopeDate,
          signKey: subscription.zodiac_sign,
          language,
          dateLabel,
        });
        if (!horoscope) {
          continue;
        }
        cache.set(cacheKey, horoscope);
      }

      const signLabel = getZodiacLabel(subscription.zodiac_sign, language);
      const dateLabel = getLocalizedDateLabel(sendAt, timezone, language);
      const unsubscribeUrl = `${apiBaseUrl}/api/horoscope/unsubscribe?token=${subscription.unsubscribe_token}`;

      await sendDailyHoroscopeEmail({
        email: subscription.email,
        firstName: subscription.first_name,
        signLabel,
        dateLabel,
        sections: horoscope,
        unsubscribeUrl,
        language,
      });

      const updatedSendCount = sendCount + 1;
      const completed = updatedSendCount >= horoscopeDurationDays;
      const nextSendAt = completed
        ? null
        : getNextSendAt(new Date(sendAt.getTime() + 1000), timezone, horoscopeSendHour);

      await pool.query(
        `UPDATE horoscope_subscriptions
         SET last_sent_at = $1,
             send_count = $2,
             next_send_at = $3,
             status = $4
         WHERE id = $5`,
        [now, updatedSendCount, nextSendAt, completed ? 'completed' : 'active', subscription.id]
      );
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
    language,
    timezone,
  } = req.body || {};

  const normalizedBirthTime = String(birth_time || '').trim();

  if (
    !product_id ||
    !product_name ||
    !customer_name ||
    !first_name ||
    !last_name ||
    !birth_date ||
    !normalizedBirthTime ||
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
        normalizedBirthTime,
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
      birthTime: normalizedBirthTime,
      note,
    });

    if (horoscopeSubscriptionProductIds.has(product_id)) {
      try {
        await createHoroscopeSubscription({
          orderId: rows[0]?.id,
          email,
          firstName: first_name,
          lastName: last_name,
          birthDate: birth_date,
          language,
          timezone,
        });
      } catch (subscriptionError) {
        console.error('Failed to create horoscope subscription:', subscriptionError);
      }
    }

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

app.get('/api/horoscope/unsubscribe', async (req, res) => {
  if (!pool) {
    return res.status(500).send('Database not configured');
  }

  const token = String(req.query.token || '').trim();
  if (!token) {
    return res.status(400).send('Invalid unsubscribe token');
  }

  try {
    const { rowCount } = await pool.query(
      `UPDATE horoscope_subscriptions
       SET status = 'unsubscribed', next_send_at = NULL
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

  if (!sign1 || !sign2 || typeof compatibility !== 'number') {
    return res.status(400).json({ error: 'Missing sign1/sign2/compatibility' });
  }

  const normalizedLanguage = getSupportedLanguage(language);
  const languageLabel = getLanguageLabel(normalizedLanguage);
  const signLabels = zodiacLabelsByLanguage[normalizedLanguage] || zodiacLabelsByLanguage.sr;
  const sign1Label = signLabels?.[sign1] || sign1;
  const sign2Label = signLabels?.[sign2] || sign2;

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
