# ==============================================================
# Makefile para compilação do Trabalho de Formatura
# Uso: make        → compila o PDF completo
#      make clean  → remove arquivos auxiliares
#      make view   → abre o PDF gerado
# ==============================================================

MAIN = main
LATEX = pdflatex
BIBER = biber

.PHONY: all clean view

all:
	$(LATEX) -interaction=nonstopmode $(MAIN).tex
	$(BIBER) $(MAIN)
	$(LATEX) -interaction=nonstopmode $(MAIN).tex
	$(LATEX) -interaction=nonstopmode $(MAIN).tex
	@echo "✅ Compilação concluída: $(MAIN).pdf"

clean:
	rm -f *.aux *.bbl *.bcf *.blg *.lof *.log *.lot *.out \
	      *.run.xml *.toc *.fdb_latexmk *.fls *.synctex.gz \
	      capitulos/*.aux pretextual/*.aux postextual/*.aux
	@echo "🧹 Arquivos auxiliares removidos."

view:
	start $(MAIN).pdf
