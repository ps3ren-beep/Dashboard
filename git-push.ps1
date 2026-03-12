# Script para fazer push do projeto para GitHub
# Execute apos instalar o Git: https://git-scm.com/download/win
# Repositorio: https://github.com/ps3ren-beep/Dashboard

$ErrorActionPreference = "Stop"

Write-Host "Inicializando Git e preparando commit..." -ForegroundColor Cyan

git init
git add .
git status
git commit -m "feat: estrutura base do projeto mycash+ (PROMPT 1)"

git branch -M main
git remote remove origin 2>$null
git remote add origin https://github.com/ps3ren-beep/Dashboard.git

Write-Host ""
Write-Host "Commit criado. Para fazer push, execute:" -ForegroundColor Yellow
Write-Host "  git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "Se pedir autenticacao, use seu usuario GitHub e o token como senha." -ForegroundColor Gray
