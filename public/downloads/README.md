# Папка Downloads

Эта папка содержит все файлы, доступные для скачивания с фронтенда документации.

## Структура

```
downloads/
├── drivers/           # Драйверы принтеров
│   ├── drivers/      # Исходные файлы драйверов
│   ├── brother-drivers.zip
│   ├── godex-driver.zip
│   └── zebra-driver.zip
├── scripts/          # Скрипты и утилиты
│   ├── spigf2025/   # Исходные скрипты
│   └── spigf2025.zip
└── tools/           # Дополнительные утилиты
```

## Обновление файлов

### Драйверы

1. Замените файлы в `public/downloads/drivers/drivers/`
2. Пересоздайте архивы:

```powershell
# Brother
Compress-Archive -Path "public\downloads\drivers\drivers\32_64\*" -DestinationPath "public\downloads\drivers\brother-drivers.zip" -Force

# GoDEX
Compress-Archive -Path "public\downloads\drivers\drivers\2023.2 M-3\*" -DestinationPath "public\downloads\drivers\godex-driver.zip" -Force

# Zebra
Compress-Archive -Path "public\downloads\drivers\drivers\Zebra\*" -DestinationPath "public\downloads\drivers\zebra-driver.zip" -Force
```

### Скрипты

1. Замените файлы в `public/downloads/scripts/spigf2025/`
2. Пересоздайте архив:

```powershell
Compress-Archive -Path "public\downloads\scripts\spigf2025\*" -DestinationPath "public\downloads\scripts\spigf2025.zip" -Force
```

## Добавление новых файлов для скачивания

1. Поместите файлы в соответствующую папку в `public/downloads/`
2. Обновите документацию в `content/docs/additional/downloads.mdx`
3. Добавьте ссылки на скачивание в соответствующих страницах документации
4. При необходимости создайте архив для группы файлов

## Важно

- Все файлы в `public/downloads/` доступны для прямого скачивания
- URL для скачивания: `/downloads/путь/к/файлу`
- Для больших файлов рекомендуется создавать архивы
- Не добавляйте файлы в git (папка в .gitignore)
- При деплое убедитесь, что файлы загружены на сервер

## Примеры URL

- Архив скриптов: `/downloads/scripts/spigf2025.zip`
- Отдельный файл: `/downloads/scripts/spigf2025/date/DateRollback.ps1`
- Драйвер Brother 64-bit: `/downloads/drivers/drivers/32_64/dpinstx64.exe`

