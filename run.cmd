@echo off
call "C:\Program Files\nodejs\nodevars.bat"
cd /D "%~dp0\server"
call npm install
call tsd install
call gulp
start node index.js
start http://127.0.0.1:2999/
