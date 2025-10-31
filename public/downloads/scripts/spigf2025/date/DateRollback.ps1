# ============================================================================
# Универсальный скрипт для автоматического переноса даты на месяц назад
# ============================================================================

param(
    [switch]$Install,      # Установить задачу в планировщик
    [switch]$Uninstall,    # Удалить задачу
    [switch]$Run,          # Выполнить перенос даты
    [switch]$Status        # Показать статус
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
$scriptPath = "C:\Scripts\SetDateBackOneMonth.ps1"
$scriptFolder = "C:\Scripts"
$logPath = "C:\Scripts\Logs"
$taskName = "Monthly Date Rollback"

# ============================================================================
# ФУНКЦИЯ ЛОГИРОВАНИЯ
# ============================================================================
function Write-Log {
    param($Message, $Color = "White")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "$timestamp - $Message"
    Write-Host $logMessage -ForegroundColor $Color
    
    if (Test-Path $logPath) {
        $logFile = "$logPath\DateChange_$(Get-Date -Format 'yyyyMMdd').log"
        $logMessage | Out-File -FilePath $logFile -Append -Encoding UTF8
    }
}

# ============================================================================
# ФУНКЦИЯ ПЕРЕНОСА ДАТЫ
# ============================================================================
function Set-DateBackOneMonth {
    try {
        if (!(Test-Path $logPath)) {
            New-Item -ItemType Directory -Path $logPath -Force | Out-Null
        }

        Write-Log "=== НАЧАЛО РАБОТЫ СКРИПТА ===" "Cyan"
        
        # Отключаем синхронизацию времени
        Write-Log "Отключение службы синхронизации времени..." "Yellow"
        Stop-Service w32time -ErrorAction SilentlyContinue
        Set-Service w32time -StartupType Disabled -ErrorAction SilentlyContinue
        
        # Получаем текущую дату
        $currentDate = Get-Date
        Write-Log "Текущая дата: $currentDate" "White"
        
        # Вычисляем дату месяц назад
        $newDate = $currentDate.AddMonths(-1)
        Write-Log "Новая дата: $newDate" "White"
        
        # Устанавливаем новую дату
        Set-Date -Date $newDate | Out-Null
        Write-Log "Дата успешно изменена на: $(Get-Date)" "Green"
        
        Write-Log "=== ОПЕРАЦИЯ ВЫПОЛНЕНА УСПЕШНО ===" "Cyan"
        return $true
    }
    catch {
        Write-Log "ОШИБКА: $_" "Red"
        return $false
    }
}

# ============================================================================
# ФУНКЦИЯ УСТАНОВКИ
# ============================================================================
function Install-DateRollbackTask {
    Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║  УСТАНОВКА АВТОМАТИЧЕСКОГО ПЕРЕНОСА ДАТЫ НА МЕСЯЦ НАЗАД   ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

    # Создаем папки
    if (!(Test-Path $scriptFolder)) {
        New-Item -ItemType Directory -Path $scriptFolder -Force | Out-Null
        Write-Log "✓ Создана папка: $scriptFolder" "Green"
    }
    
    if (!(Test-Path $logPath)) {
        New-Item -ItemType Directory -Path $logPath -Force | Out-Null
        Write-Log "✓ Создана папка для логов: $logPath" "Green"
    }

    # Создаем основной скрипт
    $workerScript = @'
# Рабочий скрипт переноса даты
If (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator"))
{
    Start-Process powershell.exe "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    Exit
}

$logPath = "C:\Scripts\Logs"
if (!(Test-Path $logPath)) {
    New-Item -ItemType Directory -Path $logPath -Force | Out-Null
}
$logFile = "$logPath\DateChange_$(Get-Date -Format 'yyyyMMdd').log"

function Write-Log {
    param($Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $Message" | Tee-Object -FilePath $logFile -Append
}

try {
    Write-Log "=== НАЧАЛО РАБОТЫ СКРИПТА ==="
    
    Stop-Service w32time -ErrorAction SilentlyContinue
    Set-Service w32time -StartupType Disabled -ErrorAction SilentlyContinue
    Write-Log "Служба синхронизации времени отключена"
    
    $currentDate = Get-Date
    Write-Log "Текущая дата: $currentDate"
    
    $newDate = $currentDate.AddMonths(-1)
    Write-Log "Новая дата: $newDate"
    
    Set-Date -Date $newDate | Out-Null
    Write-Log "Дата успешно изменена на: $(Get-Date)"
    Write-Log "=== ОПЕРАЦИЯ ВЫПОЛНЕНА УСПЕШНО ==="
}
catch {
    Write-Log "ОШИБКА: $_"
    Exit 1
}
'@

    $workerScript | Out-File -FilePath $scriptPath -Encoding UTF8 -Force
    Write-Log "✓ Создан рабочий скрипт: $scriptPath" "Green"

    # Удаляем старую задачу если есть
    $existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
    if ($existingTask) {
        Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
        Write-Log "✓ Удалена старая задача" "Yellow"
    }

    # Создаем триггер - каждый месяц в 3:00
    $trigger = New-ScheduledTaskTrigger -At "03:00AM" -Daily
    
    # Действие
    $action = New-ScheduledTaskAction -Execute "powershell.exe" `
        -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$scriptPath`""

    # Настройки
    $settings = New-ScheduledTaskSettingsSet `
        -AllowStartIfOnBatteries `
        -DontStopIfGoingOnBatteries `
        -StartWhenAvailable `
        -RunOnlyIfNetworkAvailable:$false `
        -DontStopOnIdleEnd `
        -ExecutionTimeLimit (New-TimeSpan -Minutes 10)

    # Регистрируем задачу
    Register-ScheduledTask `
        -TaskName $taskName `
        -Trigger $trigger `
        -Action $action `
        -Settings $settings `
        -User "SYSTEM" `
        -RunLevel Highest `
        -Description "Автоматически переносит системную дату на месяц назад каждый месяц (каждые 30 дней)" `
        -Force | Out-Null

    # Изменяем триггер на ежемесячный (каждые 30 дней)
    $task = Get-ScheduledTask -TaskName $taskName
    $task.Triggers[0].Repetition.Interval = "P30D"
    $task | Set-ScheduledTask | Out-Null

    Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║              УСТАНОВКА ЗАВЕРШЕНА УСПЕШНО!                  ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    
    Write-Host "`n📁 Скрипт: " -NoNewline; Write-Host $scriptPath -ForegroundColor Cyan
    Write-Host "📅 Расписание: " -NoNewline; Write-Host "Каждые 30 дней в 03:00" -ForegroundColor Cyan
    Write-Host "📋 Логи: " -NoNewline; Write-Host $logPath -ForegroundColor Cyan
    Write-Host "🔧 Задача: " -NoNewline; Write-Host $taskName -ForegroundColor Cyan
    
    Show-Status
}

# ============================================================================
# ФУНКЦИЯ УДАЛЕНИЯ
# ============================================================================
function Uninstall-DateRollbackTask {
    Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
    Write-Host "║                    УДАЛЕНИЕ ЗАДАЧИ                         ║" -ForegroundColor Yellow
    Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Yellow

    $task = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
    if ($task) {
        Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
        Write-Log "✓ Задача '$taskName' удалена" "Green"
    } else {
        Write-Log "⚠ Задача не найдена" "Yellow"
    }

    if (Test-Path $scriptPath) {
        Write-Host "`nУдалить файлы скриптов? (Y/N): " -NoNewline -ForegroundColor Yellow
        $response = Read-Host
        if ($response -eq 'Y' -or $response -eq 'y') {
            Remove-Item $scriptPath -Force -ErrorAction SilentlyContinue
            Write-Log "✓ Скрипт удален: $scriptPath" "Green"
        }
    }

    # Предложение включить синхронизацию времени обратно
    Write-Host "`nВключить обратно синхронизацию времени? (Y/N): " -NoNewline -ForegroundColor Yellow
    $response = Read-Host
    if ($response -eq 'Y' -or $response -eq 'y') {
        Set-Service w32time -StartupType Automatic
        Start-Service w32time
        w32tm /resync /force
        Write-Log "✓ Синхронизация времени включена" "Green"
    }

    Write-Host "`n✓ Удаление завершено!" -ForegroundColor Green
}

# ============================================================================
# ФУНКЦИЯ ПОКАЗА СТАТУСА
# ============================================================================
function Show-Status {
    Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║                    СТАТУС СИСТЕМЫ                          ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

    # Проверка задачи
    $task = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
    if ($task) {
        Write-Host "✓ Задача планировщика: " -NoNewline -ForegroundColor Green
        Write-Host "Установлена" -ForegroundColor White
        Write-Host "  Состояние: " -NoNewline
        Write-Host $task.State -ForegroundColor $(if($task.State -eq 'Ready'){'Green'}else{'Yellow'})
        
        $taskInfo = Get-ScheduledTaskInfo -TaskName $taskName -ErrorAction SilentlyContinue
        if ($taskInfo.LastRunTime) {
            Write-Host "  Последний запуск: " -NoNewline
            Write-Host $taskInfo.LastRunTime -ForegroundColor Cyan
        }
        if ($taskInfo.NextRunTime) {
            Write-Host "  Следующий запуск: " -NoNewline
            Write-Host $taskInfo.NextRunTime -ForegroundColor Cyan
        }
    } else {
        Write-Host "✗ Задача планировщика: " -NoNewline -ForegroundColor Red
        Write-Host "Не установлена" -ForegroundColor White
    }

    # Проверка скрипта
    if (Test-Path $scriptPath) {
        Write-Host "`n✓ Рабочий скрипт: " -NoNewline -ForegroundColor Green
        Write-Host "Существует" -ForegroundColor White
        Write-Host "  Путь: $scriptPath" -ForegroundColor Gray
    } else {
        Write-Host "`n✗ Рабочий скрипт: " -NoNewline -ForegroundColor Red
        Write-Host "Не найден" -ForegroundColor White
    }

    # Текущая дата
    Write-Host "`n📅 Текущая дата системы: " -NoNewline
    Write-Host (Get-Date -Format "dd.MM.yyyy HH:mm:ss") -ForegroundColor Cyan

    # Служба времени
    $timeService = Get-Service w32time -ErrorAction SilentlyContinue
    Write-Host "🕐 Служба синхронизации времени: " -NoNewline
    if ($timeService.Status -eq 'Running') {
        Write-Host "Работает (StartType: $($timeService.StartType))" -ForegroundColor Yellow
    } else {
        Write-Host "Остановлена (StartType: $($timeService.StartType))" -ForegroundColor Gray
    }

    # Логи
    if (Test-Path $logPath) {
        $logs = Get-ChildItem $logPath -Filter "*.log" -ErrorAction SilentlyContinue
        Write-Host "`n📋 Файлов логов: " -NoNewline
        Write-Host $logs.Count -ForegroundColor Cyan
        if ($logs.Count -gt 0) {
            Write-Host "  Последний лог: " -NoNewline
            $lastLog = $logs | Sort-Object LastWriteTime -Descending | Select-Object -First 1
            Write-Host $lastLog.Name -ForegroundColor Gray
        }
    }
}

# ============================================================================
# ГЛАВНОЕ МЕНЮ
# ============================================================================
function Show-Menu {
    Clear-Host
    Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
    Write-Host "║      АВТОМАТИЧЕСКИЙ ПЕРЕНОС ДАТЫ НА МЕСЯЦ НАЗАД           ║" -ForegroundColor Magenta
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "  1. Установить автоматическую задачу" -ForegroundColor Cyan
    Write-Host "  2. Удалить задачу" -ForegroundColor Yellow
    Write-Host "  3. Выполнить перенос даты СЕЙЧАС" -ForegroundColor Green
    Write-Host "  4. Показать статус" -ForegroundColor White
    Write-Host "  5. Показать последние логи" -ForegroundColor Gray
    Write-Host "  0. Выход" -ForegroundColor Red
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Red
    Write-Host "║  ⚠ ВНИМАНИЕ! Перенос даты может нарушить работу системы! ║" -ForegroundColor Red
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Red
    Write-Host ""
}

# ============================================================================
# ГЛАВНАЯ ЛОГИКА
# ============================================================================

if ($Install) {
    Install-DateRollbackTask
    pause
    Exit
}

if ($Uninstall) {
    Uninstall-DateRollbackTask
    pause
    Exit
}

if ($Run) {
    Set-DateBackOneMonth
    pause
    Exit
}

if ($Status) {
    Show-Status
    pause
    Exit
}

# Интерактивное меню
while ($true) {
    Show-Menu
    $choice = Read-Host "Выберите действие"
    
    switch ($choice) {
        "1" {
            Install-DateRollbackTask
            pause
        }
        "2" {
            Uninstall-DateRollbackTask
            pause
        }
        "3" {
            Write-Host "`n⚠ Вы уверены? Дата будет перенесена на месяц назад! (Y/N): " -NoNewline -ForegroundColor Red
            $confirm = Read-Host
            if ($confirm -eq 'Y' -or $confirm -eq 'y') {
                Set-DateBackOneMonth
            }
            pause
        }
        "4" {
            Show-Status
            pause
        }
        "5" {
            if (Test-Path $logPath) {
                $latestLog = Get-ChildItem $logPath -Filter "*.log" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
                if ($latestLog) {
                    Write-Host "`n=== ПОСЛЕДНИЙ ЛОГ: $($latestLog.Name) ===`n" -ForegroundColor Cyan
                    Get-Content $latestLog.FullName -Tail 30
                } else {
                    Write-Host "`nЛоги не найдены" -ForegroundColor Yellow
                }
            }
            pause
        }
        "0" {
            Exit
        }
        default {
            Write-Host "`nНеверный выбор!" -ForegroundColor Red
            Start-Sleep -Seconds 1
        }
    }
}