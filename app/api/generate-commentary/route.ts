import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.ZHIPU_API_KEY,
  baseURL: "https://open.bigmodel.cn/api/paas/v4",
});

interface FinancialSummary {
  age: number;
  grossIncome: number;
  netIncome: number;
  totalTax: number;
  effectiveTaxRate: number;
  hasPrivateHealth: boolean;
  hasHecsDebt: boolean;
  hecsBalance?: number;
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  monthlyExpenses: number;
  monthlySurplus: number;
  superBalance: number;
  superProjectedBalance: number;
  yearsToRetirement: number;
  riskProfile: string;
}

export async function POST(request: Request) {
  try {
    const summary: FinancialSummary = await request.json();

    const prompt = `You are an experienced Australian financial advisor providing general advice. Based on the following financial profile, provide helpful commentary on:

1. Tax Optimisation Opportunities
2. Investment Diversification Insights  
3. Key Financial Risks
4. 3-5 Prioritised Next Steps

Financial Profile:
- Age: ${summary.age}
- Gross Annual Income: $${summary.grossIncome.toLocaleString()}
- Net Annual Income: $${summary.netIncome.toLocaleString()}
- Total Tax Burden: $${summary.totalTax.toLocaleString()} (${summary.effectiveTaxRate.toFixed(1)}% effective rate)
- Private Health Insurance: ${summary.hasPrivateHealth ? "Yes" : "No"}
- HECS/HELP Debt: ${summary.hasHecsDebt ? `Yes ($${summary.hecsBalance?.toLocaleString() || "unknown"})` : "No"}
- Net Worth: $${summary.netWorth.toLocaleString()}
- Total Assets: $${summary.totalAssets.toLocaleString()}
- Total Liabilities: $${summary.totalLiabilities.toLocaleString()}
- Monthly Expenses: $${summary.monthlyExpenses.toLocaleString()}
- Monthly Cash Surplus: $${summary.monthlySurplus.toLocaleString()}
- Current Super Balance: $${summary.superBalance.toLocaleString()}
- Projected Super at Retirement: $${summary.superProjectedBalance.toLocaleString()}
- Years to Retirement: ${summary.yearsToRetirement}
- Investment Risk Profile: ${summary.riskProfile}

Please provide practical, actionable advice in a professional but accessible tone. Use Australian financial terminology and reference relevant Australian regulations where appropriate. Keep each section concise (2-3 sentences).

IMPORTANT: This is general advice only. Always recommend consulting with a licensed financial adviser for personalised advice.`;

    const completion = await openai.chat.completions.create({
      model: "glm-5",
      messages: [
        {
          role: "system",
          content: "You are an Australian financial advisory AI assistant. Provide helpful general financial guidance based on Australian tax laws and financial regulations. Always remind users this is general advice only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const commentary = completion.choices[0]?.message?.content || "Unable to generate commentary at this time.";

    return NextResponse.json({ commentary });
  } catch (error) {
    console.error("Error generating commentary:", error);
    return NextResponse.json(
      { error: "Failed to generate AI commentary" },
      { status: 500 }
    );
  }
}
