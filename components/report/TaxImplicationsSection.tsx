"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AlertTriangle, TrendingUp, Info } from "lucide-react";
import type { FullFormData } from "@/lib/schemas";
import type { TaxBreakdown } from "@/lib/tax-calculator";
import type { NetWorthBreakdown } from "@/lib/projections";

interface TaxImplicationsSectionProps {
  formData: FullFormData;
  taxBreakdown: TaxBreakdown;
  netWorth: NetWorthBreakdown;
}

interface TaxRow {
  id: string;
  type: string;
  treatment: string;
  optimisation: string;
  show: boolean;
  highlight?: "opportunity" | "warning" | "info";
}

// HECS repayment rate lookup based on income
function getHecsRepaymentRate(income: number): number {
  if (income < 51550) return 0;
  if (income < 59518) return 1;
  if (income < 63089) return 2;
  if (income < 66875) return 2.5;
  if (income < 70888) return 3;
  if (income < 75140) return 3.5;
  if (income < 79649) return 4;
  if (income < 84429) return 4.5;
  if (income < 89494) return 5;
  if (income < 94865) return 5.5;
  if (income < 100557) return 6;
  if (income < 106590) return 6.5;
  if (income < 112985) return 7;
  if (income < 119764) return 7.5;
  if (income < 126950) return 8;
  if (income < 134568) return 8.5;
  if (income < 142642) return 9;
  if (income < 151200) return 9.5;
  return 10;
}

// Estimate years to repay HECS at current income
function estimateHecsYears(balance: number, income: number): number | null {
  const rate = getHecsRepaymentRate(income);
  if (rate === 0) return null;
  const annualRepayment = income * (rate / 100);
  if (annualRepayment <= 0) return null;
  return Math.ceil(balance / annualRepayment);
}

// Calculate estimated franking credit value
function estimateFrankingCredits(domesticShares: number): number {
  // Assume 4% dividend yield, 70% franked at 30% corporate rate
  const estimatedDividends = domesticShares * 0.04;
  const frankedAmount = estimatedDividends * 0.7;
  const frankingCredits = frankedAmount * (30 / 70);
  return frankingCredits;
}

export function TaxImplicationsSection({
  formData,
  taxBreakdown,
  netWorth,
}: TaxImplicationsSectionProps) {
  const grossIncome = taxBreakdown.grossIncome;
  const hasDomesticShares = formData.assets.domesticSharePortfolio > 0;
  const hasIntlShares = formData.assets.internationalSharePortfolio > 0;
  const hasRentalIncome = formData.income.rentalIncome > 0;
  const hasHecs = formData.personal.hasHecsDebt;
  const hecsBalance = formData.personal.hecsBalance || 0;
  const hasInvestmentProperty = formData.assets.investmentPropertyValues > 0;
  
  const frankingCreditEstimate = estimateFrankingCredits(formData.assets.domesticSharePortfolio);
  const hecsRepaymentRate = getHecsRepaymentRate(grossIncome);
  const hecsYearsEstimate = hasHecs && hecsBalance > 0 
    ? estimateHecsYears(hecsBalance, grossIncome) 
    : null;

  const taxRows: TaxRow[] = [
    {
      id: "salary",
      type: "Salary/Wages",
      treatment: `Marginal rate (${getMarginalRate(grossIncome)}%) + 2% Medicare Levy`,
      optimisation: "Salary sacrifice to super (15% tax vs marginal rate)",
      show: formData.income.annualGrossSalary > 0,
      highlight: grossIncome > 120000 ? "opportunity" : undefined,
    },
    {
      id: "dividends-domestic",
      type: "Dividends (Domestic)",
      treatment: "Marginal rate, offset by franking credits",
      optimisation: "Hold franked shares personally (not via company); time dividends for low-income years",
      show: hasDomesticShares || formData.income.dividendIncome > 0,
      highlight: hasDomesticShares ? "opportunity" : undefined,
    },
    {
      id: "dividends-intl",
      type: "Dividends (International)",
      treatment: "Marginal rate, no franking; withholding tax may apply at source",
      optimisation: "Foreign income tax offset available; consider Australian shares for better tax treatment",
      show: hasIntlShares,
    },
    {
      id: "rental",
      type: "Rental Income",
      treatment: "Marginal rate, offset by deductible expenses",
      optimisation: "Negative gearing if expenses > income; claim depreciation; review deductible repairs vs improvements",
      show: hasRentalIncome || hasInvestmentProperty,
      highlight: hasRentalIncome ? "info" : undefined,
    },
    {
      id: "cgt",
      type: "Capital Gains (held >12m)",
      treatment: "50% discount, then added to taxable income at marginal rate",
      optimisation: "Delay sale to lower-income year; donate appreciated assets to DGR; use CGT exemptions",
      show: hasDomesticShares || hasIntlShares || hasInvestmentProperty,
    },
    {
      id: "super-accum",
      type: "Super (Accumulation)",
      treatment: "15% tax on contributions and earnings",
      optimisation: "Maximise concessional contributions ($30K cap); carry forward unused caps",
      show: true,
      highlight: grossIncome > 120000 ? "opportunity" : undefined,
    },
    {
      id: "super-retire",
      type: "Super (In Retirement)",
      treatment: "Tax-free withdrawals and earnings after age 60",
      optimisation: "Transition-to-retirement strategies; consider timing of accessing super",
      show: formData.personal.age >= 55,
    },
    {
      id: "hecs",
      type: "HECS/HELP",
      treatment: `Income-contingent repayment at ${hecsRepaymentRate}% of income`,
      optimisation: "Voluntary repayments reduce indexation impact; mandatory before extra super/investing",
      show: hasHecs,
      highlight: "warning",
    },
    {
      id: "investment-bond",
      type: "Investment Bonds",
      treatment: "30% internal tax rate; tax-free withdrawals after 10 years",
      optimisation: "Use for estate planning; tax-effective for those on >30% marginal rate; observe 125% rule",
      show: grossIncome > 180000 || netWorth.netWorth > 500000,
      highlight: "opportunity",
    },
  ];

  const visibleRows = taxRows.filter((row) => row.show);

  const showBucketCompanyNote = netWorth.netWorth > 1000000;
  const showNegativeGearingNote = grossIncome > 120000 && !hasInvestmentProperty;

  function getMarginalRate(income: number): number {
    if (income <= 18200) return 0;
    if (income <= 45000) return 19;
    if (income <= 120000) return 32.5;
    if (income <= 180000) return 37;
    return 45;
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center gap-2">
          <span className="text-2xl">🧾</span> Tax Implications
          <span className="text-xs bg-slate-600/50 text-slate-300 px-2 py-1 rounded-full ml-2">
            Your Effective Rate: {taxBreakdown.effectiveTaxRate.toFixed(1)}%
          </span>
        </CardTitle>
        <p className="text-slate-400 text-sm mt-2">
          How your income and assets are taxed, with optimisation opportunities
        </p>
      </CardHeader>
      <CardContent>
        {/* Tax Treatment Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-2 text-slate-400 font-medium">Income/Asset Type</th>
                <th className="text-left py-3 px-2 text-slate-400 font-medium">Tax Treatment</th>
                <th className="text-left py-3 px-2 text-slate-400 font-medium">Optimisation</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr
                  key={row.id}
                  className={`border-b border-slate-700/50 ${
                    row.highlight === "opportunity"
                      ? "bg-emerald-900/10"
                      : row.highlight === "warning"
                      ? "bg-amber-900/10"
                      : ""
                  }`}
                >
                  <td className="py-3 px-2 text-white">
                    <div className="flex items-center gap-2">
                      {row.type}
                      {row.highlight === "opportunity" && (
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      )}
                      {row.highlight === "warning" && (
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      )}
                      {row.highlight === "info" && (
                        <Info className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-slate-300">{row.treatment}</td>
                  <td className="py-3 px-2">
                    <span className="text-emerald-400">{row.optimisation}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Additional Insights */}
        <div className="mt-6 space-y-4">
          {/* Franking Credits Estimate */}
          {hasDomesticShares && frankingCreditEstimate > 0 && (
            <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-400 mt-0.5" />
                <div>
                  <h4 className="text-emerald-400 font-medium">Estimated Franking Credits</h4>
                  <p className="text-slate-300 text-sm mt-1">
                    Based on your ${formData.assets.domesticSharePortfolio.toLocaleString()} domestic share portfolio, 
                    you may receive approximately <strong>${Math.round(frankingCreditEstimate).toLocaleString()}</strong> in 
                    franking credits annually (assuming 4% yield, 70% franked).
                  </p>
                  <p className="text-slate-400 text-xs mt-2">
                    Franking credits directly reduce your tax payable. If your marginal rate is below 30%, 
                    you may receive a refund of excess credits.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* HECS Repayment Info */}
          {hasHecs && hecsBalance > 0 && (
            <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                <div>
                  <h4 className="text-amber-400 font-medium">HECS/HELP Repayment Status</h4>
                  <p className="text-slate-300 text-sm mt-1">
                    Balance: <strong>${hecsBalance.toLocaleString()}</strong> | 
                    Repayment rate: <strong>{hecsRepaymentRate}%</strong> | 
                    Annual repayment: <strong>${Math.round(grossIncome * hecsRepaymentRate / 100).toLocaleString()}</strong>
                  </p>
                  {hecsYearsEstimate && (
                    <p className="text-slate-400 text-sm mt-1">
                      At current income, estimated <strong>~{hecsYearsEstimate} years</strong> to repay 
                      (excluding indexation).
                    </p>
                  )}
                  <p className="text-slate-400 text-xs mt-2">
                    HECS repayments are mandatory and reduce take-home pay. Factor this into cash flow planning.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Structure Notes */}
          <Accordion>
            {showBucketCompanyNote && (
              <AccordionItem className="border-slate-700">
                <AccordionTrigger className="text-slate-300 hover:text-white">
                  <span className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-400" />
                    Bucket Company / Family Trust (Net Worth &gt;$1M)
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-sm text-slate-400 space-y-2">
                    <p>
                      With net worth exceeding $1M, you may benefit from advanced tax structures:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      <li>
                        <strong>Bucket Company:</strong> Park excess income in a company taxed at 25-30%, 
                        withdraw later when in lower tax bracket
                      </li>
                      <li>
                        <strong>Family Trust:</strong> Distribute income to lower-earning family members; 
                        asset protection benefits; CGT planning
                      </li>
                    </ul>
                    <p className="text-amber-400 mt-2">
                      ⚠️ These are complex structures with compliance requirements. Consult a tax accountant 
                      specialising in high-net-worth clients.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {showNegativeGearingNote && (
              <AccordionItem className="border-slate-700">
                <AccordionTrigger className="text-slate-300 hover:text-white">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Negative Gearing Opportunity
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-sm text-slate-400 space-y-2">
                    <p>
                      With income over $120,000 and no existing investment property, negative gearing 
                      could provide meaningful tax benefits:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      <li>Deduct property expenses (interest, depreciation, maintenance) against your income</li>
                      <li>At your marginal rate of {getMarginalRate(grossIncome)}%, each $1,000 loss saves ${getMarginalRate(grossIncome) * 10} in tax</li>
                      <li>Capital growth potential on the underlying asset</li>
                    </ul>
                    <p className="text-slate-300 mt-2">
                      <strong>Example:</strong> A property with $10,000 annual loss would save 
                      ~${getMarginalRate(grossIncome) * 100} in tax while building equity.
                    </p>
                    <p className="text-amber-400 mt-2">
                      ⚠️ Investment property carries risks including vacancy, maintenance, interest rate rises, 
                      and illiquidity. Ensure adequate cash reserves.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-slate-500 text-center mt-6">
          Tax information is based on 2024-25 ATO rates and is general in nature. 
          Individual circumstances vary. Consult a registered tax agent for personalised advice.
        </p>
      </CardContent>
    </Card>
  );
}
