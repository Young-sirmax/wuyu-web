$env:Path = 'C:\Users\21757\.workbuddy\binaries\node\versions\22.22.2;' + $env:Path
$env:CODBUDDY_SAFE_DELETE_ENABLED = '0'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root
Remove-Item .next -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item build.log -ErrorAction SilentlyContinue
npm run build *> build.log
Write-Output "exitcode: $LASTEXITCODE" | Out-File -Append build.log
