# Testing

## Unit-Tests f�r Server ausf�hren

Gulp Server:

1. 'cd server'
1. 'gulp build'
1. 'gulp test-run'

## E2E-Tests mit Selenium und Protractor

Vorbedingungen:

1. Java JDK installieren
   http://www.oracle.com/technetwork/java/javase/downloads/index.html
   http://download.oracle.com/otn-pub/java/jdk/8u66-b18/jdk-8u66-windows-x64.exe
2. 'gulp webdriverUpdate' ausf�hren
   um Selenium Server Standalone und Chrome-Treiber zu installieren

E2E-Tests ausf�hren:

1. 'gulp e2eTest' um E2E-Tests mit Protractor auszuf�hren

## Protractor global installieren und nutzen

npm install -g protractor
webdriver-manager update
webdriver-manager start

## User-Tests

Zur Ermittlung der Benutzerakzeptanz wurde ein Usability-Test durchgef�hrt. Dabei wurden einer Versuchperson typische Aufgaben gestellt, um die Anwendung auf ihre Benutzerakzeptanz zu pr�fen.

Die Aufgaben und die gestellten Bewertungsfragen sind hier zu finden:
[Gestellte Aufgabe](Testing/UserTest.md)

Die Antworten auf die gestellten Bewertungsfragen sind hier zu finden:
[Antworten](Testing/UserTest20151129.pdf)

Nach R�cksprache mit der Testperson resultieren die folgenden Erkenntnisse:

**Wie bewerten Sie die Bedienung des Spiels?**

- Spiel durchgehend in deutscher Sprache
   -> englische Begriffe �bersetzen
- Erkl�rung betreffend Chat fehlen
   -> Funktionalit�t des Chats auf der Startseite analog der anderen Komponenten erl�utern
- Angaben �ber angemeldete Spieler fehlen
   -> Liste der Online-Spieler in der Lobby anzeigen

**Wie bewerten Sie die optische Erscheinung des Spiels?**

- Runde Spielsteine statt eckige
   -> Verschiedene Themes anbieten, die Spielfeld unterschiedlich darstellen
- Cooler Hintergrund
   -> Foto von 4Gewinnt-Steinen auf dem Balkontisch in der Herbstsonne hat sich bew�hrt

**Wie bewerten Sie die Funktionalit�t des Spiels?**

- alles notwendige vorhande
   -> das Spiel erf�llt die Grundanforderungen
- nicht �berladen, eher n�chtern
   -> Horror Vacui mit bewusst leeren Bereichen wirkt, Schriften/Darstellung sollten verspielter sein
- Button f�r direkte R�ckkehr aus dem Spiel in die Lobby fehlt
   -> Button "Spiel beenden" wechselt in die Lobby, besser beschriften
- Hinweise �ber erfolgreiches Logout
   -> Statt direkt die Login-Maske anzuzeigen, eine Meldung �ber erfolgreiches Logout darstellen
