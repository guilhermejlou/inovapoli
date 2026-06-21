// api/login.js
// Serve o login.html com o GOOGLE_CLIENT_ID injetado via meta tag
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const clientId = process.env.GOOGLE_CLIENT_ID || '';
  const filePath = path.join(process.cwd(), 'site', 'login.html');

  let html = fs.readFileSync(filePath, 'utf-8');

  // Injeta o client_id via meta tag e substitui o placeholder
  html = html
    .replace(
      '<meta charset="UTF-8"/>',
      `<meta charset="UTF-8"/>\n  <meta name="google-client-id" content="${clientId}"/>`
    )
    .replace('__GOOGLE_CLIENT_ID__', clientId);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).send(html);
}
