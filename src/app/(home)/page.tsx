"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  BookOpen,
  Settings,
  Wrench,
  Tag,
  Printer,
  FileText,
  Download,
  Code,
  Zap,
} from "lucide-react";

interface MousePositionProps {
  x: number;
  y: number;
}

export default function HomePage() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    setMounted(true);
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  const [mousePosition, setMousePosition] = useState<MousePositionProps>({
    x: 50,
    y: 30,
  });

  useEffect(() => {
    // Only add mouse tracking for non-mobile devices
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (typeof window === "undefined") return;
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  const containerStyle = {
    background: `
      radial-gradient(ellipse 80% 60% at ${mousePosition.x}% ${
      mousePosition.y * 0.3
    }%, rgba(59, 130, 246, 0.15), transparent 70%),
      radial-gradient(ellipse 100% 80% at 50% 0%, rgba(99, 102, 241, 0.1), transparent 60%),
      #000000
    `,
    transition: "background 2s ease-out",
  };

  const gridStyle = {
    backgroundImage: `
      linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
    `,
    backgroundSize: "80px 80px",
    transform: `translate(${mousePosition.x * 0.02}px, ${
      mousePosition.y * 0.02
    }px)`,
    animation: "gridFloat 20s linear infinite",
  };

  return (
    <div
      className={`min-h-screen w-full relative bg-black overflow-hidden ${
        !isMobile ? "cursor-none" : ""
      }`}
    >
      {/* Custom cursor - only render for non-mobile devices */}
      {mounted && !isMobile && (
        <div
          className="fixed w-6 h-6 bg-white/80 rounded-full pointer-events-none z-50 mix-blend-difference transition-transform duration-100 ease-out"
          style={{
            left: `${(mousePosition.x * window.innerWidth) / 100}px`,
            top: `${(mousePosition.y * window.innerHeight) / 100}px`,
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      <style jsx>{`
        @keyframes gridFloat {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(20px, 15px);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-30px);
            opacity: 0.8;
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes scroll {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(12px);
          }
        }
        .float-dot {
          animation: float 4s ease-in-out infinite;
        }
        .pulse-border {
          animation: pulse 3s ease-in-out infinite;
        }
        .scroll-dot {
          animation: scroll 2s ease-in-out infinite;
        }
      `}</style>

      <div className="absolute inset-0 z-0" style={containerStyle} />

      <div className="absolute inset-0 z-0 opacity-30" style={gridStyle} />

      <div className="absolute inset-0 z-10">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full float-dot"
            style={{
              left: `${15 + i * 8}%`,
              top: `${20 + ((i * 7) % 60)}%`,
              animationDelay: `${i * 0.3}s`,
              transform: `translateX(${
                mousePosition.x * 0.01 * (i % 2 === 0 ? 1 : -1)
              }px)`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 z-5 flex items-center justify-center pointer-events-none">
        <div
          className="text-[15rem] md:text-[25rem] lg:text-[30rem] font-bold text-white/5 select-none"
          style={{
            opacity: 1,
            transition: "opacity 2s ease-out 0.5s",
          }}
        >
          Shpalich
        </div>
      </div>

      <div className="relative z-20">
        <div className="flex flex-col items-center justify-center min-h-screen px-6 pt-20">
          <div className="text-center space-y-8 max-w-5xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 border-2 border-white/20 rounded-lg flex items-center justify-center mr-3">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-lg font-light text-white/60">
                  Shpal Docs
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[0.9] text-center">
                Shpal Docs
                <br />
                <span className="text-white/60">
                  Документация по настройке оборудования
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed text-center">
                Полный справочник по настройке, обслуживанию и устранению
                неисправностей принтеров для системы регистрации EXPOFORUM
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href={"/docs"}>
                <button
                  className={`px-8 py-4 bg-white text-black rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/20 active:scale-95 ${
                    !isMobile ? "cursor-none" : ""
                  }`}
                >
                  📚 Открыть документацию
                </button>
              </Link>

              <Link href="/docs/godex/godex-80x60">
                <button
                  className={`px-8 py-4 border-2 border-gray-600 rounded-lg font-semibold text-gray-300 hover:text-white hover:border-white hover:scale-105 transition-all duration-300 active:scale-95 ${
                    !isMobile ? "cursor-none" : ""
                  }`}
                >
                  🚀 Начать с GoDEX →
                </button>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-12 justify-center items-center mt-16 pt-12 border-t border-gray-800">
              {[
                { number: "4", label: "Руководства GoDEX" },
                { number: "3", label: "Руководства Zebra" },
                { number: "3", label: "Руководства Brother" },
                { number: "10+", label: "Всего инструкций" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 font-light">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-20 flex justify-center pb-8 top-10">
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center pulse-border">
            <div className="w-1 h-3 bg-white rounded-full mt-2 scroll-dot" />
          </div>
        </div>

        <section id="features" className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                О документации
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Полный справочник по настройке, обслуживанию и устранению
                неисправностей принтеров для системы регистрации EXPOFORUM
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Руководства по принтерам",
                  desc: "Подробные инструкции по настройке принтеров GoDEX, Zebra, Brother и других производителей с пошаговыми описаниями и иллюстрациями",
                  icon: <BookOpen className="w-6 h-6 text-white" />,
                  href: "/docs/godex/godex-80x60",
                },
                {
                  title: "Устранение неисправностей",
                  desc: "Решения типичных проблем, инструкции по обслуживанию и калибровке оборудования для поддержания работоспособности",
                  icon: <Wrench className="w-6 h-6 text-white" />,
                  href: "/docs/godex/godex-maintenance",
                },
                {
                  title: "Драйверы и утилиты",
                  desc: "Готовые пакеты драйверов, утилиты для диагностики и вспомогательные инструменты для работы с принтерами",
                  icon: <Download className="w-6 h-6 text-white" />,
                  href: "/docs/additional/drivers-godex",
                },
                {
                  title: "Скрипты и автоматизация",
                  desc: "PowerShell скрипты для автоматизации задач, исправления ошибок печати и оптимизации настроек Windows",
                  icon: <Code className="w-6 h-6 text-white" />,
                  href: "/docs/additional/spigf-scripts",
                },
                {
                  title: "История изменений",
                  desc: "Следите за обновлениями документации, новыми руководствами и улучшениями существующих инструкций",
                  icon: <FileText className="w-6 h-6 text-white" />,
                  href: "/docs/changelog",
                },
                {
                  title: "Быстрый поиск",
                  desc: "Удобная навигация по тегам, поиск по содержимому и структурированный каталог всех доступных руководств",
                  icon: <Zap className="w-6 h-6 text-white" />,
                  href: "/docs/tags",
                },
              ].map((feature, i) => (
                <Link
                  key={i}
                  href={feature.href}
                  className="group p-8 rounded-xl border border-gray-800 bg-gray-900/20 backdrop-blur-sm hover:border-gray-600 hover:scale-105 hover:bg-gray-900/30 hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-gray-100 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Быстрый доступ
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Популярные руководства и инструкции для быстрого старта
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "GoDEX",
                  desc: "Настройка принтеров этикеток Godex",
                  icon: <Settings className="w-5 h-5 text-blue-300" />,
                  href: "/docs/godex/godex-80x60",
                },
                {
                  title: "Zebra",
                  desc: "Настройка принтеров для печати бейджей",
                  icon: <Tag className="w-5 h-5 text-green-300" />,
                  href: "/docs/zebra/zebra-badges",
                },
                {
                  title: "Brother",
                  desc: "Настройка принтеров для саморегистрации",
                  icon: <Printer className="w-5 h-5 text-pink-300" />,
                  href: "/docs/brother/brother-samoreg",
                },
              ].map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="p-8 rounded-xl border border-gray-800 bg-gray-900/20 backdrop-blur-sm hover:border-gray-600 hover:scale-105 hover:bg-gray-900/30 transition-all duration-500"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-gray-800/50">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-20">
              <h3 className="text-3xl font-bold text-white mb-8 text-center">
                Популярные руководства
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Настройка печати Godex из Windows",
                    desc: "Пошаговая инструкция по настройке параметров печати",
                    icon: <Settings className="w-5 h-5 text-blue-300" />,
                    href: "/docs/godex/godex-80x60",
                  },
                  {
                    title: "Настройка Zebra для этикеток 80×60",
                    desc: "Инструкция по настройке принтера для белых этикеток",
                    icon: <Tag className="w-5 h-5 text-green-300" />,
                    href: "/docs/zebra/zebra-white",
                  },
                  {
                    title: "Сброс ошибки тонера Brother",
                    desc: "Решение проблемы с ошибками тонера",
                    icon: <Wrench className="w-5 h-5 text-pink-300" />,
                    href: "/docs/brother/brother-toner",
                  },
                  {
                    title: "Обслуживание принтеров Godex",
                    desc: "Очистка и устранение неисправностей",
                    icon: <Wrench className="w-5 h-5 text-orange-300" />,
                    href: "/docs/godex/godex-maintenance",
                  },
                ].map((guide, i) => (
                  <Link
                    key={i}
                    href={guide.href}
                    className="p-6 rounded-lg border border-gray-800 bg-gray-900/20 backdrop-blur-sm hover:border-gray-600 hover:bg-gray-900/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {guide.icon}
                      <span className="font-semibold text-white">
                        {guide.title}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{guide.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              Готовы начать?
            </h2>
            <p className="text-xl text-gray-400 mb-12 leading-relaxed">
              Выберите нужное руководство или воспользуйтесь поиском для
              быстрого доступа к информации
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/docs">
                <button
                  className={`px-12 py-6 bg-white text-black rounded-lg font-semibold text-xl hover:scale-105 hover:shadow-xl hover:shadow-white/30 transition-all duration-300 active:scale-95 ${
                    !isMobile ? "cursor-none" : ""
                  }`}
                >
                  📚 Открыть документацию
                </button>
              </Link>
              <Link href="/docs/downloads">
                <button
                  className={`px-12 py-6 border-2 border-gray-600 text-gray-300 rounded-lg font-semibold text-xl hover:border-white hover:text-white hover:scale-105 transition-all duration-300 active:scale-95 ${
                    !isMobile ? "cursor-none" : ""
                  }`}
                >
                  📥 Центр загрузок
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
