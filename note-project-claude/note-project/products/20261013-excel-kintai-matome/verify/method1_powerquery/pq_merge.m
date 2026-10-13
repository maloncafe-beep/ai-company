let
    Source = Folder.Files("__FOLDER__"),
    Target = Table.SelectRows(Source, each [Extension] = ".xlsx" and not Text.StartsWith([Name], "~$")),
    Pick = Table.AddColumn(Target, "Data", each
        let
            sheets = Excel.Workbook([Content], true, true),
            hit = Table.SelectRows(sheets, (r) => r[Kind] = "Sheet" and Text.Trim(r[Name]) = "集計")
        in
            if Table.RowCount(hit) = 0 then null else hit{0}[Data]),
    Keep = Table.SelectRows(Pick, each [Data] <> null),
    Slim = Table.SelectColumns(Keep, {"Name", "Data"}),
    AllColumns = List.Union(List.Transform(Slim[Data], each Table.ColumnNames(_))),
    Expanded = Table.ExpandTableColumn(Slim, "Data", AllColumns),
    Renamed = Table.RenameColumns(Expanded, {{"Name", "元ファイル"}})
in
    Renamed
