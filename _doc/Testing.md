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
