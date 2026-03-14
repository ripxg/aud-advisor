import { NextResponse } from "next/server";
import OpenAI from "openai";

// Lazy-load the OpenAI client to avoid build-time errors
function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.ZHIPU_API_KEY,
    baseURL: "https://open.bigmodel.cn/api/paas/v4",
  });
}

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

// Generate rule-based commentary when AI fails
function generateRuleBasedCommentary(summary: FinancialSummary): string {
  const sections: string[] = [];

  // Tax Optimisation
  const taxOptimisation: string[] = [];
  if (summary.effectiveTaxRate > 32) {
    taxOptimisation.push(
      "Your effective tax rate suggests significant potential for tax optimisation through salary sacrificing to superannuation and exploring negative gearing strategies on investment properties."
    );
  }
  if (summary.monthlySurplus > 3000) {
    taxOptimisation.push(
      "With your strong monthly surplus, consider maximising your concessional super contributions (currently $30,000 p.a. cap) to reduce your taxable income while building retirement wealth."
    );
  }
  if (!summary.hasPrivateHealth && summary.grossIncome > 93000) {
    taxOptimisation.push(
      "Without private health insurance and income above $93,000, you're likely paying Medicare Levy Surcharge. Private health cover may be more cost-effective."
    );
  }
  if (taxOptimisation.length === 0) {
    taxOptimisation.push(
      "Your current tax position appears reasonable. Continue to monitor for opportunities to maximise deductions and utilise available tax offsets."
    );
  }
  sections.push("## 1. Tax Optimisation Opportunities\n" + taxOptimisation.join(" "));

  // Investment Strategy
  const investmentStrategy: string[] = [];
  if (summary.netWorth < 100000 && summary.age > 35) {
    investmentStrategy.push(
      "Focus on building an emergency fund (3-6 months expenses) before expanding investments. A solid cash buffer provides security and flexibility."
    );
  } else if (summary.monthlySurplus > 0) {
    investmentStrategy.push(
      "Your positive cash flow enables regular investment. Consider a diversified approach mixing Australian shares (for franking credits), international exposure, and growth assets aligned with your risk profile."
    );
  }
  if (summary.riskProfile === "aggressive" && summary.yearsToRetirement > 15) {
    investmentStrategy.push(
      "Your long investment horizon supports growth-oriented assets. Consider maximising equity exposure while markets compound over time."
    );
  } else if (summary.riskProfile === "conservative") {
    investmentStrategy.push(
      "While capital preservation is important, ensure some growth allocation to protect against inflation eroding your purchasing power."
    );
  }
  if (investmentStrategy.length === 0) {
    investmentStrategy.push(
      "Maintain a diversified portfolio appropriate to your risk tolerance and investment timeline."
    );
  }
  sections.push("## 2. Investment Diversification Insights\n" + investmentStrategy.join(" "));

  // Key Risks
  const keyRisks: string[] = [];
  if (summary.hasHecsDebt && summary.hecsBalance && summary.hecsBalance > 0) {
    keyRisks.push(
      "Note that HECS/HELP repayments are mandatory once your income exceeds the threshold. This affects your take-home pay and should be factored into cash flow planning."
    );
  }
  if (summary.totalLiabilities > summary.totalAssets * 0.7) {
    keyRisks.push(
      "Your debt-to-asset ratio is elevated. Prioritise debt reduction, especially high-interest debts like credit cards and personal loans."
    );
  }
  if (summary.superBalance < summary.grossIncome) {
    keyRisks.push(
      "Your super balance relative to income suggests a need to boost retirement savings. Consider additional contributions while benefiting from compound growth."
    );
  }
  if (keyRisks.length === 0) {
    keyRisks.push(
      "No critical financial risks identified. Continue monitoring market conditions and maintain adequate insurance coverage for income protection."
    );
  }
  sections.push("## 3. Key Financial Risks\n" + keyRisks.join(" "));

  // Next Steps
  const nextSteps: string[] = [];
  nextSteps.push("- Review your superannuation fund fees and performance against benchmarks");
  if (summary.monthlySurplus > 3000) {
    nextSteps.push("- Explore maximising your $30,000 concessional super contribution cap");
  }
  if (!summary.hasPrivateHealth && summary.grossIncome > 90000) {
    nextSteps.push("- Compare private health insurance options to potentially reduce Medicare Levy Surcharge");
  }
  if (summary.effectiveTaxRate > 32) {
    nextSteps.push("- Consult with a tax accountant about salary sacrifice and negative gearing strategies");
  }
  nextSteps.push("- Ensure adequate income protection and life insurance coverage");
  nextSteps.push("- Review and update your estate planning documents (will, powers of attorney)");
  sections.push("## 4. Prioritised Next Steps\n" + nextSteps.slice(0, 5).join("\n"));

  // Disclaimer
  sections.push(
    "\n---\n**Important:** This is general information only and does not constitute personal financial advice. Your individual circumstances may differ. Please consult with a licensed financial adviser (AFSL holder) before making any financial decisions."
  );

  return sections.join("\n\n");
}

export async function POST(request: Request) {
  try {
    const summary: FinancialSummary = await request.json();

    const openai = getOpenAIClient();

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

    const systemMessage = "You are an Australian financial advisory AI assistant. Provide helpful general financial guidance based on Australian tax laws and financial regulations. Always remind users this is general advice only.";

    // Try glm-4.5-air first (cheapest)
    try {
      const completion = await openai.chat.completions.create({
        model: "glm-4-air",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      const commentary = completion.choices[0]?.message?.content;
      if (commentary) {
        return NextResponse.json({ commentary, model: "glm-4-air" });
      }
    } catch (error) {
      console.error("glm-4-air failed:", error);
    }

    // Fallback to glm-4.7
    try {
      const completion = await openai.chat.completions.create({
        model: "glm-4-plus",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      const commentary = completion.choices[0]?.message?.content;
      if (commentary) {
        return NextResponse.json({ commentary, model: "glm-4-plus" });
      }
    } catch (error) {
      console.error("glm-4-plus failed:", error);
    }

    // All AI models failed - use rule-based fallback
    console.log("All AI models failed, using rule-based commentary");
    const ruleBasedCommentary = generateRuleBasedCommentary(summary);
    return NextResponse.json({
      commentary: ruleBasedCommentary,
      model: "rule-based",
      fallback: true,
    });

  } catch (error) {
    console.error("Error generating commentary:", error);
    // Even on total failure, return rule-based commentary
    try {
      const summary: FinancialSummary = await request.clone().json();
      const ruleBasedCommentary = generateRuleBasedCommentary(summary);
      return NextResponse.json({
        commentary: ruleBasedCommentary,
        model: "rule-based",
        fallback: true,
      });
    } catch {
      // Absolute last resort - generic advice
      return NextResponse.json({
        commentary: `## General Financial Guidance

Based on your financial profile, here are key considerations:

## 1. Tax Optimisation
Review your superannuation contribution strategy. Concessional contributions (up to $30,000 p.a.) are taxed at 15%, often lower than your marginal rate.

## 2. Investment Strategy
Maintain diversification across asset classes. Australian shares offer franking credit benefits, while international exposure provides growth opportunities.

## 3. Key Risks
Ensure adequate emergency funds (3-6 months expenses) and appropriate insurance coverage including income protection.

## 4. Next Steps
- Review superannuation fund fees and performance
- Ensure estate planning documents are current
- Consider consulting a licensed financial adviser for personalised strategies

---
**Important:** This is general information only. Please consult with a licensed financial adviser (AFSL holder) for advice tailored to your circumstances.`,
        model: "static-fallback",
        fallback: true,
      });
    }
  }
}
