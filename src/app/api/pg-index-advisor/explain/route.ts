import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { ExplainRequest, ExplainResponse } from '@/types/plan';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json<ExplainResponse>(
        {
          success: false,
          error: 'AI объяснения временно недоступны',
        },
        { status: 503 }
      );
    }

    const body: ExplainRequest = await request.json();
    const { plan, recommendations, lang = 'en' } = body;

    const prompt = lang === 'ru'
      ? `Ты эксперт по оптимизации PostgreSQL. Объясни простым языком этот план выполнения запроса.

План выполнения:
${JSON.stringify(plan, null, 2)}

Найденные проблемы:
${recommendations.map(r => `- ${r.title}: ${r.issue}`).join('\n')}

Объясни кратко:
1. Что делает запрос (2-3 предложения)
2. Где главные проблемы с производительностью
3. Конкретные шаги для оптимизации

Отвечай на русском языке. Будь кратким и практичным. Не используй markdown заголовки.`
      : `You are a PostgreSQL optimization expert. Explain this query execution plan in simple terms.

Execution plan:
${JSON.stringify(plan, null, 2)}

Issues found:
${recommendations.map(r => `- ${r.titleEn}: ${r.issueEn}`).join('\n')}

Explain briefly:
1. What the query does (2-3 sentences)
2. Where the main performance issues are
3. Specific steps for optimization

Be concise and practical. Don't use markdown headers.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });

    const explanation = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    return NextResponse.json<ExplainResponse>({
      success: true,
      explanation,
    });

  } catch (error) {
    console.error('AI explain error:', error);
    return NextResponse.json<ExplainResponse>(
      {
        success: false,
        error: 'Ошибка AI анализа',
      },
      { status: 500 }
    );
  }
}
