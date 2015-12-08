# Vier Gewinnt der Gruppe 6

## Programm ausführen

Der Client ist als Produktiv-Build bereits im Server enthalten und muss daher nicht zwingend erneut gebaut werden.

Quickstart (Details siehe [Entwicklung](_doc/Development.md))

- Vorbedingungen
  Node 0.12.2 installieren
  Globale Pakete installieren
- Server
  Server bauen
  Server starten
- Browser öffnen
  http://127.0.0.1:2999/index.html

Alternativ run.bat ausführen:

- Node 0.12.2 installieren
- run.bat ausführen

## Entwicklung

siehe [Entwicklung](_doc/Development.md)

## Testing

siehe [Testing](_doc/Testing.md)

## Funktionen
- Spiel remote oder lokal
- Chat öffentlich und privat
- Responsive UI für Mobile, Tablet und Desktop
- Spiel mit personalisiertem Account oder als Gast möglich (Usability durch 1 Click to Play)
- Login und Logout für personalisierten Bereich
- Benutzerbereich zum Editieren des eigenen Profils
- Lobbybereich als zentraler Ausgangspunkt für das Starten eines Spiels

## Angewandte Themen

siehe [Angewandte Themen](_doc/AngewandteThemen.md)

## Eingesetzte Technologien
- TypeScript auf Client und Server
- AngularJS 1.4
- Bootstrap
- Gulp
- LESS
- ExpressJS
- WebSockets
- NodeJS
- NEDB
- Mocha
- Chai
- jQuery
- Toastr
- Autoprefixer


## Herausforderungen

Client:

- quadratisch frei skalierbare Spielfelder als reine CSS-Lösung
- Agular-Direktive mit eigenem Controller mit controllerAs-Syntax und TypeScript
- Unterschiedliches Verhalten im Production-Mode mit minifized Files
- Unit-Tests von Angular-Controllers und -Services mit IResourceService-Mock und TypeScript
- Modulare Chat Direktive welches ohne grossen Konfigurationsaufwand wiederverwertetet werden kann
- Eigenheiten des ng-poly überwinden (Konfigurationen, auf den ersten Blick unerklärliche Verhalten)

Server:

- Session-Information aus Websocket-Request auslesen
- Server-Code inkl. Unit-Tests in TypeScript mit Type-Definitions für Node-Module
- OAuth mit Twitter Implementatieren => der Prototyp hatte noch einige Bugs und wurde deshalb aus dem produktiven Build herausgenommen

