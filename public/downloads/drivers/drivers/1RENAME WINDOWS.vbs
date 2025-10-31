Option Explicit
Title = "rename reg nouti"
Dim Title,strComputer,objWMIService,strNewName,objComputer
Dim Obj,Question,err,strDescription,colComputers,x
'Run as Admin
If Not WScript.Arguments.Named.Exists("elevate") Then
   CreateObject("Shell.Application").ShellExecute DblQuote(WScript.FullName) _
   , DblQuote(WScript.ScriptFullName) & " /elevate", "", "runas", 1
    WScript.Quit
End If
'************************************Main Script****************************************
Call Rename_PC()
'If you want to change the description of the computer, you should uncomment this line :
'Call Changing_Descrption()
Call Ask4Reboot()
'*********************************Changing PC Name *************************************
Sub Rename_PC()
strComputer = "." 
Set objWMIService = GetObject("winmgmts:" _ 
    & "{impersonationLevel=impersonate}!\\" & strComputer & "\root\cimv2")
strNewName = Inputbox ("vvedi novoe imnya pc, padla: ",Title,"REG-NB0**")
If strNewName = "" Then Wscript.Quit()
Set colComputers = objWMIService.ExecQuery ("Select * from Win32_ComputerSystem")
For Each objComputer in colComputers
    err = objComputer.Rename(strNewName)
Next
End Sub
'*************************** Changing the description **********************************
Sub Changing_Descrption()
strDescription = Inputbox("Enter Description : ",Title,"Machine blalllaaaaaaa")
If strDescription = "" Then Wscript.Quit()
Set Obj= GetObject("winmgmts:\\" & strComputer).InstancesOf("Win32_OperatingSystem")
For Each x In Obj 
   x.Description = strDescription
   x.Put_
Next
End Sub
'***************************************************************************************
Sub Ask4Reboot()
Question = MsgBox("imya nouta budet izmeneno na  " & DblQuote(strNewName) & " posle restarta pc" & vbCrLf &_
"da i budet restart" & vbCrLF &_
"net i restarta ne budet" &vbtab& "",VbYesNo+VbQuestion,Title)
If Question = VbYes then 
    Reboot()
Else
    wscript.Quit(1)
End If
End Sub
'**************************************
Function DblQuote(Str)
    DblQuote = chr(34) & Str & chr(34)
End function
'**************************************
Sub Reboot()
Dim ws,Command,Result
Set ws = CreateObject("Wscript.Shell")
Command = "Shutdown.exe /r /t 1 /c "& DblQuote("Save your documents - PC restarts in 1 second")
Result = ws.run(Command,0,True)
End Sub
'**************************************