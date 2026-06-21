// api/issues.js
// Proxy que retorna as issues com label professor-comment
// Permite que Claude acesse via vercel.app (domínio acessível no bash)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(500).json({ error: 'Token não configurado' });

  try {
    const response = await fetch(
      'https://api.github.com/repos/guilhermejlou/tf-bi-lowcost/issues?labels=professor-comment&state=open&per_page=50',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    );

    const issues = await response.json();

    // Retorna só o que é relevante para o Claude
    const formatted = issues.map(issue => ({
      number:  issue.number,
      title:   issue.title,
      body:    issue.body,
      url:     issue.html_url,
      created: issue.created_at,
      state:   issue.state,
    }));

    res.status(200).json({ total: formatted.length, issues: formatted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
