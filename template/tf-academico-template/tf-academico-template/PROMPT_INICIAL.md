# 🤖 Prompt Inicial para Claude — Template de Trabalho Acadêmico

Copie e cole o texto abaixo em uma nova conversa com o Claude para começar o seu projeto.
Substitua os campos entre [COLCHETES] antes de enviar.

---

## PROMPT PARA COLAR NO CLAUDE

```
Olá! Vou usar um template de trabalho acadêmico que inclui:
- Escrita em LaTeX (normas ABNT com abntex2)
- Compilação automática do PDF via GitHub Actions
- Site de visualização do PDF com autenticação Google OAuth
- Sistema de comentários do orientador integrado ao GitHub Issues
- Deploy gratuito no Vercel

Já tenho o template instalado no GitHub em:
https://github.com/[SEU_USUARIO]/[SEU_REPOSITORIO]

O site está disponível em:
https://[SEU-PROJETO].vercel.app

Meu trabalho é:
- Título: [TÍTULO DO TRABALHO]
- Tipo: [Trabalho de Formatura / TCC / Dissertação / etc.]
- Universidade: [NOME DA UNIVERSIDADE]
- Curso: [NOME DO CURSO]
- Orientador: [Prof. Dr. NOME DO ORIENTADOR]
- Área: [ÁREA DE CONCENTRAÇÃO]

[DESCREVA SEU TRABALHO EM 2-3 PARÁGRAFOS:
- Qual é o tema central?
- Qual é o problema que o trabalho busca resolver?
- Quais são os estudos de caso ou metodologia?
- Já tem algum material produzido?]

Sobre os casos/exemplos do trabalho:
[DESCREVA AQUI OS ESTUDOS DE CASO, EMPRESAS OU CONTEXTOS
que você vai usar no trabalho, com o máximo de detalhes possível]

Tarefas que precisarei que você faça ao longo do projeto:
1. Escrever e revisar os capítulos em LaTeX
2. Fazer commits e push para o GitHub
3. Ler e aplicar comentários do orientador (via /api/issues)
4. Atualizar o site quando necessário

Para que você possa fazer push no GitHub, usarei uma conta colaboradora.
O token do colaborador é: [TOKEN_DO_COLABORADOR]

Me ajude a começar estruturando o trabalho!
```

---

## Dicas para usar o Claude no projeto

### Como pedir para escrever um capítulo
```
Escreva o Capítulo 2 (Revisão Conceitual) do meu trabalho.
Os temas que preciso cobrir são: [liste os temas].
Use referências acadêmicas reais com autores, títulos e anos.
Mantenha o padrão LaTeX do template.
```

### Como pedir para aplicar comentários do orientador
```
Acesse https://[SEU-PROJETO].vercel.app/api/issues e leia os
comentários do orientador. Para cada comentário, identifique
o capítulo correspondente e aplique as correções necessárias.
```

### Como pedir para atualizar dados de um caso
```
Tenho novos dados para o Capítulo [N]: [descreva os dados].
Atualize o arquivo capitulos/0N_nome.tex com essas informações,
mantendo o estilo acadêmico e as referências existentes.
```

### Como pedir para revisar o trabalho
```
Revise o trabalho completo buscando:
1. Inconsistências entre capítulos
2. TODOs não preenchidos
3. Referências bibliográficas faltando
4. Seções que precisam de mais desenvolvimento
Me dê um relatório de pendências.
```

---

## Informações técnicas para o Claude

O projeto usa:
- **LaTeX**: abntex2, biber (ABNT NBR 14724)
- **CI/CD**: GitHub Actions com container `ghcr.io/xu-cheng/texlive-full`
- **Hosting**: Vercel (free tier)
- **Auth**: Google OAuth 2.0 + cookies httpOnly assinados com HMAC-SHA256
- **Comentários**: GitHub Issues com label `professor-comment`
- **API de Issues**: disponível em `/api/issues` (proxy do GitHub para o Claude)

Estrutura de arquivos importante:
```
main.tex                    → arquivo principal LaTeX
allowed_emails.txt          → lista de e-mails com acesso
capitulos/                  → capítulos do trabalho
site/index.html             → site de visualização
api/                        → funções serverless
.github/workflows/build.yml → compilação automática
```
