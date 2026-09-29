@echo off
chcp 65001 >nul
echo ========================================
echo FOODLINK - Instalación Inicial
echo ========================================
echo.
echo Instalando dependencias...
call npm install
echo.
echo Construyendo aplicación para producción...
call npm run build
echo.
echo ========================================
echo Instalación completada. 
echo.
echo Para ejecutar la app en el futuro, ejecuta: RUN_APP.bat
echo ========================================
pause
