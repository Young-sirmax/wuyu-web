$env:Path = 'C:\Users\21757\.workbuddy\binaries\node\versions\22.22.2;' + $env:Path
$env:CODBUDDY_SAFE_DELETE_ENABLED = '0'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root
Remove-Item deploy.log -ErrorAction SilentlyContinue
vercel deploy --prebuilt --temporary --yes *> deploy.log
Write-Output "exitcode: $LASTEXITCODE" | Out-File -Append deploy.log
