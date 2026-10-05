param(
    [Parameter(Mandatory=$true, HelpMessage="YouTube URL")]
    [string]$Url,

    [Parameter(HelpMessage="出力形式 (txt or md)")]
    [ValidateSet("txt", "md")]
    [string]$Format = "txt",

    [Parameter(HelpMessage="出力ディレクトリ（デフォルト：カレントディレクトリ）")]
    [string]$OutputDir = (Get-Location).Path
)

# 入力検証
if ([string]::IsNullOrWhiteSpace($Url)) {
    Write-Host "❌ エラー: YouTubeのURLを指定してください。" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $OutputDir)) {
    Write-Host "❌ エラー: 出力ディレクトリが存在しません: $OutputDir" -ForegroundColor Red
    exit 1
}

# 動画IDを抽出
$videoId = ""
if ($Url -match "(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)") {
    $videoId = $matches[1]
} else {
    Write-Host "❌ エラー: YouTubeのURLが正しくありません。" -ForegroundColor Red
    exit 1
}

Write-Host "🎬 動画ID: $videoId" -ForegroundColor Cyan
Write-Host "📁 出力先: $OutputDir" -ForegroundColor Cyan
Write-Host ""

# 作業ディレクトリに移動
Push-Location $OutputDir

try {
    # ステップ1: 字幕を取得
    Write-Host "⏳ ステップ1: 日本語字幕をダウンロード中..." -ForegroundColor Yellow
    $srtFile = Join-Path $OutputDir "$videoId.ja.srt"
    $vttFile = Join-Path $OutputDir "$videoId.ja.vtt"

    # 既存ファイルを削除
    if (Test-Path $srtFile) { Remove-Item $srtFile -Force }
    if (Test-Path $vttFile) { Remove-Item $vttFile -Force }

    # yt-dlpで字幕を取得
    & yt-dlp --write-subs --write-auto-subs --sub-langs ja --skip-download --convert-subs srt "$Url" -o "$videoId" 2>&1 | Out-Null

    if (-not (Test-Path $srtFile)) {
        Write-Host "❌ エラー: 字幕の取得に失敗しました。" -ForegroundColor Red
        exit 1
    }

    Write-Host "✓ 字幕ダウンロード完了" -ForegroundColor Green
    Write-Host ""

    # ステップ2: テキスト抽出
    Write-Host "⏳ ステップ2: テキストを抽出中..." -ForegroundColor Yellow

    $content = Get-Content $srtFile -Encoding UTF8
    $textLines = @()

    foreach ($line in $content) {
        $trimmed = $line.Trim()

        # タイムコード、順番番号、空行をスキップ
        if ($trimmed -like '*-->*' -or $trimmed -match '^\d+$' -or $trimmed -eq '') {
            continue
        }

        $textLines += $trimmed
    }

    # 連続する重複を削除
    $unique = @()
    $prevLine = ""
    foreach ($line in $textLines) {
        if ($line -ne $prevLine) {
            $unique += $line
            $prevLine = $line
        }
    }

    Write-Host "✓ テキスト抽出完了 ($($unique.Count) 行)" -ForegroundColor Green
    Write-Host ""

    # ステップ3: ファイル保存
    Write-Host "⏳ ステップ3: ファイルを保存中..." -ForegroundColor Yellow

    $timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
    $outputFile = ""

    if ($Format -eq "md") {
        $outputFile = Join-Path $OutputDir "${videoId}_${timestamp}.md"

        # Markdown形式で保存
        $mdContent = @"
# YouTube文字起こし

**動画ID**: $videoId
**取得日時**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**URL**: $Url

---

$($unique -join "`n")
"@

        $mdContent | Out-File -FilePath $outputFile -Encoding UTF8 -Force
    } else {
        $outputFile = Join-Path $OutputDir "${videoId}_${timestamp}.txt"

        # テキスト形式で保存
        $unique -join "`n" | Out-File -FilePath $outputFile -Encoding UTF8 -Force
    }

    Write-Host "✓ ファイル保存完了" -ForegroundColor Green
    Write-Host ""

    # 結果表示
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host "✅ 完了しました！" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host ""
    Write-Host "📄 出力ファイル: $(Split-Path $outputFile -Leaf)" -ForegroundColor Cyan
    Write-Host "📁 保存先: $outputFile" -ForegroundColor Cyan
    Write-Host ""

    # ファイルサイズを表示
    $fileSize = (Get-Item $outputFile).Length / 1KB
    Write-Host "📊 ファイルサイズ: $([Math]::Round($fileSize, 2)) KB" -ForegroundColor Cyan

    # 一時ファイルの削除
    if (Test-Path $srtFile) { Remove-Item $srtFile -Force }
    if (Test-Path $vttFile) { Remove-Item $vttFile -Force }

} catch {
    Write-Host "❌ エラーが発生しました: $_" -ForegroundColor Red
    exit 1
} finally {
    Pop-Location
}
