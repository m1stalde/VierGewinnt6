# Entwickeln

## Vorbedingungen

Node 0.12.2 installieren

- https://nodejs.org/en/blog/release/v0.12.2/
- https://nodejs.org/dist/v0.12.2/x64/node-v0.12.2-x64.msi

Globale Pakete installieren

- npm install gulp -g
- npm install tsd -g
- npm install bower -g

## Client

Client bauen

- cd client
- npm install
  (Warnungen beim ersten Aufruf bezüglich node-gyp.js, Python oder C++-Compiler ignorieren)
- tsd install
- bower install
- gulp build (Version dev)
  gulp build --stage prod (Version prod)
  
## Server

Server bauen

- cd server
- npm install
  (Warnungen beim ersten Aufruf bezüglich node-gyp.js, Python oder C++-Compiler ignorieren)
- tsd install
- gulp build
  
Server starten

- node deploy\app\index.js
- http://127.0.0.1:2999/index.html in Browser öffnen

## Paket-Update

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
   
