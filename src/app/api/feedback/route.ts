import { NextResponse } from 'next/server';

export interface Feedback {
  opinion: 'good' | 'bad' | 'error';
  url?: string;
  message: string;
  pageTitle?: string;
  name?: string;
}

/**
 * Отправка фидбека в Telegram бот
 */
async function sendToTelegram(feedback: Feedback) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // Если токен и chat_id не настроены, пропускаем отправку
  if (!botToken || !chatId) {
    console.log('[TELEGRAM] Токен бота или Chat ID не настроены. Пропуск отправки.');
    return null;
  }

  const timestamp = new Date().toLocaleString('ru-RU', {
    timeZone: 'Europe/Moscow',
    dateStyle: 'short',
    timeStyle: 'short',
  });

  const emoji = feedback.opinion === 'good' ? '👍' : feedback.opinion === 'error' ? '⚠️' : '👎';
  const status = feedback.opinion === 'good' ? 'Полезно' : feedback.opinion === 'error' ? 'Найдена ошибка' : 'Нужно улучшить';

  // Форматируем сообщение с HTML разметкой для красивого отображения
  const title = feedback.opinion === 'error' 
    ? '🐛 <b>Найдена ошибка в документации!</b>' 
    : '📝 <b>Новый отзыв о документации</b>';
  
  const message = `
${title}

${emoji} <b>Тип:</b> ${status}
👤 <b>От:</b> ${feedback.name || 'Аноним'}
📄 <b>Страница:</b> ${feedback.pageTitle || 'Не указано'}
🔗 <b>URL:</b> <code>${feedback.url || 'Не указано'}</code>

💬 <b>Сообщение:</b>
<pre>${feedback.message}</pre>

🕒 <b>Время:</b> ${timestamp}
  `.trim();

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('[TELEGRAM] Ошибка отправки:', error);
      throw new Error(`Telegram API error: ${error.description || 'Unknown error'}`);
    }

    const result = await response.json();
    if (result.ok && result.result) {
      console.log('[TELEGRAM] Фидбек успешно отправлен. Message ID:', result.result.message_id);
    } else {
      console.log('[TELEGRAM] Фидбек успешно отправлен');
    }
    return result;
  } catch (error) {
    console.error('[TELEGRAM] Ошибка при отправке фидбека:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const feedback: Feedback = await request.json();

    // Валидация
    if (!feedback.opinion || !feedback.message?.trim()) {
      return NextResponse.json(
        { error: 'Отзыв и мнение обязательны' },
        { status: 400 },
      );
    }

    // Логируем фидбек в консоль
    console.log('[FEEDBACK]', {
      timestamp: new Date().toISOString(),
      ...feedback,
    });

    // Отправляем в Telegram (если настроено)
    try {
      await sendToTelegram(feedback);
    } catch (error) {
      // Если не удалось отправить в Telegram, не прерываем процесс
      // Фидбек уже залогирован в консоль
      console.error('[FEEDBACK] Не удалось отправить в Telegram:', error);
    }

    return NextResponse.json(
      { success: true, message: 'Отзыв успешно отправлен' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error processing feedback:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при обработке отзыва' },
      { status: 500 },
    );
  }
}

