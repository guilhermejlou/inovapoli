// api/verify-session.js
// Verifica se o cookie de sessão é válido

export default async function handler(req, res) {
  const secret  = process.env.SESSION_SECRET;
  const cookie  = req.headers.cookie || '';
  const match   = cookie.match(/tf_session=([^;]+)/);

  if (!match) return res.status(401).json({ ok: false, reason: 'no_session' });

  const token = match[1];
  const [sigB64, dataB64] = token.split('.');
  if (!sigB64 || !dataB64) return res.status(401).json({ ok: false, reason: 'invalid_token' });

  try {
    const data    = Buffer.from(dataB64, 'base64url').toString();
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw', encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false, ['verify']
    );
    const sig    = Buffer.from(sigB64, 'base64url');
    const valid  = await crypto.subtle.verify('HMAC', key, sig, encoder.encode(data));
    if (!valid) return res.status(401).json({ ok: false, reason: 'bad_signature' });

    const { email, name, pic, expires } = JSON.parse(data);
    if (Date.now() > expires) return res.status(401).json({ ok: false, reason: 'expired' });

    return res.status(200).json({ ok: true, email, name, pic });
  } catch (e) {
    return res.status(401).json({ ok: false, reason: 'error' });
  }
}
