"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import type { NetWorthBreakdown, CashFlowBreakdown } from "@/lib/projections";

interface NetWorthSectionProps {
  netWorth: NetWorthBreakdown;
  cashFlow: CashFlowBreakdown;
}

export function NetWorthSection({ netWorth, cashFlow }: NetWorthSectionProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(value);

  const assetData = [
    { name: "Home", value: netWorth.assetBreakdown.primaryResidence, fill: "#10B981" },
    { name: "AU Shares", value: netWorth.assetBreakdown.domesticShares, fill: "#3B82F6" },
    { name: "Intl Shares", value: netWorth.assetBreakdown.internationalShares, fill: "#8B5CF6" },
    { name: "Investment", value: netWorth.assetBreakdown.investmentProperties, fill: "#F59E0B" },
    { name: "Cash", value: netWorth.assetBreakdown.cash, fill: "#06B6D4" },
  ].filter((item) => item.value > 0);

  const liabilityData = [
    { name: "Mortgage", value: netWorth.liabilityBreakdown.mortgage, fill: "#EF4444" },
    { name: "Inv. Loans", value: netWorth.liabilityBreakdown.investmentLoans, fill: "#F97316" },
    { name: "Personal", value: netWorth.liabilityBreakdown.personalLoans, fill: "#EC4899" },
    { name: "Credit Card", value: netWorth.liabilityBreakdown.creditCards, fill: "#DC2626" },
  ].filter((item) => item.value > 0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tooltipFormatter = (value: any) => formatCurrency(Number(value));

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center gap-2">
          <span className="text-2xl">📊</span> Net Worth & Cash Flow
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900/50 rounded-lg p-4 text-center">
            <p className="text-slate-400 text-sm">Total Assets</p>
            <p className="text-2xl font-bold text-emerald-400">{formatCurrency(netWorth.totalAssets)}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4 text-center">
            <p className="text-slate-400 text-sm">Total Liabilities</p>
            <p className="text-2xl font-bold text-red-400">{formatCurrency(netWorth.totalLiabilities)}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4 text-center">
            <p className="text-slate-400 text-sm">Net Worth</p>
            <p className={`text-2xl font-bold ${netWorth.netWorth >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {formatCurrency(netWorth.netWorth)}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Assets Chart */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Assets Breakdown</h4>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assetData} layout="vertical">
                  <XAxis type="number" tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" width={80} tick={{ fill: "#94A3B8", fontSize: 12 }} />
                  <Tooltip 
                    formatter={tooltipFormatter}
                    contentStyle={{ backgroundColor: "#1E293B", border: "1px solid #334155" }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {assetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Liabilities Chart */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Liabilities Breakdown</h4>
            {liabilityData.length > 0 ? (
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={liabilityData} layout="vertical">
                    <XAxis type="number" tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="name" width={80} tick={{ fill: "#94A3B8", fontSize: 12 }} />
                    <Tooltip 
                      formatter={tooltipFormatter}
                      contentStyle={{ backgroundColor: "#1E293B", border: "1px solid #334155" }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {liabilityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[250px] flex items-center justify-center bg-slate-900/30 rounded-lg">
                <p className="text-emerald-400 font-medium">🎉 No liabilities!</p>
              </div>
            )}
          </div>
        </div>

        {/* Cash Flow */}
        <div className="mt-8 bg-slate-900/50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Monthly Cash Flow</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-slate-400 text-sm">Monthly Net Income</p>
              <p className="text-xl font-bold text-white">{formatCurrency(cashFlow.monthlyNetIncome)}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Monthly Expenses</p>
              <p className="text-xl font-bold text-white">{formatCurrency(cashFlow.monthlyExpenses)}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Monthly Surplus</p>
              <p className={`text-xl font-bold ${cashFlow.monthlySurplus >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {formatCurrency(cashFlow.monthlySurplus)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
