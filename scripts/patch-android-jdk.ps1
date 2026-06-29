# Ghi JDK 17 vao android/gradle.properties sau expo prebuild
. "$PSScriptRoot\jdk17-utils.ps1"

$gradleProps = Join-Path $PSScriptRoot "..\apps\mobile\android\gradle.properties"

if (-not (Test-Path $gradleProps)) {
    Write-Error "Chua co android/ - chay: cd apps/mobile; npx expo prebuild --platform android"
    exit 1
}

$jdk17 = Find-Jdk17Home
if (-not $jdk17) {
    Write-Jdk17InstallHint
    exit 1
}

$jdkLine = "org.gradle.java.home=$(Format-GradleJavaHome $jdk17)"
$lines = @(Get-Content $gradleProps | Where-Object {
    $_ -notmatch '^org\.gradle\.java\.home=' -and
    $_ -notmatch '^# Expo SDK.*JDK 17'
})

$insertAt = 0
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '^# Project-wide Gradle settings') {
        $insertAt = $i
        break
    }
}

$jdkBlock = @(
    "# Expo SDK 54 - JDK 17 (https://docs.expo.dev/get-started/set-up-your-environment/)",
    $jdkLine,
    ""
)

if ($insertAt -gt 0) {
    $newLines = $lines[0..($insertAt - 1)] + $jdkBlock + $lines[$insertAt..($lines.Count - 1)]
} else {
    $newLines = $jdkBlock + $lines
}

$content = ($newLines -join "`n").TrimEnd()
Set-Content -Path $gradleProps -Value $content -NoNewline
Write-Host "Updated $gradleProps"
Write-Host $jdkLine
