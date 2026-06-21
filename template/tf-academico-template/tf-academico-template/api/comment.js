// api/comment.js
// Vercel Serverless Function — cria GitHub Issues como comentários
// O token do GitHub fica seguro no servidor (variável de ambiente)

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const { page, selectedText, comment, author } = req.body;

  if (!comment || !page) {
    return res.status(400).json({ error: 'Campos obrigatórios: page, comment' });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'Token não configurado no servidor' });
  }

  // Monta o corpo da Issue
  const issueTitle = `[Página ${page}] ${(selectedText || 'Comentário geral').substring(0, 60)}`;
  const issueBody = `
## 📝 Comentário do Professor

**Autor:** ${author || 'Anônimo'}
**Página:** ${page}
**Data:** ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}

---

${selectedText ? `### 📌 Trecho selecionado\n> ${selectedText}\n\n---\n` : ''}

### 💬 Comentário
${comment}

---
*Comentário gerado automaticamente via sistema de anotação do TF.*
`.trim();

  try {
    const response = await fetch('https://api.github.com/repos/guilhermejlou/tf-bi-lowcost/issues', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        title: issueTitle,
        body: issueBody,
        labels: ['professor-comment'],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('GitHub API error:', err);
      return res.status(500).json({ error: 'Erro ao criar issue no GitHub', details: err });
    }

    const issue = await response.json();
    return res.status(200).json({
      success: true,
      issueNumber: issue.number,
      issueUrl: issue.html_url,
    });

  } catch (err) {
    console.error('Erro:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
