NAJDI ME – propojeni s Google Diskem

OBSAH
- index.html, style.css, app.js: veřejná hra
- admin.html: mobilní administrace zpráv
- Kód.gs: serverový kód pro Google Apps Script (NEPATŘÍ na GitHub Pages)

POSTUP
1. V Apps Scriptu nahraď celý obsah Kód.gs obsahem přiloženého Kód.gs.
2. Zkontroluj FOLDER_ID (musí odpovídat složce NAJDI ME – Fotografie na účtu aplikace2026@gmail.com).
3. V Nastavení projektu > Vlastnosti skriptu ponech ADMIN_PASSWORD s nastaveným heslem.
4. Ulož skript a zvol Implementovat > Spravovat implementace > Upravit (tužka) > Nová verze > Implementovat.
5. Použij URL webové aplikace, která je nastavena v app.js a admin.html.
6. Na GitHub Pages nahraj soubory z tohoto ZIPu a přepiš původní index.html, app.js, admin.html a style.css. Ostatní původní soubory zachovej. Kód.gs na GitHub nenahrávej.

NASAZENÍ APPS SCRIPTU
- Typ: Webová aplikace
- Provést jako: Já (aplikace2026@gmail.com)
- Kdo má přístup: Kdokoli

FUNKCE
- Veřejná hra načítá zprávy přes JSONP a kontroluje nové příspěvky každých 30 sekund.
- Administrace vyžaduje ADMIN_PASSWORD pro zápis, úpravu a mazání.
- Fotografie se posílají do složky Google Disku a sdílí se jako „Kdokoli s odkazem – Prohlížející“.
- Fotografie max. 4 MB v této verzi.

BEZPEČNOST A OMEZENÍ
- Veřejné čtení seznamu zpráv je záměrné; zápis/úpravy/mazání jsou chráněny heslem.
- Heslo není součástí souborů na GitHubu. Nepoužívej ho nikde jinde.
- Při publikování přes fetch no-cors nemůže prohlížeč přečíst odpověď serveru; administrace proto po odeslání znovu načte seznam a ověří, zda se změna projevila.
- Pokud se příspěvek neobjeví, zkontroluj Protokol spuštění v Apps Scriptu.
