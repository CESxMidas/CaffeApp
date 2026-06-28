# Ghi JDK 17 vào android/gradle.properties sau expo prebuild
$gradleProps = Join-Path $PSScriptRoot "..\apps\mobile\android\gradle.properties"
$jdkLine = "org.gradle.java.home=C\:\\Program Files\\Microsoft\\jdk-17.0.19.10-hotspot"
$marker = "org.gradle.java.home="

if (-not (Test-Path $gradleProps)) {
  Write-Error "Chưa có android/ — chạy: cd apps/mobile; npx expo prebuild --platform android"
  exit 1
}

$content = Get-Content $gradleProps -Raw
if ($content -match [regex]::Escape($marker)) {
  $content = $content -replace "$marker.*", $jdkLine
} else {
  $header = @"
# Expo SDK 56 — JDK 17 (https://docs.expo.dev/get-started/set-up-your-environment/)
$jdkLine

"@
  $content = $header + $content
}
Set-Content -Path $gradleProps -Value $content.TrimEnd() -NoNewline
Write-Host "Updated $gradleProps"
