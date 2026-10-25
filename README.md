# Studienplaner

Persönliche Webanwendung zur Organisation eines Studiensemesters. Sie verbindet eine Modulübersicht mit Lernzeiten, Kalender und Aufgabenliste.

## Funktionen

- Lernfortschritt je Modul festhalten.
- Lernzeiten mit einem Timer erfassen oder nachtragen.
- Termine und Aufgaben verwalten.
- Lernaktivität im Dashboard auswerten.

## Technik

React 19, JavaScript und Vite. Die Daten werden im Local Storage des Browsers gespeichert. Es gibt keinen Server, kein Benutzerkonto und keine Synchronisation zwischen Geräten. Beim Löschen der Browserdaten gehen die gespeicherten Einträge verloren.

## Lokal starten

Mit Node.js 22.12 oder neuerer unterstützter Version und npm:

```bash
npm ci
npm run dev
```

Vite zeigt die lokale Adresse im Terminal an.

```bash
npm run build
npm run preview
npm run lint
```

Der Build schreibt die statische Anwendung in `docs/`. Dieser Ordner enthält erzeugte Dateien; Änderungen werden in `src/` vorgenommen.

## Orientierung

`src/components` enthält Dashboard, Kalender, Aufgaben und Timer. Die Hooks in `src/hooks` verwalten die Daten. `src/App.jsx` verbindet die Ansichten.

## Stand

Eigenes Studienprojekt. Der Produktionsbuild wurde am 25. Oktober 2026 geprüft. Der Linter meldet noch Probleme bei React-Regeln und bezieht derzeit auch erzeugte Dateien ein. Eine automatisierte Testsuite ist noch nicht vorhanden.
