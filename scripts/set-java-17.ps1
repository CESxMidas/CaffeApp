# Pin JDK 17 for CaffeApp Android builds (Expo SDK 54)
. "$PSScriptRoot\jdk17-utils.ps1"

$jdk17 = Find-Jdk17Home
if (-not $jdk17) {
    Write-Jdk17InstallHint
    exit 1
}

$env:JAVA_HOME = $jdk17
$bin = Join-Path $jdk17 "bin"
$env:Path = "$bin;" + (($env:Path -split ';' | Where-Object { $_ -and $_ -ne $bin }) -join ';')

Write-Host "JAVA_HOME=$env:JAVA_HOME"
& (Join-Path $bin "java.exe") -version
