get-printer|ft Name,ShareName,Shared 
Set-Printer -Name "ZDesigner GK420t" -Shared $True -ShareName "ZDesigner GK420t (����� 1)" 

Set-Printer -Name "ZDesigner GK420t" -Shared $False -ShareName "ZDesigner GK420t" 
