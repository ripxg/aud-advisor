"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SuperProjection } from "@/lib/projections";

interface SuperSectionProps {
  projection: SuperProjection;
  riskProfile: string;
}

export function SuperSection({ projection, riskProfile }: SuperSectionProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(value);

  const riskProfileLabel = {
    conservative: "Conservative (5%)",
    balanced: "Balanced (7.5%)",
    aggressive: "Aggressive (10%)",
  }[riskProfile] || riskProfile;

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center gap-2">
          <span className="text-2xl">🏦</span> Superannuation Outlook
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Current State */}
          <div className="space-y-6">
            <div className="bg-slate-900/50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Current Position</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm">Current Super Balance</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(projection.currentBalance)}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Risk Profile</p>
                  <p className="text-lg font-medium text-emerald-400">{riskProfileLabel}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Years to Retirement</p>
                  <p className="text-lg font-medium text-white">{projection.yearsToRetirement} years</p>
                </div>
              </div>
            </div>
          </div>

          {/* Projection */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-900/30 to-slate-900/50 rounded-lg p-6 border border-emerald-700/30">
              <h4 className="text-lg font-semibold text-emerald-400 mb-4">At Retirement</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm">Projected Balance</p>
                  <p className="text-3xl font-bold text-emerald-400">{formatCurrency(projection.projectedBalance)}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Estimated Annual Income (4% Rule)</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(projection.estimatedAnnualIncome)}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Monthly Retirement Income</p>
                  <p className="text-xl font-bold text-white">{formatCurrency(projection.monthlyIncome)}/month</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
          <p className="text-blue-300 text-sm">
            <strong>Note:</strong> The 4% rule suggests you can safely withdraw 4% of your retirement balance annually. 
            This projection assumes consistent returns matching your risk profile and continued annual contributions of your current rate. 
            Actual results may vary based on market conditions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
