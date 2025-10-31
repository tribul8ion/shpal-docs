# ============================================================================
# Скрипт для ОТКАТА изменений и восстановления правильной даты
# ============================================================================

param(
    [switch]$Auto,         # Автоматическое восстановление через интернет
    [switch]$Manual,       # Ручная установка даты
    [switch]$Forward,      # Перенести дату на месяц вперед
    [switch]$RemoveTask    # Удалить задачу планировщика
)

# Проверка прав администратора
If (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator"))
{
    Write-Warning "Требуются права администратора! Перезапуск..."
    $arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`" " + $($PSBoundParameters.Keys | ForEach-Object { "-$_ " })
    Start-Process powershell.exe -ArgumentList $arguments -Verb RunAs
    Exit
}

# ============================================================================
# НАСТРОЙКИ
# ============================================================================
$logPath = "C:\Scripts\Logs"
$taskName = "Monthly Date Rollback"
$timeServers = @(
    "time.windows.com",
    "time.nist.gov",
    "pool.ntp.org",
    "time.google.com"
)

# ============================================================================
# ФУНКЦИИ
# ============================================================================

function Write-ColorLog {
    param($Message, $Color = "White")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor $Color
    
    if (Test-Path $logPath) {
        "[$timestamp] $Message" | Out-File -FilePath "$logPath\Restore_$(Get-Date -Format 'yyyyMMdd').log" -Append -Encoding UTF8
    }
}

function Get-InternetTime {
    Write-ColorLog "Попытка получить время из интернета..." "Yellow"
    
    foreach ($server in $timeServers) {
        try {
            Write-ColorLog "  Попытка подключения к $server..." "Gray"
            
            $client = New-Object System.Net.Sockets.TcpClient
            $client.Connect($server, 123)
            
            if ($client.Connected) {
                $client.Close()
                Write-ColorLog "  ✓ Сервер $server доступен" "Green"
                return $server
            }
        }
        catch {
            Write-ColorLog "  ✗ Сервер $server недоступен" "Red"
            continue
        }
    }
    
    return $null
}

function Restore-TimeService {
    Write-ColorLog "`n=== ВОССТАНОВЛЕНИЕ СЛУЖБЫ ВРЕМЕНИ ===" "Cyan"
    
    try {
        # Включаем службу времени
        Write-ColorLog "Включение службы Windows Time..." "Yellow"
        Set-Service w32time -StartupType Automatic -ErrorAction Stop
        Start-Service w32time -ErrorAction Stop
        
        Start-Sleep -Seconds 2
        
        $service = Get-Service w32time
        if ($service.Status -eq 'Running') {
            Write-ColorLog "✓ Служба Windows Time запущена" "Green"
            return $true
        } else {
            Write-ColorLog "✗ Не удалось запустить службу" "Red"
            return $false
        }
    }
    catch {
        Write-ColorLog "✗ Ошибка: $_" "Red"
        return $false
    }
}

function Sync-InternetTime {
    Write-ColorLog "`n=== СИНХРОНИЗАЦИЯ С ИНТЕРНЕТОМ ===" "Cyan"
    
    $currentDate = Get-Date
    Write-ColorLog "Текущая дата системы: $currentDate" "White"
    
    # Восстанавливаем службу времени
    if (-not (Restore-TimeService)) {
        return $false
    }
    
    # Проверяем доступность серверов времени
    $availableServer = Get-InternetTime
    
    if ($availableServer) {
        try {
            # Регистрируем службу времени
            Write-ColorLog "Регистрация службы времени..." "Yellow"
            w32tm /register | Out-Null
            
            # Устанавливаем сервер времени
            Write-ColorLog "Установка сервера времени: $availableServer" "Yellow"
            w32tm /config /manualpeerlist:$availableServer /syncfromflags:manual /reliable:YES /update | Out-Null
            
            # Перезапускаем службу
            Write-ColorLog "Перезапуск службы..." "Yellow"
            Restart-Service w32time -Force
            Start-Sleep -Seconds 3
            
            # Принудительная синхронизация
            Write-ColorLog "Выполнение синхронизации..." "Yellow"
            $syncResult = w32tm /resync /force 2>&1
            
            Start-Sleep -Seconds 2
            
            $newDate = Get-Date
            Write-ColorLog "`n✓ СИНХРОНИЗАЦИЯ ЗАВЕРШЕНА!" "Green"
            Write-ColorLog "Новая дата системы: $newDate" "Green"
            
            # Показываем разницу
            $diff = $newDate - $currentDate
            if ($diff.TotalSeconds -gt 60) {
                Write-ColorLog "Разница: $([math]::Round($diff.TotalMinutes, 2)) минут" "Cyan"
            } else {
                Write-ColorLog "Разница: $([math]::Round($diff.TotalSeconds, 2)) секунд" "Cyan"
            }
            
            return $true
        }
        catch {
            Write-ColorLog "✗ Ошибка синхронизации: $_" "Red"
            return $false
        }
    }
    else {
        Write-ColorLog "✗ Нет доступных серверов времени!" "Red"
        Write-ColorLog "Проверьте подключение к интернету" "Yellow"
        return $false
    }
}

function Set-ManualDate {
    Write-ColorLog "`n=== РУЧНАЯ УСТАНОВКА ДАТЫ ===" "Cyan"
    
    $currentDate = Get-Date
    Write-ColorLog "Текущая дата: $currentDate" "White"
    
    Write-Host "`nВведите новую дату и время в формате: " -NoNewline
    Write-Host "дд.мм.гггг чч:мм" -ForegroundColor Yellow
    Write-Host "Например: " -NoNewline
    Write-Host "15.12.2024 14:30" -ForegroundColor Cyan
    Write-Host "`nНовая дата: " -NoNewline -ForegroundColor Green
    
    $input = Read-Host
    
    try {
        $newDate = [DateTime]::ParseExact($input, "dd.MM.yyyy HH:mm", $null)
        
        Write-ColorLog "`nУстановка даты: $newDate" "Yellow"
        Set-Date -Date $newDate | Out-Null
        
        Write-ColorLog "✓ Дата успешно установлена!" "Green"
        Write-ColorLog "Новая дата системы: $(Get-Date)" "Green"
        
        return $true
    }
    catch {
        Write-ColorLog "✗ Ошибка: Неверный формат даты!" "Red"
        return $false
    }
}

function Set-DateForward {
    Write-ColorLog "`n=== ПЕРЕНОС ДАТЫ НА МЕСЯЦ ВПЕРЕД ===" "Cyan"
    
    $currentDate = Get-Date
    Write-ColorLog "Текущая дата: $currentDate" "White"
    
    $newDate = $currentDate.AddMonths(1)
    Write-ColorLog "Новая дата: $newDate" "Yellow"
    
    Write-Host "`nПродолжить? (Y/N): " -NoNewline -ForegroundColor Yellow
    $confirm = Read-Host
    
    if ($confirm -eq 'Y' -or $confirm -eq 'y') {
        try {
            Set-Date -Date $newDate | Out-Null
            Write-ColorLog "✓ Дата перенесена на месяц вперед!" "Green"
            Write-ColorLog "Новая дата системы: $(Get-Date)" "Green"
            return $true
        }
        catch {
            Write-ColorLog "✗ Ошибка: $_" "Red"
            return $false
        }
    }
    else {
        Write-ColorLog "Операция отменена" "Yellow"
        return $false
    }
}

function Remove-ScheduledTask {
    Write-ColorLog "`n=== УДАЛЕНИЕ ЗАДАЧИ ПЛАНИРОВЩИКА ===" "Cyan"
    
    $task = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
    
    if ($task) {
        Write-ColorLog "Найдена задача: $taskName" "White"
        Write-Host "Удалить? (Y/N): " -NoNewline -ForegroundColor Yellow
        $confirm = Read-Host
        
        if ($confirm -eq 'Y' -or $confirm -eq 'y') {
            Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
            Write-ColorLog "✓ Задача удалена" "Green"
            return $true
        }
        else {
            Write-ColorLog "Отменено" "Yellow"
            return $false
        }
    }
    else {
        Write-ColorLog "Задача не найдена" "Yellow"
        return $false
    }
}

function Show-CurrentStatus {
    Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║                  ТЕКУЩЕЕ СОСТОЯНИЕ СИСТЕМЫ                 ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan
    
    # Текущая дата
    $currentDate = Get-Date
    Write-Host "📅 Дата системы: " -NoNewline
    Write-Host $currentDate.ToString("dd.MM.yyyy HH:mm:ss") -ForegroundColor Yellow
    
    # День недели
    Write-Host "📆 День недели: " -NoNewline
    Write-Host $currentDate.ToString("dddd") -ForegroundColor Cyan
    
    # Служба времени
    $timeService = Get-Service w32time -ErrorAction SilentlyContinue
    Write-Host "`n🕐 Служба W32Time: " -NoNewline
    if ($timeService.Status -eq 'Running') {
        Write-Host "Запущена " -ForegroundColor Green -NoNewline
        Write-Host "($($timeService.StartType))" -ForegroundColor Gray
    } else {
        Write-Host "Остановлена " -ForegroundColor Red -NoNewline
        Write-Host "($($timeService.StartType))" -ForegroundColor Gray
    }
    
    # Задача планировщика
    $task = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
    Write-Host "📋 Задача '$taskName': " -NoNewline
    if ($task) {
        Write-Host "Установлена " -ForegroundColor Yellow -NoNewline
        Write-Host "($($task.State))" -ForegroundColor Gray
    } else {
        Write-Host "Не найдена" -ForegroundColor Green
    }
    
    # Проверка подключения к интернету
    Write-Host "`n🌐 Интернет: " -NoNewline
    $ping = Test-Connection -ComputerName 8.8.8.8 -Count 1 -Quiet -ErrorAction SilentlyContinue
    if ($ping) {
        Write-Host "Доступен" -ForegroundColor Green
    } else {
        Write-Host "Недоступен" -ForegroundColor Red
    }
    
    Write-Host ""
}

function Show-Menu {
    Clear-Host
    Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║           ВОССТАНОВЛЕНИЕ ПРАВИЛЬНОЙ ДАТЫ/ВРЕМЕНИ           ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Green
    
    Show-CurrentStatus
    
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║                      ВЫБЕРИТЕ ДЕЙСТВИЕ                     ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan
    
    Write-Host "  1. " -NoNewline -ForegroundColor White
    Write-Host "🌐 Автоматическая синхронизация через интернет" -ForegroundColor Green
    
    Write-Host "  2. " -NoNewline -ForegroundColor White
    Write-Host "⌨️  Ручная установка даты и времени" -ForegroundColor Cyan
    
    Write-Host "  3. " -NoNewline -ForegroundColor White
    Write-Host "➡️  Перенести дату на месяц ВПЕРЕД" -ForegroundColor Yellow
    
    Write-Host "  4. " -NoNewline -ForegroundColor White
    Write-Host "🔧 Только включить службу времени" -ForegroundColor Magenta
    
    Write-Host "  5. " -NoNewline -ForegroundColor White
    Write-Host "🗑️  Удалить задачу планировщика" -ForegroundColor Red
    
    Write-Host "  6. " -NoNewline -ForegroundColor White
    Write-Host "🔄 Обновить статус" -ForegroundColor Gray
    
    Write-Host "  0. " -NoNewline -ForegroundColor White
    Write-Host "❌ Выход" -ForegroundColor Red
    
    Write-Host ""
}

function Complete-Restoration {
    Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║              🎉 ПОЛНОЕ ВОССТАНОВЛЕНИЕ 🎉                   ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Green
    
    Write-ColorLog "Выполняется полное восстановление системы..." "Cyan"
    
    # 1. Синхронизация времени
    if (Sync-InternetTime) {
        Write-ColorLog "✓ Шаг 1/2: Время синхронизировано" "Green"
    } else {
        Write-ColorLog "⚠ Шаг 1/2: Не удалось синхронизировать время" "Yellow"
    }
    
    # 2. Удаление задачи
    $task = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
    if ($task) {
        Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
        Write-ColorLog "✓ Шаг 2/2: Задача планировщика удалена" "Green"
    } else {
        Write-ColorLog "ℹ Шаг 2/2: Задача не была установлена" "Gray"
    }
    
    Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                   ✓ ВСЁ ВОССТАНОВЛЕНО!                     ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    
    Show-CurrentStatus
}

# ============================================================================
# ГЛАВНАЯ ЛОГИКА
# ============================================================================

# Создаем папку для логов
if (!(Test-Path $logPath)) {
    New-Item -ItemType Directory -Path $logPath -Force | Out-Null
}

# Обработка параметров командной строки
if ($Auto) {
    Complete-Restoration
    pause
    Exit
}

if ($Manual) {
    Set-ManualDate
    pause
    Exit
}

if ($Forward) {
    Set-DateForward
    pause
    Exit
}

if ($RemoveTask) {
    Remove-ScheduledTask
    pause
    Exit
}

# Интерактивное меню
while ($true) {
    Show-Menu
    $choice = Read-Host "Ваш выбор"
    
    switch ($choice) {
        "1" {
            Sync-InternetTime
            Write-Host "`nНажмите любую клавишу для продолжения..." -ForegroundColor Gray
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
        "2" {
            Set-ManualDate
            Write-Host "`nНажмите любую клавишу для продолжения..." -ForegroundColor Gray
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
        "3" {
            Set-DateForward
            Write-Host "`nНажмите любую клавишу для продолжения..." -ForegroundColor Gray
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
        "4" {
            Restore-TimeService
            Write-Host "`nНажмите любую клавишу для продолжения..." -ForegroundColor Gray
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
        "5" {
            Remove-ScheduledTask
            Write-Host "`nНажмите любую клавишу для продолжения..." -ForegroundColor Gray
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
        "6" {
            # Просто обновляем экран
        }
        "0" {
            Write-Host "`nДо свидания! 👋" -ForegroundColor Cyan
            Exit
        }
        "99" {
            # Секретный пункт - полное восстановление
            Complete-Restoration
            Write-Host "`nНажмите любую клавишу для продолжения..." -ForegroundColor Gray
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
        default {
            Write-Host "`n❌ Неверный выбор! Попробуйте снова." -ForegroundColor Red
            Start-Sleep -Seconds 1
        }
    }
}