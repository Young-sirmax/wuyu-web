$env:Path = 'C:\Users\21757\.workbuddy\binaries\node\versions\22.22.2;' + $env:Path
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root
Remove-Item server.log,server.err.log -ErrorAction SilentlyContinue
$p = Start-Process -FilePath 'C:\Users\21757\.workbuddy\binaries\node\versions\22.22.2\node.exe' -ArgumentList @('node_modules/next/dist/bin/next','start','-p','3000') -WorkingDirectory $root -RedirectStandardOutput "$root\server.log" -RedirectStandardError "$root\server.err.log" -WindowStyle Hidden -PassThru
Write-Output "pid: $($p.Id)"
Start-Sleep -Seconds 14
Write-Output '--- server.log ---'
Get-Content "$root\server.log" -Tail 15 -ErrorAction SilentlyContinue
Write-Output '--- server.err.log ---'
Get-Content "$root\server.err.log" -Tail 10 -ErrorAction SilentlyContinue
