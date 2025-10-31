powershell.exe -Command "Set-SmbServerConfiguration -EnableSMB1Protocol $true -Force"
powershell.exe -Command "Enable-WindowsOptionalFeature -Online -FeatureName smb1protocol"
powershell.exe -Command "Enable-WindowsOptionalFeature -Online -FeatureName SMB1Protocol-Server"
powershell.exe -Command "Enable-WindowsOptionalFeature -Online -FeatureName SMB1Protocol-Client"
powershell.exe -Command "Set-SmbServerConfiguration -EnableSMB2Protocol $true -Force"
powershell.exe -Command "Set-SmbClientConfiguration -EnableBandwidthThrottling 0 -EnableLargeMtu 1"
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\LanmanWorkstation" /v "AllowInsecureGuestAuth" /t REG_DWORD /d "0x1" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Component Based Servicing\Notifications\OptionalFeatures\SMB1Protocol" /v "Selection" /t REG_DWORD /d "0x1" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Component Based Servicing\Notifications\OptionalFeatures\SMB1Protocol-Client" /v "Selection" /t REG_DWORD /d "0x1" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Component Based Servicing\Notifications\OptionalFeatures\SMB1Protocol-Server" /v "Selection" /t REG_DWORD /d "0x1" /f
netsh advfirewall firewall set rule group="Network Discovery" new enable=Yes
netsh advfirewall firewall set rule group="File and Printer Sharing" new enable=Yes
netsh firewall set service type=fileandprint mode=enable profile=all
dism /online /norestart /enable-feature /featurename:SMB1Protocol
reg add HKLM\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters /v AllowInsecureGuestAuth /t reg_dword /d 00000001 /f
Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\LanmanWorkstation" /v "AllowInsecureGuestAuth" /t REG_DWORD /d "0x1" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Browser\Parameters" /v IsDomainMaster /t REG_SZ  /d True /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Browser\Parameters" /v MaintainServerList /t REG_SZ  /d Yes /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Component Based Servicing\Notifications\OptionalFeatures\SMB1Protocol" /v "Selection" /t REG_DWORD /d "0x1" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Component Based Servicing\Notifications\OptionalFeatures\SMB1Protocol-Client" /v "Selection" /t REG_DWORD /d "0x1" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Component Based Servicing\Notifications\OptionalFeatures\SMB1Protocol-Server" /v "Selection" /t REG_DWORD /d "0x1" /f
reg.exe add "HKLM\SYSTEM\CurrentControlSet\services\LanmanServer\Parameters" /v "SMB2" /t REG_DWORD /d "0" /f
sc.exe config lanmanworkstation depend= bowser/mrxsmb10/nsi
sc.exe config mrxsmb20 start= disabled
@echo Checking SMBv1/v2 is enabled
sc.exe qc lanmanworkstation
pause

