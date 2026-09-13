param(
    [Parameter(Mandatory=$true, HelpMessage="YouTube URL")]
    [string]$Url,

    [Parameter(HelpMessage="Output format (txt or md)")]
    [ValidateSet("txt", "md")]
    [string]$Format = "txt",

    [Parameter(HelpMessage="Output directory")]
    [string]$OutputDir = (Get-Location).Path
)

# Input validation
if ([string]::IsNullOrWhiteSpace($Url)) {
    Write-Host "ERROR: Please specify a YouTube URL." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $OutputDir)) {
    Write-Host "ERROR: Output directory does not exist: $OutputDir" -ForegroundColor Red
    exit 1
}

# Extract video ID from URL (handle various formats)
$videoId = ""
if ($Url -match "(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})") {
    $videoId = $matches[1]
} elseif ($Url -match "([a-zA-Z0-9_-]{11})") {
    # Fallback: extract 11-char ID
    $videoId = $matches[1]
} else {
    Write-Host "ERROR: Invalid YouTube URL." -ForegroundColor Red
    exit 1
}

Write-Host "Video ID: $videoId" -ForegroundColor Cyan
Write-Host "Output directory: $OutputDir" -ForegroundColor Cyan
Write-Host ""

# Move to working directory
Push-Location $OutputDir

try {
    # Step 1: Download subtitles
    Write-Host "Step 1: Downloading Japanese subtitles..." -ForegroundColor Yellow
    $srtFile = Join-Path $OutputDir "$videoId.ja.srt"
    $vttFile = Join-Path $OutputDir "$videoId.ja.vtt"

    # Delete existing files
    if (Test-Path $srtFile) { Remove-Item $srtFile -Force }
    if (Test-Path $vttFile) { Remove-Item $vttFile -Force }

    # Download subtitles with yt-dlp
    & yt-dlp --write-subs --write-auto-subs --sub-langs ja --skip-download --convert-subs srt "$Url" -o "$videoId" 2>&1 | Out-Null

    if (-not (Test-Path $srtFile)) {
        Write-Host "ERROR: Failed to download subtitles." -ForegroundColor Red
        exit 1
    }

    Write-Host "OK: Subtitles downloaded" -ForegroundColor Green
    Write-Host ""

    # Step 2: Extract text
    Write-Host "Step 2: Extracting text..." -ForegroundColor Yellow

    $content = Get-Content $srtFile -Encoding UTF8
    $textLines = @()

    foreach ($line in $content) {
        $trimmed = $line.Trim()

        # Skip timecode, sequence numbers, and blank lines
        if ($trimmed -like '*-->*' -or $trimmed -match '^\d+$' -or $trimmed -eq '') {
            continue
        }

        $textLines += $trimmed
    }

    # Remove consecutive duplicates
    $unique = @()
    $prevLine = ""
    foreach ($line in $textLines) {
        if ($line -ne $prevLine) {
            $unique += $line
            $prevLine = $line
        }
    }

    Write-Host "OK: Text extracted ($($unique.Count) lines)" -ForegroundColor Green
    Write-Host ""

    # Step 3: Save file
    Write-Host "Step 3: Saving file..." -ForegroundColor Yellow

    $timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
    $outputFile = ""

    if ($Format -eq "md") {
        $outputFile = Join-Path $OutputDir "${videoId}_${timestamp}.md"

        # Save in Markdown format
        $mdContent = @"
# YouTube Transcript

**Video ID**: $videoId
**Timestamp**: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
**URL**: $Url

---

$($unique -join "`n")
"@

        $mdContent | Out-File -FilePath $outputFile -Encoding UTF8 -Force
    } else {
        $outputFile = Join-Path $OutputDir "${videoId}_${timestamp}.txt"

        # Save in plain text format
        $unique -join "`n" | Out-File -FilePath $outputFile -Encoding UTF8 -Force
    }

    Write-Host "OK: File saved" -ForegroundColor Green
    Write-Host ""

    # Display results
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Output file: $(Split-Path $outputFile -Leaf)" -ForegroundColor Cyan
    Write-Host "Full path: $outputFile" -ForegroundColor Cyan
    Write-Host ""

    # Display file size
    $fileSize = (Get-Item $outputFile).Length / 1KB
    Write-Host "File size: $([Math]::Round($fileSize, 2)) KB" -ForegroundColor Cyan

    # Cleanup temporary files
    if (Test-Path $srtFile) { Remove-Item $srtFile -Force }
    if (Test-Path $vttFile) { Remove-Item $vttFile -Force }

} catch {
    Write-Host "ERROR: An error occurred: $_" -ForegroundColor Red
    exit 1
} finally {
    Pop-Location
}
