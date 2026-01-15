import { NextRequest, NextResponse } from 'next/server';
import { parsePlan } from '@/lib/parser/index';
import { analyze } from '@/lib/analyzer/index';
import { AnalyzeResponse } from '@/types/plan';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, format = 'auto' } = body;

    if (!plan || typeof plan !== 'string') {
      return NextResponse.json<AnalyzeResponse>(
        {
          success: false,
          error: 'План не указан',
          errorEn: 'Plan not provided',
        },
        { status: 400 }
      );
    }

    // Parse the plan
    let parseResult;
    try {
      parseResult = parsePlan(plan, format);
    } catch (parseError) {
      return NextResponse.json<AnalyzeResponse>(
        {
          success: false,
          error: 'Неверный формат плана. Убедитесь что это вывод EXPLAIN ANALYZE.',
          errorEn: 'Invalid plan format. Make sure this is EXPLAIN ANALYZE output.',
        },
        { status: 400 }
      );
    }

    const { plan: parsedPlan, executionTime, planningTime } = parseResult;

    // Analyze the plan
    const { recommendations, summary } = analyze(parsedPlan, executionTime, planningTime);

    return NextResponse.json<AnalyzeResponse>({
      success: true,
      data: {
        plan: parsedPlan,
        summary,
        recommendations,
        rawPlan: plan,
      },
    });

  } catch (error) {
    console.error('Analyze error:', error);
    return NextResponse.json<AnalyzeResponse>(
      {
        success: false,
        error: 'Ошибка при анализе плана',
        errorEn: 'Error analyzing plan',
      },
      { status: 500 }
    );
  }
}
