# Pin JDK 17 for CaffeApp Android builds (Expo SDK 56)
$jdk17 = "C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot"
if (-not (Test-Path $jdk17)) {
  Write-Error "JDK 17 not found at $jdk17. Install: winget install Microsoft.OpenJDK.17"
  exit 1
}
$env:JAVA_HOME = $jdk17
$env:Path = "$jdk17\bin;" + ($env:Path -replace [regex]::Escape("$jdk17\bin;"), '')
Write-Host "JAVA_HOME=$env:JAVA_HOME"
java -version
