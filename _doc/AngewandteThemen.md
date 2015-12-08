# Angewandte Themen

## HTML

- Semantische Tags (nav, header, section, aside, etc.)
- Role-Atttributes für Accessibility mittels Screen-Reader

## CSS

- Effiziente (kurze) Selektoren
- Autoprefixer für Browser-spezifische CSS-Properties (z.B. "user-select: none;" in game.less)

## DOM

- Event Bubbling
  Ein Event-Listener auf dem Spielfeld um Click-Events aller Felder zu verarbeiten

## JavaScript

- JavaScript am Ende der HTML-Seite eingebunden, damit der Browser bereits mit dem Rendering der Seite beginnen kann.
- Strict Mode für gesamten Code
- Object-Oriented Programming eingesetzt wo sinnvoll

## TypeScript

- Client- und Server-Code in TypeScript
- Unit-Tests in TypeScript

## NodeJS

- korrekte HTTP Status Codes bei Fehlern
- Session-Management über Cookies
- Events über EventEmitter

## REST

- Restful-APIs mit Standard-HTTP-Methoden

## Express

- Front Controller Pattern mit Routes, Controllers und Services
- Error-Middleware für Error-Handling
- Custom-Security-Module für Session-Handling über REST- und WebSocket-Requests
- Standard WebSockets für Server->Client und Client-Server Kommunikation

## Engineering Grundlagen

Software Engineering Principles

- DRY (mehrfach genutzer Code in separate Module ausgelagert)
- YAGNI (Fokussierung auf die für das Spiel notwendige Funktionalität)
- KISS (Design und Implementation möglichst einfach und klar)
- SOLID (Abhängigkeiten zwischen Modulen durch Dependency Inversion reduziert)
- Clean Code (einfache und kurze Methoden)
- MVVM (ViewModels im Client)

## UX

6+1 von 125 Designprinzipien:

- Affordanz  
  Masken und Beschriftungen so designed, damit keine Erklärungen und Hilfetexte nötig sind  
  Leichte Bedienung durch Gast-Modus um sofort mit dem Spiel beginnen zu können
- Anordnung (Optische Ausrichtung)  
  Zusammengehörende Elemente für Chat, Spiel, Lobby, etc. wurden aneinander ausgerichtet, um das Auge des Betrachters zu führen.
- Blank Slate  
  Grafik und Info, wenn noch keine Räume oder Chat-Nachrichten vorhanden sind
- Fitt's Law  
  Grösse von Schaltflächen für Touch-Bedienung optimiert
  Mauswege durch geschickte Anordnung der einzelnen Komponenten optimiert
- Horror Vacui  
  Bewusst leere Bereiche auf den Screens freigehalten um Ansichten nicht zu überladen und die Wahrnehmung des Benutzers auf das Wesentliche zu lenken

## Angular

- Form Validation
- Resource-Service
- ViewModels über ControllerAs-Syntax
- Custom-Directives
- Promises (verwendet und angeboten)

## Responsive Design

- Meta-Viewport (UI durch Benutzer in Grösse frei skalierbar)
- Fluid Layout (UI passt sich der Screen-Breite durch Skalierung dynamisch an)
- Bootstrap Media Queries (unterschiedliche Layouts für verschiedene Screen-Grössen)
- Responsive Images (an Screen-Grösse angepasste Hintergrund-Bilder)
- Webfont für frei skalierbare Icons

## Automatisierung

Dependency Management

- Bower (Abhängigkeiten im Client)
- NPM (Abhängigkeiten Server und Client-DEV)

Task-Runner

- GULP für Client und Server
- GULP-Tasks für Server selbst erstellt
- GULP-Tasks für Client von ng-poly verwendet

CSS-Präprozessor

- LESS (Variablen, Nesting, Parent-Selektor, Import, Mixins)

CSS-Postprocessor

- Autoprefixer für Browser-spezifische CSS-Properties (z.B. "user-select: none;" in game.less)

## Testing

Server

- Mocha (Test-Framework)
- Chai (BDD/TDD assertion library)

Client

- Protractor (E2E-Test-Framework)
- Jasmine (BDD-Test-Framework)
- Karma (Test-Runner)
- Selenium (WebDriverJS)

## Modularisierung

- klassische (technische) Struktur auf Server (routes, controllers, services)
- funktionale Struktur auf Client (game, lobby, chat)

## Site Optimization

- Image-Fonts für Icons
- Korrekte Bild-Formate (JPEG für Background-Foto)
- Miminized Images mittels Kraken.io (Resultat siehe unten)
- Responsive Images (Background-Image)
- JavaScript am Schluss der Seite
- Effizientes CSS ohne tiefe Verschachtelungen
- Concat und Minify CSS (gulp build --stage prod)
- Concat, Minify und Uglify JS (gulp build --stage prod)

Resultat Bildoptimierung mit Kraken.io:
![Resultat kraken.io](SiteOptimization/kraken.io.png)

## Web Security

Passwörter verschlüsselt gespeichert:

- Passwort-Hash mit PBKDF2 (crypto.pbkdf2)
- Salt mit Zufallszahl (crypto.randomBytes)

NodeJS:

- Cookie-basiertes Session-Handling
- httpOnly-Flag gesetzt
- Header "x-powered-by" deaktiviert
- Request-Validierung über Parameter und User-Authorization

Cross Site Scripting:

- Alphanumeric Whitelist für Benutzernamen (Client- und Server-seitig mittels RegExp geprüft)
- Whitelist für Raum-Namen in Lobby
- Filter für nicht erlaubte Zeichen im Chat
- Alle Eingabefelder mittels Eingabe von "<script>alert(1)</script>" geprüft

## Accessibility

Formular-Markup und -Validierung

- Labels für Formularfelder
- Gültige und ungültige Felder farblich und mit Symbol hervorgehoben

Tastaturbedienbarkeit

- Tastaturbedienung getestet
- Spiel um Tastaturbedienung mittels Pfeiltasten links, rechts, unten plus Enter und Space erweitert

Skalierbarkeit

- Anwendung ist frei skalierbar

Screen Reader

- Role-Atttributes
