Option Explicit

' 勤務簿フォルダ内の各ブックから「集計」シートを取り込み、「集計まとめ」に縦に並べる
Public Sub ImportKintai()
    Const SHEET_NAME As String = "集計"
    Dim folderPath As String
    Dim fName As String
    Dim wsOut As Worksheet, wsLog As Worksheet
    Dim wb As Workbook, ws As Worksheet, target As Worksheet
    Dim outRow As Long, logRow As Long
    Dim okCnt As Long, ngCnt As Long
    Dim lastRow As Long, colCnt As Long
    Dim headerDone As Boolean

    folderPath = ThisWorkbook.Path & "\kintai\"   ' 取り込み元フォルダ（ここを変更）
    If Dir(folderPath, vbDirectory) = "" Then
        MsgBox "フォルダが見つかりません: " & folderPath, vbExclamation
        Exit Sub
    End If

    Set wsOut = GetSheet("集計まとめ")
    Set wsLog = GetSheet("取込ログ")
    wsOut.Cells.Clear
    wsLog.Cells.Clear
    wsLog.Range("A1:C1").Value = Array("ファイル", "結果", "メモ")
    logRow = 2
    outRow = 1

    Application.ScreenUpdating = False
    Application.DisplayAlerts = False

    fName = Dir(folderPath & "*.xlsx")
    Do While fName <> ""
        If Left$(fName, 2) = "~$" Then
            WriteLog wsLog, logRow, fName, "対象外", "Excelの一時ファイル"
        Else
            Set wb = Nothing
            On Error Resume Next
            Set wb = Workbooks.Open(folderPath & fName, ReadOnly:=True, UpdateLinks:=0)
            If Err.Number <> 0 Then
                WriteLog wsLog, logRow, fName, "失敗", "開けません: " & Err.Description
                ngCnt = ngCnt + 1
                Err.Clear
            End If
            On Error GoTo 0

            If Not wb Is Nothing Then
                Set target = Nothing
                For Each ws In wb.Worksheets
                    If Trim$(ws.Name) = SHEET_NAME Then
                        Set target = ws
                        Exit For
                    End If
                Next ws

                If target Is Nothing Then
                    WriteLog wsLog, logRow, fName, "失敗", "「" & SHEET_NAME & "」シートが見つかりません"
                    ngCnt = ngCnt + 1
                Else
                    lastRow = target.Cells(target.Rows.Count, 1).End(xlUp).Row
                    colCnt = target.Cells(1, target.Columns.Count).End(xlToLeft).Column
                    If lastRow < 2 Then
                        WriteLog wsLog, logRow, fName, "失敗", "データ行がありません"
                        ngCnt = ngCnt + 1
                    Else
                        If Not headerDone Then
                            outRow = outRow + 1
                            wsOut.Cells(1, 1).Value = "元ファイル"
                            wsOut.Cells(1, 2).Resize(1, colCnt).Value = target.Cells(1, 1).Resize(1, colCnt).Value
                            headerDone = True
                        End If
                        Dim n As Long
                        n = lastRow - 1
                        wsOut.Cells(outRow, 1).Resize(n, 1).Value = fName
                        wsOut.Cells(outRow, 2).Resize(n, colCnt).Value = target.Cells(2, 1).Resize(n, colCnt).Value
                        outRow = outRow + n
                        WriteLog wsLog, logRow, fName, "成功", n & "行を取り込み" & IIf(target.Name <> SHEET_NAME, "（シート名の空白を補正）", "")
                        okCnt = okCnt + 1
                    End If
                End If
                wb.Close SaveChanges:=False
            End If
        End If
        fName = Dir()
    Loop

    Application.DisplayAlerts = True
    Application.ScreenUpdating = True
    MsgBox "成功 " & okCnt & " / 失敗 " & ngCnt & "（詳細は「取込ログ」シート）", vbInformation
End Sub

Private Sub WriteLog(ByVal ws As Worksheet, ByRef r As Long, ByVal f As String, ByVal res As String, ByVal memo As String)
    ws.Cells(r, 1).Value = f
    ws.Cells(r, 2).Value = res
    ws.Cells(r, 3).Value = memo
    r = r + 1
End Sub

Private Function GetSheet(ByVal nm As String) As Worksheet
    Dim s As Worksheet
    For Each s In ThisWorkbook.Worksheets
        If s.Name = nm Then
            Set GetSheet = s
            Exit Function
        End If
    Next s
    Set GetSheet = ThisWorkbook.Worksheets.Add(After:=ThisWorkbook.Worksheets(ThisWorkbook.Worksheets.Count))
    GetSheet.Name = nm
End Function
