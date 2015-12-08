# Testing

## Unit-Tests für Server ausführen

Gulp Server:

1. 'cd server'
1. 'gulp build'
1. 'gulp test-run'

## E2E-Tests mit Selenium und Protractor

Vorbedingungen:

1. Java JDK installieren
   http://www.oracle.com/technetwork/java/javase/downloads/index.html
   http://download.oracle.com/otn-pub/java/jdk/8u66-b18/jdk-8u66-windows-x64.exe
2. 'gulp webdriverUpdate' ausführen
   um Selenium Server Standalone und Chrome-Treiber zu installieren

E2E-Tests ausführen:

1. 'gulp e2eTest' um E2E-Tests mit Protractor auszuführen

## Protractor global installieren und nutzen

npm install -g protractor
webdriver-manager update
webdriver-manager start

## User-Tests

Zur Ermittlung der Benutzerakzeptanz wurde ein Usability-Test durchgeführt. Dabei wurden einer Versuchperson typische Aufgaben gestellt, um die Anwendung auf ihre Benutzerakzeptanz zu prüfen.

Die Aufgaben und die gestellten Bewertungsfragen sind hier zu finden:
[Gestellte Aufgabe](Testing/UserTest.md)

Die Antworten auf die gestellten Bewertungsfragen sind hier zu finden:
[Antworten](Testing/UserTest20151129.pdf)

Nach Rücksprache mit der Testperson resultieren die folgenden Erkenntnisse:

**Wie bewerten Sie die Bedienung des Spiels?**

- Spiel durchgehend in deutscher Sprache
   -> englische Begriffe übersetzen
- Erklärung betreffend Chat fehlen
   -> Funktionalität des Chats auf der Startseite analog der anderen Komponenten erläutern
- Angaben über angemeldete Spieler fehlen
   -> Liste der Online-Spieler in der Lobby anzeigen

**Wie bewerten Sie die optische Erscheinung des Spiels?**

- Runde Spielsteine statt eckige
   -> Verschiedene Themes anbieten, die Spielfeld unterschiedlich darstellen
- Cooler Hintergrund
   -> Foto von 4Gewinnt-Steinen auf dem Balkontisch in der Herbstsonne hat sich bewährt

**Wie bewerten Sie die Funktionalität des Spiels?**

- alles notwendige vorhande
   -> das Spiel erfüllt die Grundanforderungen
- nicht überladen, eher nüchtern
   -> Horror Vacui mit bewusst leeren Bereichen wirkt, Schriften/Darstellung sollten verspielter sein
- Button für direkte Rückkehr aus dem Spiel in die Lobby fehlt
   -> Button "Spiel beenden" wechselt in die Lobby, besser beschriften
- Hinweise über erfolgreiches Logout
   -> Statt direkt die Login-Maske anzuzeigen, eine Meldung über erfolgreiches Logout darstellen
