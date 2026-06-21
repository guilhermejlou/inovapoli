# 📄 Template de Trabalho Acadêmico

Template completo para trabalhos acadêmicos em LaTeX com publicação automática, visualização online e sistema de comentários do orientador.

## Funcionalidades

| Feature | Descrição |
|---------|-----------|
| 📝 **LaTeX + ABNT** | Escrita em LaTeX com abntex2, normas ABNT NBR 14724 |
| 🔄 **CI/CD automático** | GitHub Actions compila o PDF a cada push (~3 min) |
| 🌐 **Site de visualização** | PDF visualizável online com iframe nativo do browser |
| 🔐 **Autenticação Google** | Login com Google OAuth, acesso restrito por e-mail |
| 💬 **Comentários** | Orientador comenta por página, salvo como GitHub Issue |
| 🤖 **Integração com IA** | Claude lê os comentários via `/api/issues` e aplica correções |
| 🆓 **100% gratuito** | GitHub + Vercel free tier |

## Início rápido

Leia o **[MANUAL.md](./MANUAL.md)** para instruções completas de instalação.

Para usar com o Claude, copie o prompt do **[PROMPT_INICIAL.md](./PROMPT_INICIAL.md)**.

## Estrutura

```
├── main.tex                    # LaTeX principal
├── allowed_emails.txt          # E-mails com acesso ao site
├── MANUAL.md                   # Guia de instalação
├── PROMPT_INICIAL.md           # Prompt para o Claude
├── capitulos/                  # Capítulos do trabalho
├── pretextual/                 # Capa, resumo, sumário
├── postextual/                 # Apêndices
├── referencias/                # referencias.bib
├── figuras/                    # Imagens
├── api/                        # Serverless functions (Vercel)
├── site/                       # Site público
└── .github/workflows/          # GitHub Actions
```

## Créditos

Desenvolvido por [Guilherme de Jesus Lourenço](https://github.com/guilhermejlou) como parte do Trabalho de Formatura da Escola Politécnica da USP (2026).
