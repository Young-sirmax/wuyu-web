$env:Path = 'C:\Users\21757\.workbuddy\binaries\node\versions\22.22.2;' + $env:Path
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root
Remove-Item tunnel.log -ErrorAction SilentlyContinue
cloudflared tunnel --url http://localhost:3000 *> tunnel.log
Write-Output "exitcode: $LASTEXITCODE" | Out-File -Append tunnel.log
