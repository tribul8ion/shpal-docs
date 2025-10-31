# Отладка Telegram Chat ID

## Проблема: "Bad Request: chat not found"

Это означает, что Chat ID неправильный или бот не добавлен в чат/группу.

## Как получить правильный Chat ID:

### Вариант 1: Личный чат с ботом

1. Найдите вашего бота в Telegram (username, который вы указали при создании)
2. Начните с ним диалог (отправьте `/start`)
3. Откройте в браузере:
   ```
   https://api.telegram.org/bot8091307676:AAFY677S1jKLM9159nPzg-mNSWJLlgapQik/getUpdates
   ```
4. Найдите в ответе `"chat":{"id":123456789}` - это ваш Chat ID (положительное число)
5. Добавьте в `.env.local`: `TELEGRAM_CHAT_ID=123456789`

### Вариант 2: Использование @userinfobot

1. Найдите [@userinfobot](https://t.me/userinfobot) в Telegram
2. Начните диалог - бот покажет ваш ID
3. Это будет положительное число (например: `123456789`)
4. Добавьте в `.env.local`: `TELEGRAM_CHAT_ID=123456789`

### Вариант 3: Группа (текущий Chat ID: -3089929963)

Если вы хотите получать в группу:

1. Убедитесь, что бот **добавлен в группу**
2. Убедитесь, что бот является **администратором группы** (если нужно)
3. Отправьте любое сообщение в группу
4. Откройте:
   ```
   https://api.telegram.org/bot8091307676:AAFY677S1jKLM9159nPzg-mNSWJLlgapQik/getUpdates
   ```
5. Найдите `"chat":{"id":-123456789}` - отрицательное число
6. Если ID отличается от `-3089929963`, обновите в `.env.local`

## Проверка работоспособности:

После обновления `.env.local`:

1. Перезапустите сервер (Ctrl+C, потом `npm run dev`)
2. Отправьте тестовый фидбек на сайте
3. Проверьте Telegram - сообщение должно прийти

## Быстрая проверка Chat ID:

Выполните в PowerShell:

```powershell
$token = "8091307676:AAFY677S1jKLM9159nPzg-mNSWJLlgapQik"
Invoke-RestMethod -Uri "https://api.telegram.org/bot$token/getUpdates" | ConvertTo-Json -Depth 10
```

В ответе найдите `result[0].message.chat.id` - это и есть нужный Chat ID.

