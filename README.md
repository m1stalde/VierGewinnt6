# Vier Gewinnt der Gruppe 6

## Programm ausführen
1. run.bat ausführen

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

## Todo
1. Prio 1
- [ ] Chat-Meldung im Spiel verwirft Spiel und wechselt auf #/home, während Local- und Remote-Spiel
- [ ] Lobby automatisch aktualisieren wenn neue Räume erstellt oder aktualisiert werden
- [ ] Raum aktualisieren wenn Spiel startet oder beendet wird
- [ ] Testdaten aus lobbyService.ts entfernen
- [ ] GameUpdateMessage bzw. IGameData um GameId erweitern -> Marcel
- [ ] Warnung beim Server-Start beheben: body-parser deprecated undefined extended: provide extended option at index.js:12:20 -> Marcel
- [ ] Wenn Browser direkt auf #/game geöffnet wird, so erscheint "Zug abwarten" weil nach der Websocket-Connection nochmals eine neue PlayerId vergeben wird -> Marcel
- [ ] Einstellungen nur beim Login zeigen oder bei Klick auf Login weiterleiten -> Marcel
- [ ] Error-Handling im Client prüfen -> Marcel
- [x] Logger statt console.log auf Server verwenden

1. Prio2
- [ ] Layout Lobby für schmale Displays anpassen
- [x] neuer Raum startet mit bestehenden Spiel statt mit neuem Spiel
- [ ] favicon.ico erstellen um Fehlermeldung im Browser-Console zu vermeiden
- [ ] Lobby für Gast zugänglich machen
- [ ] Typescript-Errors in app\chat\controllers\chat-controller.ts beheben
- [ ] Typescript-Errors in app\lobby\controllers\lobby-controller.ts beheben
- [ ] Typescript-Errors in app\lobby\interfaces\lobby-interface.ts beheben
- [ ] Gast-Accounts mit Nummer durchzählen (Gast 1, Gast 2, etc.)
