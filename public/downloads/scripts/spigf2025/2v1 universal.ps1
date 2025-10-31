<#
============================================
УНИВЕРСАЛЬНЫЙ СКРИПТ НАСТРОЙКИ СЕТЕВОГО ДОСТУПА
И ИСПРАВЛЕНИЯ ОШИБКИ ПРИНТЕРА 0x0000011b
============================================
Автоматически определяет сервер/клиент и применяет нужные настройки
#>

# Проверка прав администратора
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "ОШИБКА: Запустите от имени Администратора!" -ForegroundColor Red
    pause
    exit
}

Clear-Host

# ============================================
# КОНФИГУРАЦИЯ
# ============================================

$ServerIP = "10.17.60.10"
$ClientIP = "10.17.60.14"
$CurrentIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "10.17.60.*"}).IPAddress

# ============================================
# ОПРЕДЕЛЕНИЕ РОЛИ КОМПЬЮТЕРА
# ============================================

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   УНИВЕРСАЛЬНАЯ НАСТРОЙКА СЕТЕВОГО ДОСТУПА И ПРИНТЕРОВ   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "Текущий IP: " -NoNewline -ForegroundColor White
Write-Host "$CurrentIP" -ForegroundColor Yellow
Write-Host ""

$Role = $null

if ($CurrentIP -eq $ServerIP) {
    $Role = "Server"
    Write-Host "Определена роль: " -NoNewline -ForegroundColor White
    Write-Host "СЕРВЕР" -ForegroundColor Green
} elseif ($CurrentIP -eq $ClientIP) {
    $Role = "Client"
    Write-Host "Определена роль: " -NoNewline -ForegroundColor White
    Write-Host "КЛИЕНТ" -ForegroundColor Green
} else {
    Write-Host "Не удалось определить роль автоматически" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Выберите роль компьютера:" -ForegroundColor Cyan
    Write-Host "  1 - Сервер (к которому подключаются)" -ForegroundColor White
    Write-Host "  2 - Клиент (который подключается к серверу)" -ForegroundColor White
    Write-Host ""
    $choice = Read-Host "Ваш выбор (1/2)"
    
    if ($choice -eq "1") {
        $Role = "Server"
    } else {
        $Role = "Client"
    }
}

Write-Host ""
Start-Sleep -Seconds 1

# ============================================
# ФУНКЦИЯ: ИСПРАВЛЕНИЕ ОШИБКИ 0x0000011b
# ============================================

function Fix-PrinterError0x0000011b {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
    Write-Host "║       ИСПРАВЛЕНИЕ ОШИБКИ ПРИНТЕРА 0x0000011b             ║" -ForegroundColor Yellow
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Yellow
    Write-Host ""
    
    try {
        $regPath = "HKLM:\System\CurrentControlSet\Control\Print"
        
        # Создаем ключ если не существует
        if (-not (Test-Path $regPath)) {
            New-Item -Path $regPath -Force | Out-Null
        }
        
        # Отключаем RpcAuthnLevelPrivacyEnabled (это исправляет 0x0000011b)
        Set-ItemProperty -Path $regPath -Name "RpcAuthnLevelPrivacyEnabled" -Value 0 -Type DWord -Force
        Write-Host "  ✓ Ошибка 0x0000011b исправлена!" -ForegroundColor Green
        Write-Host "  ℹ Установлен параметр: RpcAuthnLevelPrivacyEnabled = 0" -ForegroundColor Gray
        
        # Дополнительные параметры для совместимости
        Set-ItemProperty -Path $regPath -Name "RpcProtocols" -Value 7 -Type DWord -Force -ErrorAction SilentlyContinue
        
        return $true
        
    } catch {
        Write-Host "  ✗ Ошибка при исправлении: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# ============================================
# ФУНКЦИЯ: НАСТРОЙКА СЕРВЕРА
# ============================================

function Configure-Server {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║              НАСТРОЙКА СЕРВЕРА                            ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    
    # ШАГ 1: Исправление ошибки принтера
    Fix-PrinterError0x0000011b
    
    # ШАГ 2: Включение гостевой учетной записи
    Write-Host ""
    Write-Host "ШАГ 1: Включение гостевой учетной записи..." -ForegroundColor Cyan
    try {
        net user Guest /active:yes 2>&1 | Out-Null
        net user Гость /active:yes 2>&1 | Out-Null
        Write-Host "  ✓ Гостевая учетная запись включена" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠ $($_.Exception.Message)" -ForegroundColor Yellow
    }
    
    # ШАГ 3: Отключение парольной защиты
    Write-Host ""
    Write-Host "ШАГ 2: Отключение парольной защиты..." -ForegroundColor Cyan
    try {
        $regPath = "HKLM:\SYSTEM\CurrentControlSet\Control\Lsa"
        Set-ItemProperty -Path $regPath -Name "EveryoneIncludesAnonymous" -Value 1 -Type DWord -Force
        Set-ItemProperty -Path $regPath -Name "RestrictAnonymous" -Value 0 -Type DWord -Force
        Set-ItemProperty -Path $regPath -Name "RestrictAnonymousSAM" -Value 0 -Type DWord -Force
        Set-ItemProperty -Path $regPath -Name "LimitBlankPasswordUse" -Value 0 -Type DWord -Force
        Write-Host "  ✓ Анонимный доступ разрешен" -ForegroundColor Green
    } catch {
        Write-Host "  ✗ $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # ШАГ 4: Настройка SMB
    Write-Host ""
    Write-Host "ШАГ 3: Настройка SMB сервера..." -ForegroundColor Cyan
    try {
        Set-SmbServerConfiguration -EncryptData $false -Force -WarningAction SilentlyContinue
        Set-SmbServerConfiguration -RejectUnencryptedAccess $false -Force -WarningAction SilentlyContinue
        Set-SmbServerConfiguration -RequireSecuritySignature $false -Force -WarningAction SilentlyContinue
        Set-SmbServerConfiguration -EnableSecuritySignature $false -Force -WarningAction SilentlyContinue
        Set-SmbServerConfiguration -EnableSMB1Protocol $false -Force -WarningAction SilentlyContinue
        Set-SmbServerConfiguration -EnableSMB2Protocol $true -Force -WarningAction SilentlyContinue
        Write-Host "  ✓ SMB настроен" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠ $($_.Exception.Message)" -ForegroundColor Yellow
    }
    
    # ШАГ 5: Настройка политик
    Write-Host ""
    Write-Host "ШАГ 4: Настройка политик безопасности..." -ForegroundColor Cyan
    try {
        $regPath = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System"
        Set-ItemProperty -Path $regPath -Name "LocalAccountTokenFilterPolicy" -Value 1 -Type DWord -Force
        
        $regPath2 = "HKLM:\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters"
        Set-ItemProperty -Path $regPath2 -Name "AutoShareWks" -Value 1 -Type DWord -Force -ErrorAction SilentlyContinue
        Set-ItemProperty -Path $regPath2 -Name "AutoShareServer" -Value 1 -Type DWord -Force -ErrorAction SilentlyContinue
        Set-ItemProperty -Path $regPath2 -Name "RequireSecuritySignature" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
        Set-ItemProperty -Path $regPath2 -Name "EnableSecuritySignature" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
        
        $regPath3 = "HKLM:\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters"
        Set-ItemProperty -Path $regPath3 -Name "AllowInsecureGuestAuth" -Value 1 -Type DWord -Force
        
        Write-Host "  ✓ Политики настроены" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠ $($_.Exception.Message)" -ForegroundColor Yellow
    }
    
    # ШАГ 6: Создание тестовой папки
    Write-Host ""
    Write-Host "ШАГ 5: Создание тестовой сетевой папки..." -ForegroundColor Cyan
    try {
        $testFolder = "C:\ShareTest"
        
        if (-not (Test-Path $testFolder)) {
            New-Item -Path $testFolder -ItemType Directory -Force | Out-Null
        }
        
        "Сетевой доступ работает! $(Get-Date)" | Out-File -FilePath "$testFolder\test.txt" -Encoding UTF8 -Force
        
        Get-SmbShare -Name "ShareTest" -ErrorAction SilentlyContinue | Remove-SmbShare -Force -ErrorAction SilentlyContinue
        
        New-SmbShare -Name "ShareTest" -Path $testFolder -FullAccess "Everyone","Все" -ErrorAction Stop | Out-Null
        
        $acl = Get-Acl $testFolder
        $permission = "Everyone","FullControl","ContainerInherit,ObjectInherit","None","Allow"
        $accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule $permission
        $acl.SetAccessRule($accessRule)
        Set-Acl -Path $testFolder -AclObject $acl
        
        Write-Host "  ✓ Тестовая папка: \\$env:COMPUTERNAME\ShareTest" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠ $($_.Exception.Message)" -ForegroundColor Yellow
    }
    
    # ШАГ 7: Настройка принтеров
    Write-Host ""
    Write-Host "ШАГ 6: Настройка общего доступа к принтерам..." -ForegroundColor Cyan
    try {
        $printers = Get-Printer | Where-Object {$_.Type -eq "Local"}
        
        if ($printers) {
            Write-Host "  Найдено локальных принтеров: $($printers.Count)" -ForegroundColor White
            
            foreach ($printer in $printers) {
                Write-Host ""
                Write-Host "  Принтер: " -NoNewline -ForegroundColor White
                Write-Host "$($printer.Name)" -ForegroundColor Yellow
                Write-Host "  Расшарить? (y/n): " -NoNewline -ForegroundColor Cyan
                $share = Read-Host
                
                if ($share -eq "y") {
                    $shareName = Read-Host "  Имя для общего доступа (например HP2015)"
                    
                    try {
                        Set-Printer -Name $printer.Name -Shared $true -ShareName $shareName -ErrorAction Stop
                        Write-Host "  ✓ Принтер расшарен как: \\$env:COMPUTERNAME\$shareName" -ForegroundColor Green
                    } catch {
                        Write-Host "  ✗ Ошибка: $($_.Exception.Message)" -ForegroundColor Red
                    }
                }
            }
        } else {
            Write-Host "  ℹ Локальные принтеры не найдены" -ForegroundColor Gray
        }
    } catch {
        Write-Host "  ⚠ $($_.Exception.Message)" -ForegroundColor Yellow
    }
    
    # ШАГ 8: Настройка файрвола
    Write-Host ""
    Write-Host "ШАГ 7: Настройка брандмауэра..." -ForegroundColor Cyan
    try {
        Get-NetFirewallRule -DisplayGroup "Общий доступ к файлам и принтерам" -ErrorAction SilentlyContinue | Set-NetFirewallRule -Enabled True -Profile Any
        Get-NetFirewallRule -DisplayGroup "File and Printer Sharing" -ErrorAction SilentlyContinue | Set-NetFirewallRule -Enabled True -Profile Any
        
        $ruleName = "Allow Client $ClientIP"
        Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue | Remove-NetFirewallRule
        New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -Protocol Any -RemoteAddress $ClientIP -Action Allow -Profile Any -ErrorAction SilentlyContinue | Out-Null
        
        Write-Host "  ✓ Брандмауэр настроен" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠ $($_.Exception.Message)" -ForegroundColor Yellow
    }
    
    # ШАГ 9: Перезапуск служб
    Write-Host ""
    Write-Host "ШАГ 8: Перезапуск служб..." -ForegroundColor Cyan
    try {
        Restart-Service -Name LanmanServer -Force
        Restart-Service -Name LanmanWorkstation -Force
        Restart-Service -Name Spooler -Force
        Write-Host "  ✓ Службы перезапущены" -ForegroundColor Green
        Start-Sleep -Seconds 2
    } catch {
        Write-Host "  ⚠ $($_.Exception.Message)" -ForegroundColor Yellow
    }
    
    # ИТОГИ
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║               СЕРВЕР НАСТРОЕН!                            ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "ДОСТУПНЫЕ РЕСУРСЫ:" -ForegroundColor Cyan
    Write-Host ""
    
    $shares = Get-SmbShare | Where-Object {$_.Name -notlike "*$"}
    if ($shares) {
        $shares | Format-Table Name, Path -AutoSize
    }
    
    Write-Host "РАСШАРЕННЫЕ ПРИНТЕРЫ:" -ForegroundColor Cyan
    $sharedPrinters = Get-Printer | Where-Object {$_.Shared -eq $true}
    if ($sharedPrinters) {
        $sharedPrinters | Format-Table Name, ShareName -AutoSize
    } else {
        Write-Host "  Нет расшаренных принтеров" -ForegroundColor Gray
    }
}

# ============================================
# ФУНКЦИЯ: НАСТРОЙКА КЛИЕНТА
# ============================================

function Configure-Client {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║              НАСТРОЙКА КЛИЕНТА                            ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    
    # ШАГ 1: Исправление ошибки принтера
    Fix-PrinterError0x0000011b
    
    # ШАГ 2: Проверка связи
    Write-Host ""
    Write-Host "ШАГ 1: Проверка связи с сервером $ServerIP..." -ForegroundColor Cyan
    $pingResult = Test-Connection -ComputerName $ServerIP -Count 4 -ErrorAction SilentlyContinue
    
    if ($pingResult) {
        $avgTime = ($pingResult | Measure-Object -Property ResponseTime -Average).Average
        Write-Host "  ✓ Сервер доступен! Пинг: $([math]::Round($avgTime, 2)) мс" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Сервер недоступен!" -ForegroundColor Red
        Write-Host "  Сначала настройте сервер!" -ForegroundColor Yellow
    }
    
    # ШАГ 3: Разрешение гостевого доступа
    Write-Host ""
    Write-Host "ШАГ 2: Разрешение гостевого доступа..." -ForegroundColor Cyan
    try {
        $regPath = "HKLM:\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters"
        if (-not (Test-Path $regPath)) {
            New-Item -Path $regPath -Force | Out-Null
        }
        Set-ItemProperty -Path $regPath -Name "AllowInsecureGuestAuth" -Value 1 -Type DWord -Force
        Write-Host "  ✓ Гостевая аутентификация разрешена" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠ $($_.Exception.Message)" -ForegroundColor Yellow
    }
    
    # ШАГ 4: Настройка SMB клиента
    Write-Host ""
    Write-Host "ШАГ 3: Настройка SMB клиента..." -ForegroundColor Cyan
    try {
        Set-SmbClientConfiguration -RequireSecuritySignature $false -Force -WarningAction SilentlyContinue
        Set-SmbClientConfiguration -EnableSecuritySignature $false -Force -WarningAction SilentlyContinue
        Write-Host "  ✓ SMB клиент настроен" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠ $($_.Exception.Message)" -ForegroundColor Yellow
    }
    
    # ШАГ 5: Политики
    Write-Host ""
    Write-Host "ШАГ 4: Настройка политик..." -ForegroundColor Cyan
    try {
        $regPath = "HKLM:\SYSTEM\CurrentControlSet\Control\Lsa"
        Set-ItemProperty -Path $regPath -Name "EveryoneIncludesAnonymous" -Value 1 -Type DWord -Force -ErrorAction SilentlyContinue
        Write-Host "  ✓ Политики настроены" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠ $($_.Exception.Message)" -ForegroundColor Yellow
    }
    
    # ШАГ 6: Очистка кеша
    Write-Host ""
    Write-Host "ШАГ 5: Очистка кеша сетевых подключений..." -ForegroundColor Cyan
    try {
        Get-PSDrive -PSProvider FileSystem | Where-Object {$_.DisplayRoot -like "\\*"} | Remove-PSDrive -Force -ErrorAction SilentlyContinue
        net use * /delete /yes 2>&1 | Out-Null
        Write-Host "  ✓ Кеш очищен" -ForegroundColor Green
    } catch {
        Write-Host "  ℹ Кеш уже чист" -ForegroundColor Gray
    }
    
    # ШАГ 7: Перезапуск служб
    Write-Host ""
    Write-Host "ШАГ 6: Перезапуск служб..." -ForegroundColor Cyan
    try {
        Restart-Service -Name LanmanWorkstation -Force
        Restart-Service -Name Spooler -Force
        Write-Host "  ✓ Службы перезапущены" -ForegroundColor Green
        Start-Sleep -Seconds 2
    } catch {
        Write-Host "  ⚠ $($_.Exception.Message)" -ForegroundColor Yellow
    }
    
    # ШАГ 8: Тестирование
    Write-Host ""
    Write-Host "ШАГ 7: Тестирование доступа..." -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "  [1/4] Ping сервера..." -NoNewline
    if (Test-Connection -ComputerName $ServerIP -Count 2 -Quiet) {
        Write-Host " ✓" -ForegroundColor Green
    } else {
        Write-Host " ✗" -ForegroundColor Red
    }
    
    Write-Host "  [2/4] Порт SMB (445)..." -NoNewline
    $portTest = Test-NetConnection -ComputerName $ServerIP -Port 445 -WarningAction SilentlyContinue
    if ($portTest.TcpTestSucceeded) {
        Write-Host " ✓" -ForegroundColor Green
    } else {
        Write-Host " ✗" -ForegroundColor Red
    }
    
    Write-Host "  [3/4] Доступ к тестовой папке..." -NoNewline
    try {
        $testPath = "\\$ServerIP\ShareTest"
        if (Test-Path $testPath -ErrorAction Stop) {
            Write-Host " ✓" -ForegroundColor Green
        } else {
            Write-Host " ✗" -ForegroundColor Red
        }
    } catch {
        Write-Host " ✗" -ForegroundColor Red
    }
    
    Write-Host "  [4/4] Список ресурсов..." -NoNewline
    try {
        $shares = net view \\$ServerIP 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host " ✓" -ForegroundColor Green
        } else {
            Write-Host " ⚠" -ForegroundColor Yellow
        }
    } catch {
        Write-Host " ⚠" -ForegroundColor Yellow
    }
    
    # ШАГ 9: Открытие проводника
    Write-Host ""
    Write-Host "ШАГ 8: Открытие проводника..." -ForegroundColor Cyan
    try {
        Start-Process "explorer.exe" -ArgumentList "\\$ServerIP"
        Write-Host "  ✓ Проводник открыт" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠ Не удалось открыть проводник" -ForegroundColor Yellow
    }
    
    # ИТОГИ
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║               КЛИЕНТ НАСТРОЕН!                            ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "ДЛЯ ПОДКЛЮЧЕНИЯ К РЕСУРСАМ:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  • Общие папки: \\$ServerIP" -ForegroundColor White
    Write-Host "  • Тест: \\$ServerIP\ShareTest" -ForegroundColor White
    Write-Host "  • Принтер: \\$ServerIP\HP2015" -ForegroundColor White
    Write-Host ""
    Write-Host "ДЛЯ ПОДКЛЮЧЕНИЯ ПРИНТЕРА:" -ForegroundColor Yellow
    Write-Host "  1. Панель управления → Устройства и принтеры" -ForegroundColor White
    Write-Host "  2. Добавить принтер → Нужный принтер отсутствует в списке" -ForegroundColor White
    Write-Host "  3. Выбрать принтер по имени: \\$ServerIP\HP2015" -ForegroundColor White
    Write-Host "  4. Далее → Готово" -ForegroundColor White
}

# ============================================
# ГЛАВНАЯ ЛОГИКА
# ============================================

if ($Role -eq "Server") {
    Configure-Server
} else {
    Configure-Client
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠ ВАЖНО: Если проблема не решена:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1. Перезагрузите компьютер" -ForegroundColor White
Write-Host "  2. Запустите скрипт ещё раз после перезагрузки" -ForegroundColor White
Write-Host "  3. Проверьте, что антивирус не блокирует подключение" -ForegroundColor White
Write-Host ""

pause