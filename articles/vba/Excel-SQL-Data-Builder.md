#meta-start
Title:Importing/Exporting SQL data from Prod to Local DB
Created:7-23-2020
Category:vba
#meta-end
# Importing/Exporting SQL data from Prod to Local DB
Once I was working a web application with a MS SQL datastore, this application was a safety-related software that often gets complains from the customers. Never fails, you fix one things and break three others. Our DBAs did a wonderful job in refreshing production data within our development database, but sometimes, I find it easier just to import the data into MS LocalDB to ease troubleshooting,

Here is a VBA script for Excel to copy the selected data from Production database (using a reader account, of course) to MS LocalDB.  
Raw data is exported from database into sheet. One sheet per table.  
Then sql script generated to insert data into MS LocalDB  
Use SQLCMD to execute a batch of sql scripts:

```cmd
echo Starting
"C:\Program Files\Microsoft SQL Server\110\Tools\Binn\SQLCMD.EXE" -S "(localdb)\MSSQLLOCALDB" -d "CONDA" -i "C:\Users\KDJ\Desktop\DataExport\Requests.sql" -o "C:\Users\KDJ\Desktop\DataExport\Requests_log.txt"
"C:\Program Files\Microsoft SQL Server\110\Tools\Binn\SQLCMD.EXE" -S "(localdb)\MSSQLLOCALDB" -d "CONDA" -i "C:\Users\KDJ\Desktop\DataExport\RequestLog.sql" -o "C:\Users\KDJ\Desktop\DataExport\RequestLog_log.txt"
"C:\Program Files\Microsoft SQL Server\110\Tools\Binn\SQLCMD.EXE" -S "(localdb)\MSSQLLOCALDB" -d "CONDA" -i "C:\Users\KDJ\Desktop\DataExport\Items.sql" -o "C:\Users\KDJ\Desktop\DataExport\Items_log.txt"
echo Completed
```

```vb
Public Sub ImportData()

    QueryDB "SELECT TOP 1000 ItemId,SerialNumber,WctNumber,ItemType,ContainerType,Matrix,Origin,ItemNumber,Longitude,Latitude,IsDeleted,ComponentId,RequestId,Length,Diameter,WalkdownDate,WalkdownBy,IsOnHold,Building,Unit,Cell,Stage,Floor,TheSystem,SubSystem,Abbreviation,Description,IsOnHoldNotes,ItemStatus FROM [Items] WHERE ItemId > 68997", "Items"
End Sub

Public Sub CollectData()
Dim Requestnum As String

Requestnum = "NDA1701117"

QueryDB "SELECT * FROM [Requests] WHERE [RequestNumber] = '" & Requestnum & "'", "Requests"

QueryDB "SELECT * FROM [NDA_Master] WHERE [NDA_Request_Num] = '" & Requestnum & "'", "NDA_Master"

    If Not Sheets("Requests").Cells(2, 1).Value = "" Then
        Dim RequestId As Integer
        RequestId = Sheets("Requests").Cells(2, 1).Value
        
        QueryDB "SELECT * FROM [RequestLog] WHERE [RequestId] =" & RequestId, "RequestLog"
        
        QueryDB "SELECT * FROM [Items] WHERE [RequestId] =" & RequestId, "Items"
        
        QueryDB "SELECT * FROM [Jobs] WHERE [RequestId] =" & RequestId, "Jobs"
        
        QueryDB "SELECT * FROM [Turnovers] WHERE [RequestId] =" & RequestId, "Turnovers"
        
        'if have Turnovers,
        If Sheets("Turnovers").Cells(2, 1).Value <> "" Then
            Dim TurnoverIds As String
            Dim SystemIds As String
            Dim StationIds As String
            
            For r = 2 To 100
                If Not Sheets("Turnovers").Cells(r, 1) = "" Then
                    If TurnoverIds <> "" Then TurnoverIds = TurnoverIds & ","
                    TurnoverIds = TurnoverIds & Sheets("Turnovers").Cells(r, 1).Value
                    
                    If InStr(1, SystemIds, Sheets("Turnovers").Cells(r, 10).Value) = 0 Then
                        If SystemIds <> "" Then SystemIds = SystemIds & ","
                        SystemIds = SystemIds & Sheets("Turnovers").Cells(r, 10).Value
                    End If
                    
                    If InStr(1, StationIds, Sheets("Turnovers").Cells(r, 9).Value) = 0 Then
                        If StationIds <> "" Then StationIds = StationIds & ","
                        StationIds = StationIds & Sheets("Turnovers").Cells(r, 9).Value
                    End If
                Else
                    Exit For
                End If
            Next r
            
            QueryDB "SELECT * FROM [JobReplicate] WHERE [TurnoverId] IN (" & TurnoverIds & ")", "JobReplicate"
            
            QueryDB "SELECT * FROM [JobReplicateDetail] WHERE [TurnoverId] IN (" & TurnoverIds & ")", "JobReplicateDetail"
            
            QueryDB "SELECT * FROM [Turnovers_Personnel] WHERE [TurnoverId] IN (" & TurnoverIds & ")", "Turnovers_Personnel"
            
            If Len(SystemIds) > 0 Then
                QueryDB "SELECT * FROM [NDASystems] WHERE [systems_id] IN (" & SystemIds & ")", "NDASystems"
            End If
            
            If Len(StationIds) > 0 Then
                QueryDB "SELECT * FROM [Stations] WHERE [StationId] IN (" & StationIds & ")", "Stations"
            End If
            
            QueryDB "SELECT * FROM [NDAComponents] WHERE [components_systemid] IN (" & SystemIds & ")", "NDAComponents"
        End If

        
        Dim JobIds As String
        For r = 2 To 1000
            If Not Sheets("Jobs").Cells(r, 1) = "" Then
                If JobIds <> "" Then JobIds = JobIds & ","
                JobIds = JobIds & Sheets("Jobs").Cells(r, 1).Value
            Else
                Exit For
            End If
        Next r
        
        QueryDB "SELECT * FROM [Jobs_Personnel] WHERE [JobId] IN (" & JobIds & ")", "Jobs_Personnel"
        
        QueryDB "SELECT * FROM [Batches] WHERE [RequestId] =" & RequestId, "Batches"
        
        'if have Turnovers,
        If Sheets("Batches").Cells(2, 1).Value <> "" Then
            Dim BatchIds As String
            For r = 2 To 1000
                If Not Sheets("Batches").Cells(r, 1) = "" Then
                    If BatchIds <> "" Then BatchIds = BatchIds & ","
                    BatchIds = BatchIds & Sheets("Batches").Cells(r, 1).Value
                Else
                    Exit For
                End If
            Next r
            
            QueryDB "SELECT * FROM [BatchWorkflow] WHERE [BatchId] IN (" & BatchIds & ")", "BatchWorkflow"
        End If
        
        QueryDB "SELECT * FROM [CidmsTickets]", "CidmsTickets"

    End If
End Sub

Private Sub QueryDB(query As String, SheetName As String)
Application.ScreenUpdating = False

    Sheets(SheetName).Select

    'Clear Data
    ActiveCell.SpecialCells(xlLastCell).Select
    Rows("1:" & ActiveCell.row).Select
    Selection.Delete Shift:=xlUp
    Range("A1").Select

    Dim dbResults As ADODB.Recordset
    Set dbname = openDBConn()
    Set dbResults = dbname.Execute(query)
    
    
    'build Header
    For c = 1 To dbResults.Fields.Count
        'Sheets(SheetName).Cells(1, c) = dbResults.Fields.Item(c - 1).Type
        Sheets(SheetName).Cells(1, c) = dbResults.Fields.Item(c - 1).Name
    Next c
    
    Dim r
    r = 1
    'transfer data to spreadsheet
    While Not dbResults.EOF
        r = r + 1
        For c = 0 To dbResults.Fields.Count - 1
            Sheets(SheetName).Cells(r, c + 1) = dbResults(c).Value
        Next c
        
        dbResults.MoveNext
    Wend
    
    dbname.Close
    'dbname = Nothing
    Set dbResults = Nothing
    
    Call InsertBuilder

Application.ScreenUpdating = True
End Sub

Private Sub InsertBuilder()
'MUST Add Reference: Microsoft Scripting Runtime
    Dim fso As New FileSystemObject
    Dim stream As TextStream
    Set stream = fso.CreateTextFile("C:\Users\KDJ\Desktop\DataExport\" & ActiveSheet.Name & ".sql", True, True)
    
    stream.WriteLine "SET IDENTITY_INSERT [dbo].[" & ActiveSheet.Name & "] ON"
    
    Dim InsertHeader As String
    InsertHeader = "INSERT INTO [dbo].[" & ActiveSheet.Name & "] ("
       
    ' Get cell boundaries
    lastrow = ActiveSheet.UsedRange.Rows(ActiveSheet.UsedRange.Rows.Count).row
    LastCol = ActiveSheet.UsedRange.columns(ActiveSheet.UsedRange.columns.Count).Column
    
        'issue with unicode char in teh Item description
    If ActiveSheet.Name = "Items" Then
        Range("AA2:AA" & lastrow).ClearContents
    End If

    Dim col As String
    For c = 1 To LastCol
        If Not Cells(1, c).Value = "" Then
            If col <> "" Then col = col & ","
            col = col & "[" & Cells(1, c).Value & "]"
        End If
    Next c
    InsertHeader = InsertHeader & col & ") VALUES ("
    
    Dim row As String
    For r = 2 To lastrow
        If Not Cells(r, 1).Value = "" Then
            For c = 1 To LastCol
                If row <> "" Then row = row & ","
                
                If Cells(r, c) = "" Then
                    row = row & "NULL"
                ElseIf Cells(r, c) = "False" Then
                    row = row & 0
                ElseIf Cells(r, c) = "True" Then
                    row = row & 1
                ElseIf IsNumeric(Cells(r, c)) Then
                    row = row & Cells(r, c).Value
                Else
                    row = row & "N'" & Replace(Cells(r, c).Value, "'", "''") & "'"
                End If

            Next c
            
            'TODO: replace unicode char
            '90? Elbow
            row = Replace(row, Chr(63), "")
            row = Replace(row, ChrW(8206), "")
            'Debug.Print row
            
            stream.WriteLine InsertHeader & row & ")"
            row = "" 'reset string
        End If
                
    Next r
    
    stream.WriteLine "SET IDENTITY_INSERT [dbo].[" & ActiveSheet.Name & "] OFF"
    
    ' Close the file.
    stream.Close
End Sub

'MUST include highest version of Microsoft ActiveX Data Objects X.X Library
'(Tools->References)
Private Function openDBConn() As ADODB.Connection
    Dim newDBConn As ADODB.Connection
    Set newDBConn = New ADODB.Connection
    newDBConn.CommandTimeout = 60
    Dim strConn As String
    strConn = "PROVIDER=SQLOLEDB;DATA SOURCE=DDSQL06;INITIAL CATALOG=CONDA;User ID=CONDA_Reader;Password=;" 'INTEGRATED SECURITY=SSPI"
    'strConn = "PROVIDER=SQLOLEDB;DATA SOURCE=ddsqltest06;INITIAL CATALOG=CONDA;User ID=CONDA_Owner;Password=;"
    'strConn = "PROVIDER=SQLOLEDB;SERVERe=(localdb)\MSSQLLocalDB;Initial Catalog=CONDA_NEW;INTEGRATED SECURITY=true;Trusted_Connection=true;"
    'strConn = "Provider=SQLNCLI11;Server=(localdb)\MSSQLLocalDB;AttachDBFileName=C:\Users\KDJ\CONDA_NEW.mdf;Database=CONDA_NEW;Trusted_Connection=yes"
    
    newDBConn.Open strConn
    Set openDBConn = newDBConn
End Function

```