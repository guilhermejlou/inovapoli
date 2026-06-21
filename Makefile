# ==============================================================
# Makefile — Capim Software: Sistema de Gestão da Inovação
# Uso: make        → compila o PDF completo
#      make site   → compila e publica o PDF em site/main.pdf
#      make clean  → remove arquivos auxiliares
#      make view   → abre o PDF gerado
# ==============================================================

MAIN = main
LATEX = pdflatex
BIBER = biber

.PHONY: all site clean view

all:
	$(LATEX) -interaction=nonstopmode $(MAIN).tex
	$(BIBER) $(MAIN)
	$(LATEX) -interaction=nonstopmode $(MAIN).tex
	$(LATEX) -interaction=nonstopmode $(MAIN).tex
	@echo "Compilação concluída: $(MAIN).pdf"

site: all
	cp $(MAIN).pdf site/$(MAIN).pdf
	@echo "Última compilação local: $$(date '+%d/%m/%Y às %H:%M')" > site/last_build.txt
	@echo "PDF publicado em site/$(MAIN).pdf"

clean:
	rm -f *.aux *.bbl *.bcf *.blg *.lof *.log *.lot *.out \
	      *.run.xml *.toc *.fdb_latexmk *.fls *.synctex.gz \
	      capitulos/*.aux pretextual/*.aux postextual/*.aux

view:
	start $(MAIN).pdf
