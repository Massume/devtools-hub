'use client';

import { useI18n } from '@/lib/i18n-context';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPage() {
  const { locale } = useI18n();

  const content = {
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last updated: January 2025',
      intro: 'At DevTools Hub, we take your privacy seriously. This policy describes what data we collect, how we use it, and your rights regarding your information.',
      sections: [
        {
          title: 'Data Collection',
          content: 'DevTools Hub is designed with privacy as a core principle. All tools process data locally in your browser. We do not collect, store, or transmit any data you input into our tools.'
        },
        {
          title: 'Local Processing',
          content: 'When you use our tools (JSON formatter, Base64 encoder, UUID generator, etc.), all processing happens entirely in your browser. Your data never leaves your device. We have no access to the content you work with.'
        },
        {
          title: 'Analytics',
          content: 'We use Vercel Analytics and Speed Insights to understand how our website performs and how visitors interact with it. This includes anonymous data such as page views, browser type, and device type. No personal information or tool input data is collected.'
        },
        {
          title: 'Cookies',
          content: 'We use minimal cookies to remember your language preference and favorite tools. These are stored locally in your browser and are not shared with any third parties.'
        },
        {
          title: 'Third-Party Services',
          content: 'Our website is hosted on Vercel. We do not use any third-party tracking services, advertising networks, or data brokers. The only external requests are for hosting and analytics purposes.'
        },
        {
          title: 'Data Security',
          content: 'Since we don\'t collect your data, there\'s nothing to secure on our end. Your data stays on your device, under your control. We use HTTPS to ensure secure communication between your browser and our servers.'
        },
        {
          title: 'Open Source Transparency',
          content: 'DevTools Hub is open source. You can review our entire codebase on GitHub to verify our privacy practices. We believe transparency is the best privacy policy.'
        },
        {
          title: 'Your Rights',
          content: 'Since we don\'t collect personal data, there\'s no data to access, modify, or delete. You have complete control over any data stored locally in your browser through your browser\'s settings.'
        },
        {
          title: 'Children\'s Privacy',
          content: 'Our service does not address anyone under the age of 13. We do not knowingly collect any personal information from children.'
        },
        {
          title: 'Changes to This Policy',
          content: 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.'
        },
        {
          title: 'Contact Us',
          content: 'If you have any questions about this Privacy Policy, please contact us through our GitHub repository or via Telegram.'
        }
      ]
    },
    ru: {
      title: 'Политика конфиденциальности',
      lastUpdated: 'Последнее обновление: Январь 2025',
      intro: 'В DevTools Hub мы серьёзно относимся к вашей конфиденциальности. Эта политика описывает, какие данные мы собираем, как мы их используем и ваши права в отношении вашей информации.',
      sections: [
        {
          title: 'Сбор данных',
          content: 'DevTools Hub разработан с конфиденциальностью как основным принципом. Все инструменты обрабатывают данные локально в вашем браузере. Мы не собираем, не храним и не передаём данные, которые вы вводите в наши инструменты.'
        },
        {
          title: 'Локальная обработка',
          content: 'Когда вы используете наши инструменты (форматтер JSON, кодировщик Base64, генератор UUID и т.д.), вся обработка происходит полностью в вашем браузере. Ваши данные никогда не покидают ваше устройство. Мы не имеем доступа к контенту, с которым вы работаете.'
        },
        {
          title: 'Аналитика',
          content: 'Мы используем Vercel Analytics и Speed Insights для понимания производительности нашего сайта. Это включает анонимные данные, такие как просмотры страниц, тип браузера и тип устройства. Личная информация или данные инструментов не собираются.'
        },
        {
          title: 'Файлы cookie',
          content: 'Мы используем минимальные файлы cookie для запоминания вашего языка и избранных инструментов. Они хранятся локально в вашем браузере и не передаются третьим сторонам.'
        },
        {
          title: 'Сторонние сервисы',
          content: 'Наш сайт размещён на Vercel. Мы не используем сторонние сервисы отслеживания, рекламные сети или брокеры данных. Единственные внешние запросы — для хостинга и аналитики.'
        },
        {
          title: 'Безопасность данных',
          content: 'Поскольку мы не собираем ваши данные, нам нечего защищать. Ваши данные остаются на вашем устройстве под вашим контролем. Мы используем HTTPS для безопасного соединения.'
        },
        {
          title: 'Прозрачность открытого кода',
          content: 'DevTools Hub имеет открытый исходный код. Вы можете просмотреть весь наш код на GitHub, чтобы проверить наши практики конфиденциальности. Мы считаем, что прозрачность — лучшая политика конфиденциальности.'
        },
        {
          title: 'Ваши права',
          content: 'Поскольку мы не собираем персональные данные, нет данных для доступа, изменения или удаления. Вы полностью контролируете любые данные, хранящиеся локально в вашем браузере.'
        },
        {
          title: 'Конфиденциальность детей',
          content: 'Наш сервис не предназначен для лиц младше 13 лет. Мы сознательно не собираем личную информацию от детей.'
        },
        {
          title: 'Изменения в политике',
          content: 'Мы можем обновлять нашу Политику конфиденциальности время от времени. Мы уведомим вас о любых изменениях, опубликовав новую политику на этой странице.'
        },
        {
          title: 'Свяжитесь с нами',
          content: 'Если у вас есть вопросы об этой Политике конфиденциальности, свяжитесь с нами через наш репозиторий на GitHub или через Telegram.'
        }
      ]
    }
  };

  const t = content[locale];

  return (
    <div className="min-h-screen grid-bg flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
              {t.title}
            </h1>
            <p className="text-hub-muted text-sm">{t.lastUpdated}</p>
          </div>

          <div className="bg-hub-card border border-hub-border rounded-xl p-6 md:p-8 space-y-8">
            <p className="text-gray-300 leading-relaxed text-lg">
              {t.intro}
            </p>

            {t.sections.map((section, index) => (
              <section key={index}>
                <h2 className="text-xl font-semibold text-white mb-3">
                  {section.title}
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
