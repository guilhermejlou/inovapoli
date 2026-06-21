# 📘 Manual de Instalação — Template de Trabalho Acadêmico

## O que este projeto oferece

- ✅ PDF do trabalho compilado automaticamente via LaTeX (GitHub Actions)
- ✅ Site para visualização do PDF com autenticação Google
- ✅ Sistema de comentários do orientador vinculados a páginas
- ✅ Deploy gratuito no Vercel com atualização automática
- ✅ Lista de e-mails com acesso configurável via arquivo de texto

---

## Pré-requisitos

- Conta no [GitHub](https://github.com)
- Conta no [Vercel](https://vercel.com) (gratuito)
- Conta no [Google Cloud](https://console.cloud.google.com) (gratuito)
- Git instalado na sua máquina ([git-scm.com](https://git-scm.com))

---

## Passo 1 — Configurar o repositório no GitHub

```bash
# 1. Extraia o ZIP do template em uma pasta local

# 2. Na pasta extraída, inicialize o repositório git
git init
git add .
git commit -m "feat: estrutura inicial do trabalho"

# 3. Crie um repositório NOVO no github.com (sem README, sem .gitignore)
# Nome sugerido: meu-trabalho-academico

# 4. Conecte e suba
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

---

## Passo 2 — Configurar o GitHub Actions (compilação do PDF)

No repositório do GitHub, ative as permissões de escrita para o Actions:

1. Vá em **Settings → Actions → General**
2. Role até **Workflow permissions**
3. Selecione **"Read and write permissions"**
4. Clique **Save**

O PDF será compilado automaticamente a cada `git push` e salvo em `site/main.pdf`.

---

## Passo 3 — Criar credencial Google OAuth

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie um novo projeto (ex: `meu-trabalho`)
3. Menu lateral → **APIs e Serviços → Credenciais**
4. Clique **Criar credenciais → ID do cliente OAuth 2.0**
5. Tipo: **Aplicativo da Web**
6. Em **Origens JavaScript autorizadas**, adicione:
   ```
   https://SEU-PROJETO.vercel.app
   ```
7. Clique **Criar** e copie o **ID do cliente** (formato: `xxxx.apps.googleusercontent.com`)

---

## Passo 4 — Deploy no Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com o GitHub
2. Clique **Add New Project → Import Git Repository**
3. Selecione o repositório criado
4. Clique **Deploy** (as configurações do `vercel.json` são detectadas automaticamente)

---

## Passo 5 — Configurar variáveis de ambiente no Vercel

No painel do Vercel → seu projeto → **Settings → Environment Variables**:

| Nome | Valor | Obrigatório |
|------|-------|-------------|
| `GOOGLE_CLIENT_ID` | ID copiado do Google Cloud | ✅ |
| `SESSION_SECRET` | Qualquer string longa e aleatória (ex: `xK9#mP2!qR7vL3`) | ✅ |

> ⚠ A variável `ALLOWED_EMAILS` **não é necessária** — os e-mails são gerenciados pelo arquivo `allowed_emails.txt` no repositório.

Após salvar as variáveis, clique em **Redeploy**.

---

## Passo 6 — Configurar e-mails com acesso

Edite o arquivo `allowed_emails.txt` na raiz do projeto:

```
# Orientador
orientador@universidade.edu.br

# Autor
voce@email.com
```

Cada vez que você editar e fazer push, o acesso é atualizado automaticamente.

---

## Passo 7 — Personalizar o trabalho

### 7.1 Dados do documento (`main.tex`)
Substitua todos os campos `[PREENCHER]`:

```latex
\titulo{Título do seu trabalho}
\autor{Seu Nome Completo}
\orientador{Prof. Dr. Nome do Orientador}
\instituicao{Nome da Universidade}
...
```

### 7.2 Header do site (`site/index.html`)
Localize os comentários `<!-- ⚠ PREENCHER -->` e substitua:

```html
<div class="h-title">Título do Trabalho — Tipo de Trabalho</div>
<div class="h-sub">Seu Nome · Universidade · Curso · Prof. Orientador</div>
```

Também atualize a constante `REPO` no JavaScript:
```javascript
const REPO = 'seu_usuario/seu_repositorio';
```

### 7.3 Criar a label no GitHub
Para que os comentários apareçam corretamente:
1. Acesse: `github.com/SEU_USUARIO/SEU_REPOSITORIO/issues/labels`
2. Clique **New label**
3. Nome: `professor-comment`
4. Cor: `#e4b429`
5. Clique **Create label**

### 7.4 Configurar token do GitHub para comentários
1. Crie um token em: GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
2. Marque apenas: `public_repo`
3. No Vercel, adicione a variável: `GITHUB_TOKEN` com o token gerado

---

## Fluxo de trabalho diário

```bash
# Editar os arquivos .tex do trabalho
# ...

# Salvar e subir
git add .
git commit -m "cap 2: adiciona revisão de literatura"
git push
```

→ O GitHub Actions compila o PDF (~3 min)  
→ O Vercel atualiza o site automaticamente  
→ O orientador acessa o site, lê e comenta  
→ Você vê os comentários no painel lateral  

---

## Estrutura do projeto

```
seu-repositorio/
│
├── main.tex                    # Arquivo LaTeX principal — compile este
├── allowed_emails.txt          # E-mails com acesso ao site
├── vercel.json                 # Configuração do Vercel
├── Makefile                    # Compila localmente: make
├── .gitignore
│
├── capitulos/                  # Capítulos do trabalho
│   ├── 01_introducao.tex
│   ├── 02_revisao_conceitual.tex
│   └── ...
│
├── pretextual/                 # Capa, resumo, sumário, etc.
├── postextual/                 # Apêndices, glossário
├── referencias/                # referencias.bib
├── figuras/                    # Imagens do trabalho
│
├── api/                        # Funções serverless do Vercel
│   ├── auth.js                 # Autenticação Google OAuth
│   ├── verify-session.js       # Validação de sessão
│   ├── logout.js               # Logout
│   ├── login.js                # Página de login
│   ├── comment.js              # Cria comentários (Issues GitHub)
│   └── issues.js               # Lista comentários para Claude
│
├── site/                       # Arquivos públicos do site
│   ├── index.html              # Visualizador do PDF
│   ├── login.html              # Página de login
│   └── main.pdf                # (gerado automaticamente pelo CI)
│
└── .github/
    └── workflows/
        └── build.yml           # GitHub Actions: compila LaTeX → PDF
```

---

## Como adicionar comentários (fluxo do orientador)

1. Acessa o site (URL do Vercel)
2. Faz login com o Google (e-mail deve estar em `allowed_emails.txt`)
3. Lê o PDF no visualizador nativo
4. Anota o número da página
5. Clica em **✏️ Adicionar comentário**
6. Preenche: página, nome, trecho e comentário
7. Clica Enviar → comentário aparece no painel lateral e no GitHub

---

## Como usar os comentários com a IA

Diga ao Claude:
> *"Acesse https://SEU-PROJETO.vercel.app/api/issues e veja os comentários do orientador. Aplique as correções correspondentes nos arquivos LaTeX."*

---

## Problemas comuns

| Problema | Solução |
|----------|---------|
| PDF não compila | Verifique o log em GitHub → Actions → último workflow |
| Login não funciona | Confirme que a URL do Vercel está nas origens autorizadas no Google Cloud |
| Comentário dá erro | Verifique se `GITHUB_TOKEN` está configurado no Vercel |
| E-mail não tem acesso | Adicione o e-mail em `allowed_emails.txt` e faça push |
