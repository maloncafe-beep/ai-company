$ErrorActionPreference = 'Stop'
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$src = Join-Path $dir 'src_copy.xlsx'
Copy-Item (Get-ChildItem $dir -Filter '*2026-09.xlsx' | Select-Object -First 1).FullName $src -Force
$xl = New-Object -ComObject Excel.Application
$xl.Visible = $false
$xl.DisplayAlerts = $false
try {
    $wb = $xl.Workbooks.Open($src)
    $ws = $wb.Worksheets.Item(1)
    $last = $ws.Cells.Item($ws.Rows.Count, 1).End(-4162).Row
    $rng = $ws.Range($ws.Cells.Item(1, 1), $ws.Cells.Item($last, 5))
    $cache = $wb.PivotCaches().Create(1, $rng)
    $pvSheet = $wb.Worksheets.Add()
    $pt = $cache.CreatePivotTable($pvSheet.Range('A5'), 'pt1')
    $keyName = [string]$ws.Cells.Item(1, 2).Value2
    $amtName = [string]$ws.Cells.Item(1, 5).Value2
    $pt.PivotFields($keyName).Orientation = 3
    $df = $pt.AddDataField($pt.PivotFields($amtName), 'sum', -4157)
    $before = $wb.Worksheets.Count
    $pt.ShowPages($keyName)
    $after = $wb.Worksheets.Count
    "sheets before=$before after=$after"
    foreach ($s in $wb.Worksheets) { $s.Name }
    $wb.Close($false)
} catch {
    'ERROR: ' + $_.Exception.Message
} finally {
    $xl.Quit()
    [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($xl)
}
