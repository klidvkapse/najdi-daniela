[README.md](https://github.com/user-attachments/files/35343647/README.md)
# Najdi Daniela – první verze

Jednoduchá mobilní webová hra pro GitHub Pages.

## Obsah
- `index.html` – veřejná hra
- `admin.html` – lokální editor mise
- `missions.json` – veřejná konfigurace aktuální mise
- `style.css`, `app.js` – vzhled a chování
- `manifest.json`, `sw.js` – základní PWA podpora

## Nasazení na GitHub Pages
1. Vytvoř nový veřejný repozitář `najdi-daniela`.
2. Nahraj všechny soubory a složku `assets` do kořene repozitáře.
3. V Settings → Pages nastav Deploy from a branch, větev `main`, složku `/ (root)`.
4. Počkej na zveřejnění a otevři URL GitHub Pages.

## Správa mise
1. Otevři veřejnou adresu webu a přejdi na `/admin.html`.
2. Uprav město, přibližný střed oblasti, indicie a úkol.
3. Klikni na „Stáhnout missions.json“.
4. V repozitáři na GitHubu otevři `missions.json`, zvol Edit, nahraď celý obsah staženým souborem a potvrď Commit changes.

## Důležitá omezení první verze
- Administrace je editor, který připravuje soubor `missions.json`; sama nemůže bezpečně zapisovat do GitHubu.
- Veřejná data v `missions.json` jsou čitelná každému návštěvníkovi webu. Nevkládej sem přesnou polohu, neveřejná hesla ani údaje určené jen organizátorovi.
- Odměnu potvrď osobně. Automatické ověření nároku na 400 Kč vyžaduje bezpečný server a napojení na pravidla nabídky.
- Mapa zobrazuje přibližnou oblast, nikoliv živou polohu Daniela ani hráčů.
- Mapa a fonty používají externí služby (OpenStreetMap, Leaflet CDN, Google Fonts), proto potřebují připojení k internetu.
