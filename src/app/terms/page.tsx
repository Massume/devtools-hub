'use client';

import { useI18n } from '@/lib/i18n-context';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function TermsPage() {
  const { locale } = useI18n();

  const content = {
    en: {
      title: 'Terms of Service',
      lastUpdated: 'Last updated: January 2025',
      sections: [
        {
          title: '1. Acceptance of Terms',
          content: 'By accessing and using DevTools Hub, you accept and agree to be bound by the terms and provision of this agreement.'
        },
        {
          title: '2. Use License',
          content: 'Permission is granted to temporarily use the tools provided on DevTools Hub for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.'
        },
        {
          title: '3. Disclaimer',
          content: 'The tools on DevTools Hub are provided on an "as is" basis. DevTools Hub makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.'
        },
        {
          title: '4. Limitations',
          content: 'In no event shall DevTools Hub or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the tools on DevTools Hub.'
        },
        {
          title: '5. Data Processing',
          content: 'All data processing happens locally in your browser. We do not store, transmit, or have access to any data you input into our tools. Your privacy is our priority.'
        },
        {
          title: '6. Accuracy of Materials',
          content: 'The tools appearing on DevTools Hub could include technical, typographical, or photographic errors. DevTools Hub does not warrant that any of the tools are accurate, complete or current.'
        },
        {
          title: '7. Links',
          content: 'DevTools Hub has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by DevTools Hub.'
        },
        {
          title: '8. Modifications',
          content: 'DevTools Hub may revise these terms of service at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.'
        },
        {
          title: '9. Open Source',
          content: 'DevTools Hub is open source software. You can view, fork, and contribute to the source code on GitHub. The project is provided under the MIT License.'
        },
        {
          title: '10. Contact',
          content: 'If you have any questions about these Terms, please contact us through our GitHub repository.'
        }
      ]
    },
    ru: {
      title: 'Условия использования',
      lastUpdated: 'Последнее обновление: Январь 2025',
      sections: [
        {
          title: '1. Принятие условий',
          content: 'Получая доступ и используя DevTools Hub, вы принимаете и соглашаетесь соблюдать условия и положения данного соглашения.'
        },
        {
          title: '2. Лицензия на использование',
          content: 'Предоставляется разрешение на временное использование инструментов DevTools Hub только для личного, некоммерческого использования. Это предоставление лицензии, а не передача права собственности.'
        },
        {
          title: '3. Отказ от гарантий',
          content: 'Инструменты DevTools Hub предоставляются "как есть". DevTools Hub не даёт никаких гарантий, явных или подразумеваемых, и настоящим отказывается от всех других гарантий, включая подразумеваемые гарантии товарной пригодности или пригодности для определённой цели.'
        },
        {
          title: '4. Ограничения',
          content: 'Ни при каких обстоятельствах DevTools Hub или его поставщики не несут ответственности за любой ущерб (включая убытки от потери данных или прибыли), возникший в результате использования или невозможности использования инструментов.'
        },
        {
          title: '5. Обработка данных',
          content: 'Вся обработка данных происходит локально в вашем браузере. Мы не храним, не передаём и не имеем доступа к данным, которые вы вводите в наши инструменты. Ваша конфиденциальность — наш приоритет.'
        },
        {
          title: '6. Точность материалов',
          content: 'Инструменты на DevTools Hub могут содержать технические, типографские или фотографические ошибки. DevTools Hub не гарантирует точность, полноту или актуальность инструментов.'
        },
        {
          title: '7. Ссылки',
          content: 'DevTools Hub не проверял все сайты, на которые есть ссылки, и не несёт ответственности за содержание таких сайтов. Наличие ссылки не означает одобрение со стороны DevTools Hub.'
        },
        {
          title: '8. Изменения',
          content: 'DevTools Hub может пересматривать данные условия в любое время без уведомления. Используя этот веб-сайт, вы соглашаетесь соблюдать текущую версию условий использования.'
        },
        {
          title: '9. Открытый исходный код',
          content: 'DevTools Hub — это программное обеспечение с открытым исходным кодом. Вы можете просматривать, форкать и вносить вклад в исходный код на GitHub. Проект предоставляется по лицензии MIT.'
        },
        {
          title: '10. Контакты',
          content: 'Если у вас есть вопросы об этих Условиях, свяжитесь с нами через наш репозиторий на GitHub.'
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
