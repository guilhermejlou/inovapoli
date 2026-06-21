// api/auth.js
// Verifica o token do Google, checa allowlist de e-mails e cria sessão

import fs   from 'fs';
import path from 'path';

function loadAllowedEmails() {
  try {
    const filePath = path.join(process.cwd(), 'allowed_emails.txt');
    const content  = fs.readFileSync(filePath, 'utf-8');
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .map(email => email.toLowerCase());
  } catch (e) {
    console.error('Erro ao ler allowed_emails.txt:', e.message);
    return [];
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: 'Token ausente' });

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const secret   = process.env.SESSION_SECRET;
  const allowed  = loadAllowedEmails();

  if (!clientId || !secret) return res.status(500).json({ error: 'Servidor mal configurado' });

  // ── 1. Verifica o token JWT do Google ─────────────────────
  let payload;
  try {
    const verify = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
    );
    if (!verify.ok) throw new Error('Token inválido');
    payload = await verify.json();
    if (payload.aud !== clientId) throw new Error('Audience inválida');
  } catch (e) {
    return res.status(401).json({ error: 'Token inválido: ' + e.message });
  }

  const email = payload.email?.toLowerCase();
  const name  = payload.name;
  const pic   = payload.picture;

  // ── 2. Checa allowlist ────────────────────────────────────
  if (allowed.length > 0 && !allowed.includes(email)) {
    return res.status(403).json({
      error:   'Acesso negado',
      message: `O e-mail ${email} não tem permissão de acesso. Entre em contato com o autor do trabalho.`
    });
  }

  // ── 3. Gera token de sessão assinado (HMAC-SHA256) ────────
  const expires = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 dias
  const data    = JSON.stringify({ email, name, pic, expires });
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const sig   = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  const token = Buffer.from(sig).toString('base64url') + '.' +
                Buffer.from(data).toString('base64url');

  // ── 4. Seta cookie httpOnly ───────────────────────────────
  res.setHeader('Set-Cookie',
    `tf_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 3600}`
  );

  return res.status(200).json({ ok: true, email, name, pic });
}
