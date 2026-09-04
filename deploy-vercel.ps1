param(
  [string]$Mode = "deploy"
)
$node = "C:\Users\21757\.workbuddy\binaries\node\versions\22.22.2\node.exe"
$vc = "C:\Users\21757\.workbuddy\binaries\node\versions\22.22.2\node_modules\vercel\dist\vc.js"

if ($Mode -eq "link") {
  & $node $vc link --yes --project wuyu-web 2>&1 | Out-String | Write-Host
} elseif ($Mode -eq "inspect") {
  & $node $vc ls --yes wuyu-web 2>&1 | Out-String | Write-Host
  & $node $vc inspect wuyu-web.vercel.app --logs 2>&1 | Out-String | Write-Host
} elseif ($Mode -eq "curl") {
  & $node $vc curl https://wuyu-web.vercel.app 2>&1 | Out-String | Write-Host
} else {
  Remove-Item ".\vc-deploy.out", ".\vc-deploy.err" -ErrorAction SilentlyContinue
  $p = Start-Process -FilePath $node -ArgumentList @($vc, "deploy", "--prod", "--yes") -WorkingDirectory (Get-Location) -RedirectStandardOutput ".\vc-deploy.out" -RedirectStandardError ".\vc-deploy.err" -PassThru
  Write-Host "deploy pid=$($p.Id) (waiting up to 10 min)..."
  if ($p.WaitForExit(600000)) {
    Write-Host "exit=$($p.ExitCode)"
  } else {
    Write-Host "still running after 10 min; will report from logs"
  }
  Write-Host "--- stdout tail ---"
  Get-Content ".\vc-deploy.out" -Tail 40 -ErrorAction SilentlyContinue | Out-String | Write-Host
  Write-Host "--- stderr tail ---"
  Get-Content ".\vc-deploy.err" -Tail 20 -ErrorAction SilentlyContinue | Out-String | Write-Host
}
