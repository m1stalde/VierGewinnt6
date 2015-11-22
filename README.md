# Vier Gewinnt der Gruppe 6

## Programm ausführen

Node 0.12.2 installieren

- https://nodejs.org/en/blog/release/v0.12.2/
- https://nodejs.org/dist/v0.12.2/x64/node-v0.12.2-x64.msi

Globale Pakete installieren

- npm install gulp -g
- npm install tsd -g
- npm install bower -g
  
Client bauen

- cd client
- npm install
  (Warnungen beim ersten Aufruf bezüglich node-gyp.js, Python oder C++-Compiler ignorieren)
- tsd install
- bower install
- gulp build
  
Server bauen

- cd server
- npm install
  (Warnungen beim ersten Aufruf bezüglich node-gyp.js, Python oder C++-Compiler ignorieren)
- tsd install
- gulp build
  
Server starten

- node deploy\app\index.js
- http://127.0.0.1:2999/index.html in Browser öffnen

Alternative mit run.bat

- Node 0.12.2 installieren
- run.bat ausführen

## Testing

### E2E-Tests mit Selenium und Protractor

Vorbedingungen:

1. Java JDK installieren
   http://www.oracle.com/technetwork/java/javase/downloads/index.html
   http://download.oracle.com/otn-pub/java/jdk/8u66-b18/jdk-8u66-windows-x64.exe
2. 'gulp webdriverUpdate' ausführen
   um Selenium Server Standalone und Chrome-Treiber zu installieren

E2E-Tests ausführen:

1. 'gulp e2eTest' um E2E-Tests mit Protractor auszuführen

## Funktionen
- Spiel remote oder lokal
- Chat öffentlich und privat
- Responsive UI für Mobile, Tablet und Desktop
- Spiel mit personalisiertem Account oder als Gast möglich (Usability durch 1 Click to Play)
- Login und Logout für personalisierten Bereich
- Benutzerbereich zum Editieren des eigenen Profils

## Angewandte Themen
1. HTML
1. CSS
1. DOM
    - Event Bubbling
      Ein Event-Listener auf dem Spielfeld um Click-Events aller Felder zu verarbeiten
1. JavaScript
    - JavaScript am Ende der HTML-Seite eingebunden, damit der Browser bereits mit dem Rendering der Seite beginnen kann.
1. NodeJS
1. REST
1. Express
    - Front Controller Pattern mit Routes, Controllers und Services
1. Engineering Grundlagen
1. UX
    - 6+1 von 125 Designprinzipien:
        - Affordanz  
          Masken und Beschriftungen so designed, damit keine Erklärungen und Hilfetexte nötig sind  
          Leichte Bedienung durch Gast-Modus um sofort mit dem Spiel beginnen zu können
        - Anordnung (Optische Ausrichtung)  
          Zusammengehörende Elemente für Chat, Spiel, Lobby, etc. wurden aneinander ausgerichtet, um das Auge des Betrachters zu führen.
        - Blank Slate  
          Grafik und Info, wenn noch keine Räume oder Chat-Nachrichten vorhanden sind
        - Farbe  
          (Farbkreis und Farbharmonie)
        - Fitt's Law  
          Grösse von Schaltflächen für Touch-Bedienung optimiert
          Mauswege durch geschickte Anordnung der einzelnen Komponenten optimiert
        - Horror Vacui  
          Bewusst leere Bereiche auf den Screens freigehalten um Ansichten nicht zu überladen und die Wahrnehmung des Benutzers auf das Wesentliche zu lenken
        - Progressive Disclosure  
          (nicht jedem User die gesamte Funktionalität zeigen)
1. Angular


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

## Todo
1. Prio 1
- [x] Chat-Meldung im Spiel verwirft Spiel und wechselt auf #/home, während Local- und Remote-Spiel
- [x] Lobby automatisch aktualisieren wenn neue Räume erstellt oder aktualisiert werden
- [x] Raum aktualisieren wenn Spiel startet oder beendet wird
- [x] Testdaten aus lobbyService.ts entfernen
- [x] GameUpdateMessage bzw. IGameData um GameId erweitern -> Marcel
- [x] Warnung beim Server-Start beheben: body-parser deprecated undefined extended: provide extended option at index.js:12:20 -> Marcel
- [x] Wenn Browser direkt auf #/game geöffnet wird, so erscheint "Zug abwarten" weil nach der Websocket-Connection nochmals eine neue PlayerId vergeben wird -> Marcel
- [x] Einstellungen nur beim Login zeigen oder bei Klick auf Login weiterleiten -> Marcel
- [x] Error-Handling im Client mittels Logger und Toastr -> Marcel
- [x] Logger statt console.log auf Server verwenden

1. Prio2
- [ ] Layout Lobby für schmale Displays anpassen
- [x] neuer Raum startet mit bestehenden Spiel statt mit neuem Spiel
- [ ] favicon.ico erstellen um Fehlermeldung im Browser-Console zu vermeiden
- [ ] Lobby für Gast zugänglich machen
- [x] Typescript-Errors in app\chat\controllers\chat-controller.ts beheben
- [x] Typescript-Errors in app\lobby\controllers\lobby-controller.ts beheben
- [x] Typescript-Errors in app\lobby\interfaces\lobby-interface.ts beheben
- [ ] Gast-Accounts mit Nummer durchzählen (Gast 1, Gast 2, etc.)

- [ ] HTML-Code aus chat-directive.ts entfernen
- [ ] Generierte Test-Klassen im Client ergänzen oder löschen
- [ ] Label-Texte aus game-controller.ts in game-move-directive.tpl.html verschieben
- [ ] nicht verwendete lobby-constants.ts löschen

1. Prio3
- [ ] Mehrsprachigkeit über ngTranlsate realisieren
- [ ] Chat-Nachricht über Enter abschicken
- [ ] Chat-Darstellung in Breite optimieren
- [ ] Meldung wenn keine Chat-Nachrichten vorhanden sind darstellen
- [x] favicon hinzugefügt
- [x] Server beendet sich wenn Game nicht gefunden wird
- [x] Navigation passt sich dem Login/Logout-Status an

## Update

npm aktualisieren
1. npm aktualisieren: npm install npm -g

Client aktualisieren
1. cd client
npm install
1. globale packages updaten:
   npm update -g
   npm outdated -g --depth=0
1. lokale Packages updaten:
   npm update
   npm outdated
   

## Protractor global installieren und nutzen

npm install -g protractor
webdriver-manager update
webdriver-manager start
