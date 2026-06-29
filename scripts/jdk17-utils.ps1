# Shared JDK 17 discovery for CaffeApp Android scripts (Temurin, Microsoft OpenJDK, etc.)

function Test-Jdk17Home {
    param([string]$JdkHome)
    $java = Join-Path $JdkHome "bin\java.exe"
    if (-not (Test-Path $java)) { return $false }
    $version = & $java -version 2>&1 | Out-String
    return $version -match 'version "17[\.\d+]*"'
}

function Find-Jdk17Home {
    if ($env:JAVA_HOME -and (Test-Jdk17Home $env:JAVA_HOME)) {
        return $env:JAVA_HOME
    }

    $searchRoots = @(
        "${env:ProgramFiles}\Eclipse Adoptium",
        "${env:ProgramFiles}\Microsoft",
        "${env:ProgramFiles}\Java",
        "${env:ProgramFiles(x86)}\Eclipse Adoptium",
        "${env:ProgramFiles(x86)}\Microsoft",
        "${env:ProgramFiles(x86)}\Java"
    )

    $candidates = foreach ($root in $searchRoots) {
        if (-not (Test-Path $root)) { continue }
        Get-ChildItem -Path $root -Directory -ErrorAction SilentlyContinue |
            Where-Object { $_.Name -match '^jdk-17' } |
            ForEach-Object { $_.FullName }
    }

    return ($candidates | Sort-Object -Descending | Where-Object { Test-Jdk17Home $_ } | Select-Object -First 1)
}

function Format-GradleJavaHome {
    param([string]$JdkHome)
    $normalized = $JdkHome.TrimEnd('\')
    if ($normalized -match '^([A-Za-z]):(.*)$') {
        $tail = [regex]::Replace($Matches[2], '\\', '\\')
        return "$($Matches[1])\:$tail"
    }
    throw "Invalid JDK path: $JdkHome"
}

function Write-Jdk17InstallHint {
    Write-Error @"
JDK 17 not found. Install one of:
  winget install EclipseAdoptium.Temurin.17.JDK
  winget install Microsoft.OpenJDK.17
Then open a new terminal and run this script again.
"@
}
