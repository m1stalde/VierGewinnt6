# Todo

## Prio 1

- [x] Chat-Meldung im Spiel verwirft Spiel und wechselt auf #/home, w�hrend Local- und Remote-Spiel
- [x] Lobby automatisch aktualisieren wenn neue R�ume erstellt oder aktualisiert werden
- [x] Raum aktualisieren wenn Spiel startet oder beendet wird
- [x] Testdaten aus lobbyService.ts entfernen
- [x] GameUpdateMessage bzw. IGameData um GameId erweitern -> Marcel
- [x] Warnung beim Server-Start beheben: body-parser deprecated undefined extended: provide extended option at index.js:12:20 -> Marcel
- [x] Wenn Browser direkt auf #/game ge�ffnet wird, so erscheint "Zug abwarten" weil nach der Websocket-Connection nochmals eine neue PlayerId vergeben wird -> Marcel
- [x] Einstellungen nur beim Login zeigen oder bei Klick auf Login weiterleiten -> Marcel
- [x] Error-Handling im Client mittels Logger und Toastr -> Marcel
- [x] Logger statt console.log auf Server verwenden
- [ ] Chat und Lobby finden im Release-Build ihre Views nicht (gulp build --stage prod)
- [ ] Nachricht im Chat mit Enter absenden l�dt Seite neu, danach Error this.sendMessage is not a function
- [x] baseUrls f�r Release-Build auf Rechner-IP umstellen bzw. Browser-URL
- [ ] dev-Dependencies verwenden --save-dev
- [ ] Unit-Test auf Client implementieren

## Prio 2

- [ ] Layout Lobby f�r schmale Displays anpassen
- [x] neuer Raum startet mit bestehenden Spiel statt mit neuem Spiel
- [x] favicon.ico erstellen um Fehlermeldung im Browser-Console zu vermeiden
- [ ] Lobby f�r Gast zug�nglich machen
- [x] Typescript-Errors in app\chat\controllers\chat-controller.ts beheben
- [x] Typescript-Errors in app\lobby\controllers\lobby-controller.ts beheben
- [x] Typescript-Errors in app\lobby\interfaces\lobby-interface.ts beheben
- [ ] Gast-Accounts mit Nummer durchz�hlen (Gast 1, Gast 2, etc.)

- [ ] HTML-Code aus chat-directive.ts entfernen
- [ ] Generierte Test-Klassen im Client erg�nzen oder l�schen
- [ ] Label-Texte aus game-controller.ts in game-move-directive.tpl.html verschieben
- [ ] nicht verwendete lobby-constants.ts l�schen

## Prio 3

- [ ] Mehrsprachigkeit �ber ngTranlsate realisieren
- [ ] Chat-Nachricht �ber Enter abschicken
- [ ] Chat-Darstellung in Breite optimieren
- [x] Meldung wenn keine Chat-Nachrichten vorhanden sind darstellen
- [x] favicon hinzugef�gt
- [x] Server beendet sich wenn Game nicht gefunden wird
- [x] Navigation passt sich dem Login/Logout-Status an

