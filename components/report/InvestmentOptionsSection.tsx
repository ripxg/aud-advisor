"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, X, ChevronDown, Star, Crown } from "lucide-react";
import type { FullFormData } from "@/lib/schemas";
import type { NetWorthBreakdown, CashFlowBreakdown } from "@/lib/projections";

interface InvestmentOptionsSectionProps {
  formData: FullFormData;
  netWorth: NetWorthBreakdown;
  cashFlow: CashFlowBreakdown;
}

interface InvestmentOption {
  id: string;
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  minimum: string;
  taxTreatment: string;
  taxDetails: string;
  bestFor: string;
  tier: 1 | 2 | 3;
}

const ALL_OPTIONS: InvestmentOption[] = [
  // Tier 1 - Core (everyone)
  {
    id: "asx-shares",
    name: "Australian Shares (ASX)",
    description: "Diversified exposure via ETFs (e.g., VAS, A200) or direct stocks",
    pros: [
      "Franking credits reduce effective tax",
      "Highly liquid with low-cost ETFs available",
      "Long-term returns ~9-10% p.a.",
      "Ownership in real businesses",
    ],
    cons: [
      "Market volatility",
      "Capital gains events on sale",
      "Emotional selling risk",
    ],
    minimum: "$500 (ETFs)",
    taxTreatment: "Dividends taxed at marginal rate; franking credits offset; CGT discount (50%) if held >12 months",
    taxDetails:
      "Fully franked dividends come with franking credits representing tax already paid by the company (30%). These credits reduce your tax payable. If your marginal rate is below 30%, you may receive a refund. Capital gains on shares held >12 months receive a 50% CGT discount before being added to taxable income.",
    bestFor: "All investors, especially salary earners (franking credits offset income tax)",
    tier: 1,
  },
  {
    id: "intl-shares",
    name: "International Shares",
    description: "Global diversification via ETFs (e.g., VGS, IWLD, IVV)",
    pros: [
      "Exposure to global growth (US tech, etc.)",
      "Diversification beyond Australian market",
      "Access to sectors underrepresented in ASX",
    ],
    cons: [
      "Currency risk (AUD/USD fluctuations)",
      "No franking credits",
      "Foreign tax implications on dividends",
    ],
    minimum: "$500",
    taxTreatment: "Dividends taxed at marginal rate (no franking); CGT applies with 50% discount if held >12 months",
    taxDetails:
      "Foreign dividends may have withholding tax deducted at source (e.g., 15% US withholding under tax treaty). You receive a foreign income tax offset for this. No franking credits apply. Capital gains follow standard Australian CGT rules with 50% discount for assets held >12 months.",
    bestFor: "Balanced and aggressive investors seeking global exposure",
    tier: 1,
  },
  {
    id: "hisa-td",
    name: "High-Interest Savings / Term Deposits",
    description: "APRA-regulated bank accounts or TDs at 4-5% p.a.",
    pros: [
      "Capital guaranteed (up to $250K APRA protection)",
      "Predictable, stable income",
      "No market risk",
    ],
    cons: [
      "Returns often below inflation after tax",
      "No growth component",
      "Interest fully taxable at marginal rate",
    ],
    minimum: "$0 (savings), $1,000+ (TDs)",
    taxTreatment: "Interest taxed at marginal rate — least tax-efficient vehicle",
    taxDetails:
      "All interest earned is added to your taxable income and taxed at your marginal rate. There are no tax offsets or discounts available. For someone on the 37% marginal rate, a 5% term deposit yields only 3.15% after tax — often below inflation. Consider this for emergency funds, not long-term wealth building.",
    bestFor: "Conservative investors or emergency fund allocation",
    tier: 1,
  },
  // Tier 2 - Intermediate
  {
    id: "investment-property",
    name: "Investment Property",
    description: "Residential or commercial property for rental income and capital growth",
    pros: [
      "Leverage amplifies returns",
      "Negative gearing tax deductions",
      "CGT discount on sale",
      "Tangible asset with intrinsic value",
    ],
    cons: [
      "Illiquid (slow to sell)",
      "High transaction costs (stamp duty, agent fees)",
      "Concentration risk in single asset",
      "Property management burden",
    ],
    minimum: "$50,000+ deposit typically",
    taxTreatment: "Rental income at marginal rate; interest deductible if negatively geared; CGT on sale (50% discount if >12 months)",
    taxDetails:
      "Rental income is taxable but offset by deductible expenses: interest, rates, insurance, repairs, depreciation. If expenses exceed income (negative gearing), the loss reduces your other taxable income. This benefits high-income earners most. On sale, capital gains receive the 50% CGT discount if held >12 months. Land tax applies in most states.",
    bestFor: "High-income earners who can absorb losses for tax deductions",
    tier: 2,
  },
  {
    id: "super-contributions",
    name: "Superannuation (Additional Contributions)",
    description: "Salary sacrifice or voluntary concessional contributions above employer minimum",
    pros: [
      "Contributions taxed at 15% (vs marginal rate)",
      "Earnings taxed at 15% in accumulation",
      "Tax-free in retirement (after 60)",
      "Forced savings discipline",
    ],
    cons: [
      "Locked until preservation age (~60)",
      "Contribution caps apply ($30K concessional / $120K non-concessional p.a. 2024-25)",
      "Rules change over time",
    ],
    minimum: "Any amount (within caps)",
    taxTreatment: "Most tax-effective long-term vehicle for high-income earners",
    taxDetails:
      "Concessional contributions (employer + salary sacrifice + personal deductible) are taxed at 15% on entry. Earnings within super are taxed at 15% (10% for long-term capital gains). In retirement phase (after 60), both withdrawals and earnings are tax-free. The 2024-25 concessional cap is $30,000. Unused cap can be carried forward for 5 years if your total super balance is under $500,000.",
    bestFor: "Everyone, especially those paying >32% marginal rate",
    tier: 2,
  },
  // Tier 3 - High Net Worth
  {
    id: "investment-bonds",
    name: "Investment Bonds (Insurance Bonds)",
    description: "Life insurance company tax-paid investment structures (e.g., Zurich, Generation Life, Australian Unity)",
    pros: [
      "Earnings taxed at 30% inside bond (not your marginal rate)",
      "After 10-year rule, withdrawals tax-free",
      "No CGT event on internal switching",
      "Estate planning benefits (non-estate asset)",
    ],
    cons: [
      "Returns may lag direct investment (management fees)",
      "10-year lock-in for full tax benefit",
      "Complex 125% contribution rule",
    ],
    minimum: "$5,000 typically",
    taxTreatment: "30% tax paid internally; tax-free after 10 years; estate planning advantages",
    taxDetails:
      "Investment bonds pay tax internally at 30%. After holding for 10 years, you can withdraw the entire amount tax-free — no CGT, no income tax. The 125% rule: you can add up to 125% of the previous year's contribution annually without resetting the 10-year period. Exceeding this resets the clock. Bonds pass outside your estate on death (nominated beneficiary), avoiding probate.",
    bestFor: "High-income earners, estate planning, generational wealth transfer",
    tier: 3,
  },
  {
    id: "lics-reits",
    name: "Listed Investment Companies / REITs",
    description: "ASX-listed diversified investment vehicles (e.g., AFI, ARG for LICs; Charter Hall, Dexus REITs)",
    pros: [
      "Professional management",
      "Diversification in single holding",
      "Dividends often franked (LICs)",
      "Real estate exposure without property management (REITs)",
    ],
    cons: [
      "Can trade at premium/discount to NTA",
      "Management fees",
      "Market-correlated like any listed security",
    ],
    minimum: "$500",
    taxTreatment: "Same as shares — dividends (often franked for LICs), CGT on sale",
    taxDetails:
      "LIC dividends are typically fully or partially franked, providing tax credits. Some LICs also pay LIC capital gains, which entitle you to a deduction. REITs often distribute income as 'tax-deferred' amounts, which reduce your cost base rather than being immediately taxable. This defers tax until you sell. Seek advice on AMIT attribution rules for managed vehicles.",
    bestFor: "Balanced/aggressive investors wanting managed diversification",
    tier: 3,
  },
  {
    id: "private-credit",
    name: "Private Credit / Debt Funds",
    description: "Non-bank lending funds providing fixed-income returns of 7-12% p.a. (e.g., Metrics Credit Partners, Revolution Asset Management)",
    pros: [
      "High yield (7-12% p.a.)",
      "Low correlation to equity markets",
      "Regular income distributions",
    ],
    cons: [
      "Illiquid (often locked 1-5 years)",
      "Credit/default risk",
      "Limited APRA oversight",
      "Wholesale investor threshold typically applies",
    ],
    minimum: "Often wholesale only ($2.5M assets or $250K income)",
    taxTreatment: "Income distributions taxed at marginal rate",
    taxDetails:
      "Distributions from private credit funds are typically treated as interest income, taxable at your marginal rate with no offsets or discounts. Some funds may distribute capital gains (50% discount applies). Ensure you understand the fund's tax statement format. These investments are generally suited to wholesale/sophisticated investors under Corporations Act definitions.",
    bestFor: "Wholesale investors (net assets >$2.5M or income >$250K)",
    tier: 3,
  },
];

export function InvestmentOptionsSection({
  formData,
  netWorth,
  cashFlow,
}: InvestmentOptionsSectionProps) {
  const grossIncome = formData.income.annualGrossSalary + formData.income.dividendIncome + formData.income.rentalIncome + formData.income.foreignIncome;
  const hasSurplus = cashFlow.monthlySurplus > 0;
  const isHighNetWorth = netWorth.netWorth > 500000 || grossIncome > 180000;
  const isWholesale = netWorth.netWorth > 2500000 || grossIncome > 250000;

  // Filter options based on user profile
  const getVisibleOptions = (): InvestmentOption[] => {
    let options = ALL_OPTIONS.filter((opt) => opt.tier === 1); // Always show Tier 1

    // Show Tier 2 if has surplus
    if (hasSurplus) {
      const tier2 = ALL_OPTIONS.filter((opt) => opt.tier === 2);
      // Only show investment property if grossIncome > 100000
      options = [
        ...options,
        ...tier2.filter(
          (opt) => opt.id !== "investment-property" || grossIncome > 100000
        ),
      ];
    }

    // Show Tier 3 for high net worth
    if (isHighNetWorth) {
      const tier3 = ALL_OPTIONS.filter((opt) => opt.tier === 3);
      // Filter private credit to wholesale only
      options = [
        ...options,
        ...tier3.filter((opt) => opt.id !== "private-credit" || isWholesale),
      ];
    }

    return options;
  };

  // Determine best options for this profile
  const getBestOptions = (): string[] => {
    const best: string[] = [];

    // Super contributions always good for high marginal rate
    const effectiveTaxRate = grossIncome > 0 
      ? ((grossIncome - (grossIncome - formData.income.annualGrossSalary * 0.7)) / grossIncome) * 100 
      : 0;
    
    if (effectiveTaxRate > 30 || grossIncome > 120000) {
      best.push("super-contributions");
    }

    // ASX shares for franking benefit if paying tax
    if (grossIncome > 45000) {
      best.push("asx-shares");
    }

    // Investment bonds for high income, estate planning
    if (grossIncome > 180000 && formData.personal.age < 55) {
      best.push("investment-bonds");
    }

    // Conservative profile = HISA recommendation
    if (formData.superannuation.riskProfile === "conservative") {
      best.push("hisa-td");
    }

    // Aggressive + long horizon = international shares
    if (formData.superannuation.riskProfile === "aggressive" && formData.personal.age < 45) {
      best.push("intl-shares");
    }

    return best.slice(0, 3);
  };

  const visibleOptions = getVisibleOptions();
  const bestOptionIds = getBestOptions();

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1:
        return "border-emerald-500/50";
      case 2:
        return "border-blue-500/50";
      case 3:
        return "border-amber-500/50";
      default:
        return "border-slate-600";
    }
  };

  const getTierBadge = (tier: number) => {
    switch (tier) {
      case 1:
        return null;
      case 2:
        return (
          <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30 text-xs">
            Intermediate
          </Badge>
        );
      case 3:
        return (
          <Badge className="bg-amber-600/20 text-amber-400 border-amber-500/30 text-xs flex items-center gap-1">
            <Crown className="w-3 h-3" /> Premium
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center gap-2">
          <span className="text-2xl">💰</span> Investment Options
          <span className="text-xs bg-slate-600/50 text-slate-300 px-2 py-1 rounded-full ml-2">
            Tailored to Your Profile
          </span>
        </CardTitle>
        <p className="text-slate-400 text-sm mt-2">
          Based on your net worth of ${netWorth.netWorth.toLocaleString()} and monthly surplus of ${cashFlow.monthlySurplus.toLocaleString()}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleOptions.map((option) => {
            const isBest = bestOptionIds.includes(option.id);
            return (
              <Card
                key={option.id}
                className={`bg-slate-900/50 border-2 ${getTierColor(option.tier)} relative overflow-hidden`}
              >
                {isBest && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-emerald-600/30 text-emerald-400 border-emerald-500/30 text-xs flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> Best for You
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-white">
                        {option.name}
                      </CardTitle>
                      {getTierBadge(option.tier)}
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mt-1">{option.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Pros */}
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Advantages</p>
                    <ul className="space-y-1">
                      {option.pros.slice(0, 3).map((pro, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                          <span className="text-slate-300">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cons */}
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Considerations</p>
                    <ul className="space-y-1">
                      {option.cons.slice(0, 2).map((con, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                          <span className="text-slate-300">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Info */}
                  <div className="pt-2 border-t border-slate-700/50 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Minimum:</span>
                      <span className="text-slate-300">{option.minimum}</span>
                    </div>
                  </div>

                  {/* Expandable Tax Details */}
                  <Accordion className="border-t border-slate-700/50 pt-2">
                    <AccordionItem className="border-none">
                      <AccordionTrigger className="py-2 text-sm text-slate-400 hover:text-white hover:no-underline">
                        <span className="flex items-center gap-2">
                          📋 Tax Treatment Details
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 text-sm">
                          <p className="text-emerald-400 font-medium">{option.taxTreatment}</p>
                          <p className="text-slate-400">{option.taxDetails}</p>
                          <p className="text-slate-500 italic mt-2">Best for: {option.bestFor}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tier Legend */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border-2 border-emerald-500/50"></div>
            <span className="text-slate-400">Core (Everyone)</span>
          </div>
          {hasSurplus && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded border-2 border-blue-500/50"></div>
              <span className="text-slate-400">Intermediate</span>
            </div>
          )}
          {isHighNetWorth && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded border-2 border-amber-500/50"></div>
              <span className="text-slate-400">Premium (High Net Worth)</span>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-slate-500 text-center mt-4">
          Investment options shown are for educational purposes. Performance varies. Consult a licensed financial adviser.
        </p>
      </CardContent>
    </Card>
  );
}
