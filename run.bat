@echo off
setlocal

echo init node
call "C:\Program Files\nodejs\nodevars.bat"

echo build client
cd /D "%~dp0\client"
call npm install
call tsd install
call bower install
call gulp build

echo build server
cd /D "%~dp0\server"
call npm install
call tsd install
call gulp build

echo start server and open browser
start node deploy\app\index.js
start http://127.0.0.1:2999/index.html

endlocal
pause
