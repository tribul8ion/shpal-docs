import Link from 'next/link';
import { Printer, Settings, Wrench, Tag, UserPlus, BookOpen, FileText, Download, Code, Zap } from 'lucide-react';
import StarBackground from '@/components/star-background';

export default function HomePage() {
  return (
    <>
      <StarBackground />
      <div className="flex flex-col min-h-[calc(100vh-3.5rem)] relative z-10">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-32 md:py-40 gap-8">
        <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold relative select-none" style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(200,220,255,0.7) 50%, rgba(150,180,255,0.8) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: 'none',
          letterSpacing: '-0.02em',
          filter: 'drop-shadow(0 0 60px rgba(150,180,255,0.4)) drop-shadow(0 0 30px rgba(255,255,255,0.3))',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          cursor: 'default'
        }}>
          EXPOFORUM
        </h1>
        <p className="text-xl md:text-2xl text-white/70 max-w-3xl backdrop-blur-sm px-6 py-3 rounded-lg">
          Документация по настройке оборудования для регистрации
        </p>
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          <Link
            href="/docs"
            className="px-8 py-4 rounded-xl bg-white/[0.08] backdrop-blur-lg border border-white/20 text-white font-medium hover:bg-white/[0.15] hover:scale-105 transition-all shadow-xl text-lg"
          >
            📚 Открыть документацию
          </Link>
          <Link
            href="/docs/godex/godex-80x60"
            className="px-8 py-4 rounded-xl backdrop-blur-lg border border-white/20 text-white font-medium hover:bg-white/[0.08] hover:scale-105 transition-all shadow-xl text-lg"
          >
            🚀 Начать с GoDEX
          </Link>
        </div>
        <div className="mt-6 text-sm text-white/60 max-w-2xl">
          💡 <strong>Совет:</strong> Используйте боковую панель навигации или поиск для быстрого доступа к нужным инструкциям
        </div>
      </section>

      {/* About Documentation Section */}
      <section className="px-4 py-12 md:py-16 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-lg">О документации</h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Полный справочник по настройке, обслуживанию и устранению неисправностей принтеров для системы регистрации EXPOFORUM
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link href="/docs/godex/godex-80x60" className="p-6 rounded-xl backdrop-blur-lg bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200 group">
            <div className="p-3 rounded-lg bg-blue-500/20 w-fit mb-4 group-hover:bg-blue-500/30 transition-colors">
              <BookOpen className="w-6 h-6 text-blue-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">Руководства по принтерам</h3>
            <p className="text-sm text-white/70">
              Подробные инструкции по настройке принтеров GoDEX, Zebra, Brother и других производителей с пошаговыми описаниями и иллюстрациями
            </p>
          </Link>

          <Link href="/docs/godex/godex-maintenance" className="p-6 rounded-xl backdrop-blur-lg bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200 group">
            <div className="p-3 rounded-lg bg-green-500/20 w-fit mb-4 group-hover:bg-green-500/30 transition-colors">
              <Wrench className="w-6 h-6 text-green-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-green-300 transition-colors">Устранение неисправностей</h3>
            <p className="text-sm text-white/70">
              Решения типичных проблем, инструкции по обслуживанию и калибровке оборудования для поддержания работоспособности
            </p>
          </Link>

          <Link href="/docs/additional/drivers-godex" className="p-6 rounded-xl backdrop-blur-lg bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200 group">
            <div className="p-3 rounded-lg bg-purple-500/20 w-fit mb-4 group-hover:bg-purple-500/30 transition-colors">
              <Download className="w-6 h-6 text-purple-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">Драйверы и утилиты</h3>
            <p className="text-sm text-white/70">
              Готовые пакеты драйверов, утилиты для диагностики и вспомогательные инструменты для работы с принтерами
            </p>
          </Link>

          <Link href="/docs/additional/spigf-scripts" className="p-6 rounded-xl backdrop-blur-lg bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200 group">
            <div className="p-3 rounded-lg bg-orange-500/20 w-fit mb-4 group-hover:bg-orange-500/30 transition-colors">
              <Code className="w-6 h-6 text-orange-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-orange-300 transition-colors">Скрипты и автоматизация</h3>
            <p className="text-sm text-white/70">
              PowerShell скрипты для автоматизации задач, исправления ошибок печати и оптимизации настроек Windows
            </p>
          </Link>

          <Link href="/docs/changelog" className="p-6 rounded-xl backdrop-blur-lg bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200 group">
            <div className="p-3 rounded-lg bg-pink-500/20 w-fit mb-4 group-hover:bg-pink-500/30 transition-colors">
              <FileText className="w-6 h-6 text-pink-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-pink-300 transition-colors">История изменений</h3>
            <p className="text-sm text-white/70">
              Следите за обновлениями документации, новыми руководствами и улучшениями существующих инструкций
            </p>
          </Link>

          <Link href="/docs/tags" className="p-6 rounded-xl backdrop-blur-lg bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200 group">
            <div className="p-3 rounded-lg bg-cyan-500/20 w-fit mb-4 group-hover:bg-cyan-500/30 transition-colors">
              <Zap className="w-6 h-6 text-cyan-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">Быстрый поиск</h3>
            <p className="text-sm text-white/70">
              Удобная навигация по тегам, поиск по содержимому и структурированный каталог всех доступных руководств
            </p>
          </Link>
        </div>

        <div className="mt-8 p-6 rounded-xl backdrop-blur-lg bg-white/[0.05] border border-white/15 hover:bg-white/[0.08] transition-all">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <BookOpen className="w-5 h-5 text-blue-300" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-3">Структура документации</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/70 mb-4">
                <div>
                  <p className="font-medium text-white/90 mb-2">📖 Основные разделы:</p>
                  <ul className="space-y-1.5 ml-4">
                    <li className="flex items-center gap-2">
                      <span className="text-blue-400">•</span> Принтеры GoDEX (4 руководства)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">•</span> Принтеры Zebra (3 руководства)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-pink-400">•</span> Принтеры Brother (3 руководства)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-orange-400">•</span> Другие принтеры
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-white/90 mb-2">🛠️ Дополнительные материалы:</p>
                  <ul className="space-y-1.5 ml-4">
                    <li className="flex items-center gap-2">
                      <span className="text-purple-400">•</span> Драйверы и утилиты
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-cyan-400">•</span> Windows скрипты
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-yellow-400">•</span> Скрипты SPIGF2025
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-indigo-400">•</span> Центр загрузок
                    </li>
                  </ul>
                </div>
              </div>
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-white/60">
                  💡 <strong className="text-white/80">Совет:</strong> Все руководства содержат пошаговые инструкции с иллюстрациями. Используйте боковую панель для быстрой навигации.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="px-4 py-12 md:py-16 max-w-6xl mx-auto w-full">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white drop-shadow-lg">Быстрый доступ</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {/* GoDEX */}
          <Link
            href="/docs/godex/godex-80x60"
            className="group p-6 rounded-xl backdrop-blur-lg bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] transition-all duration-200 shadow-xl hover:shadow-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-400/20 group-hover:bg-blue-400/30 transition-colors">
                <Settings className="w-6 h-6 text-blue-300" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1 text-white group-hover:text-blue-300 transition-colors">
                  GoDEX
                </h3>
                <p className="text-sm text-white/70">
                  Настройка принтеров этикеток Godex
                </p>
              </div>
            </div>
          </Link>

          {/* Zebra */}
          <Link
            href="/docs/zebra/zebra-badges"
            className="group p-6 rounded-xl backdrop-blur-lg bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] transition-all duration-200 shadow-xl hover:shadow-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-green-400/20 group-hover:bg-green-400/30 transition-colors">
                <Tag className="w-6 h-6 text-green-300" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1 text-white group-hover:text-green-300 transition-colors">
                  Zebra
                </h3>
                <p className="text-sm text-white/70">
                  Настройка принтеров для печати бейджей
                </p>
              </div>
            </div>
          </Link>

          {/* Brother */}
          <Link
            href="/docs/brother/brother-samoreg"
            className="group p-6 rounded-xl backdrop-blur-lg bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] transition-all duration-200 shadow-xl hover:shadow-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-pink-400/20 group-hover:bg-pink-400/30 transition-colors">
                <Printer className="w-6 h-6 text-pink-300" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1 text-white group-hover:text-pink-300 transition-colors">
                  Brother
                </h3>
                <p className="text-sm text-white/70">
                  Настройка принтеров для саморегистрации
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Popular Guides */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-6 text-white drop-shadow-lg">Популярные руководства</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/docs/godex/godex-80x60"
              className="group p-5 rounded-lg backdrop-blur-lg bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] transition-all shadow-xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <Settings className="w-5 h-5 text-blue-300" />
                <span className="font-medium text-white group-hover:text-blue-300 transition-colors">
                  Настройка печати Godex из Windows
                </span>
              </div>
              <p className="text-sm text-white/70">
                Пошаговая инструкция по настройке параметров печати
              </p>
            </Link>

            <Link
              href="/docs/zebra/zebra-white"
              className="group p-5 rounded-lg backdrop-blur-lg bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] transition-all shadow-xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <Tag className="w-5 h-5 text-green-300" />
                <span className="font-medium text-white group-hover:text-green-300 transition-colors">
                  Настройка Zebra для этикеток 80×60
                </span>
              </div>
              <p className="text-sm text-white/70">
                Инструкция по настройке принтера для белых этикеток
              </p>
            </Link>

            <Link
              href="/docs/brother/brother-toner"
              className="group p-5 rounded-lg backdrop-blur-lg bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] transition-all shadow-xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <Wrench className="w-5 h-5 text-pink-300" />
                <span className="font-medium text-white group-hover:text-pink-300 transition-colors">
                  Сброс ошибки тонера Brother
                </span>
              </div>
              <p className="text-sm text-white/70">
                Решение проблемы с ошибками тонера
              </p>
            </Link>

            <Link
              href="/docs/godex/godex-maintenance"
              className="group p-5 rounded-lg backdrop-blur-lg bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] transition-all shadow-xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <Wrench className="w-5 h-5 text-orange-300" />
                <span className="font-medium text-white group-hover:text-orange-300 transition-colors">
                  Обслуживание принтеров Godex
                </span>
              </div>
              <p className="text-sm text-white/70">
                Очистка и устранение неисправностей
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">4</div>
              <div className="text-sm text-white/70">Руководства GoDEX</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">3</div>
              <div className="text-sm text-white/70">Руководства Zebra</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">3</div>
              <div className="text-sm text-white/70">Руководства Brother</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">10+</div>
              <div className="text-sm text-white/70">Всего инструкций</div>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="px-4 py-12 text-center border-t border-white/10">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white drop-shadow-lg">Готовы начать?</h2>
          <p className="text-white/80 mb-6 drop-shadow-md">
            Выберите нужное руководство или воспользуйтесь поиском для быстрого доступа к информации
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/docs"
              className="inline-block px-8 py-4 rounded-xl bg-white/[0.08] backdrop-blur-lg border border-white/20 text-white font-medium hover:bg-white/[0.15] hover:scale-105 transition-all shadow-xl text-lg"
            >
              📚 Открыть документацию
            </Link>
            <Link
              href="/docs/downloads"
              className="inline-block px-8 py-4 rounded-xl backdrop-blur-lg border border-white/20 text-white font-medium hover:bg-white/[0.08] hover:scale-105 transition-all shadow-xl text-lg"
            >
              📥 Центр загрузок
            </Link>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
