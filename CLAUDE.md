# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

An ABNT-formatted academic report (LaTeX) for the USP Escola Politécnica course **PRO3584 — Projeto, Processo e Gestão da Inovação** (Prof. Mario Sergio Salerno). "Grupo 6" analyzes the innovation-management decision process of **Capim Software**, a healthtech/fintech for dental clinics, applying four frameworks from the course (Salerno's innovation-process typology, Hansen & Birkinshaw's innovation value chain, Goffin & Mitchell's risk/return portfolio matrix, and Salerno & Gomes' Discovery–Incubation–Acceleration ambidexterity model). The repo also publishes the compiled report and a slide presentation as a small static site.

This is a **content/writing repository**, not an application — most work here is editing LaTeX prose to reflect the case study accurately, not writing code.

## Build commands

```bash
make          # compile main.pdf (pdflatex → biber → pdflatex → pdflatex)
make site     # compile and copy the PDF into site/main.pdf (published copy)
make clean    # remove LaTeX auxiliary files (*.aux, *.bbl, *.log, etc.)
```

Manual equivalent of `make all`:
```bash
pdflatex -interaction=nonstopmode main.tex
biber main
pdflatex -interaction=nonstopmode main.tex
pdflatex -interaction=nonstopmode main.tex
```

Requires a `abntex2`-capable TeX Live install (the `abntex2.cls` file ships in Debian/Ubuntu's `texlive-latex-extra`, not `texlive-latex-base`) plus `lmodern` and `biber`. On a bare Ubuntu box:
```bash
apt-get install -y texlive-latex-base texlive-lang-portuguese texlive-latex-recommended \
  texlive-fonts-recommended texlive-bibtex-extra texlive-pictures texlive-latex-extra lmodern biber
```
CI uses the `ghcr.io/xu-cheng/texlive-full` Docker image instead of assembling packages piecemeal.

There is no test suite and no linter — correctness here means "the PDF compiles with no undefined references/citations and the content is factually faithful to the interview transcript and cited sources."

## Architecture / document assembly

`main.tex` is the single entry point. It sets `abntex2` class options and document metadata (title, authors, advisor), then pulls in the rest via `\include`, in this fixed order:

1. **`pretextual/`** — cover, title page, abstract (PT/EN), lists of figures/tables, TOC. `\pretextual`.
2. **`capitulos/01..08_*.tex`** — the actual report body. `\textual`. Chapter labels (`\label{cap:...}`) are cross-referenced heavily between chapters (e.g. Chapter 6 is "the core chapter" and is referenced from the introduction, methodology, and conclusion). When editing one chapter, grep for its `\label`/figure/table labels (`fig:...`, `tab:...`, `sec:...`) across `capitulos/` before moving or deleting content — labels are shared/cross-referenced across chapter files, not local to one file.
3. **Bibliography** — `\printbibliography` pulls from `referencias/referencias.bib` via `biblatex`/`biber` (ABNT style). Every `\cite`/`\textcite` key must exist there.
4. **`postextual/apendices.tex`** — appendix (currently: interview question script). `\postextual`.

Chapter map (`capitulos/`): 01 introdução → 02 metodologia → 03 descrição da empresa → 04 meio ambiente (mercado/concorrência) → 05 análise organizacional (Galbraith/Mintzberg/SWOT) → 06 processo decisório de inovação (the analytical core — applies the four frameworks) → 07 diagnóstico e proposta de melhoria → 08 conclusão.

### Source material that grounds the content

- `report/transcript_enterview.md` — full interview transcript with Capim's PM (Lucas Mathias); this is the primary source. Claims in `capitulos/` should be traceable to this file or explicitly marked as the authors' analytical inference.
- `report/perguntas_validacao.md` — companion doc (not part of the deliverable) tracking every assumption/inference made in the report that isn't literally stated in the interview and needs team confirmation (institutional data, analytical framework classifications, etc.). Check this file before asserting something is a "fact" vs. an inference.
- `report/Relatório - Salerno.docx` / `report/Críticas - Salerno.docx` — prior version and professor feedback that motivated the current chapter structure (see the framing in `capitulos/01_introducao.tex`).
- `report/material_de_aula/` — course readings for the frameworks cited (Salerno, Hansen & Birkinshaw, Goffin & Mitchell, O'Connor & Meyer, etc.); some are scanned PDFs with no extractable text.
- `TODO(equipe)` comments inside `.tex` files mark open items pending confirmation from a specific team member — check for these before treating flagged claims as settled.

## Publishing pipeline (do not hand-edit generated output)

- **`.github/workflows/build.yml`**: on push to `master`/`main`, compiles `main.tex` inside the `texlive-full` container, then commits the resulting `main.pdf` into `site/main.pdf` (with `[skip ci]`). `main.pdf` at the repo root is gitignored (build artifact); `site/main.pdf` is the tracked, published copy.
- **`.github/workflows/deploy.yml`**: on push to `master`, deploys `site/` (static viewer + `site/apresentacao/` slide deck) to Vercel via `vercel.json` (`outputDirectory: site`).
- Because compilation and publishing happen in CI, don't commit a locally-built `main.pdf`/`site/main.pdf` from a feature branch unless specifically asked — let the workflow regenerate it on merge.

## Other directories

- `template/tf-academico-template/` — a vendored reference ABNT LaTeX template, unrelated to and not included by `main.tex`. Don't confuse its `capitulos/`/`pretextual/` with the real ones at the repo root.
- `figuras/` — static image assets (e.g. `logomarca.png`) referenced via `\includegraphics`.
