"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { TaxBreakdown } from "@/lib/tax-calculator";

interface TaxBreakdownSectionProps {
  data: TaxBreakdown;
}

const COLORS = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444"];

export function TaxBreakdownSection({ data }: TaxBreakdownSectionProps) {
  const chartData = [
    { name: "Take-Home Pay", value: data.netIncome },
    { name: "Income Tax", value: data.incomeTax },
    { name: "Medicare Levy", value: data.medicareLevy },
    { name: "Medicare Surcharge", value: data.medicareLevySurcharge },
    { name: "HECS Repayment", value: data.hecsRepayment },
  ].filter((item) => item.value > 0);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(value);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tooltipFormatter = (value: any) => formatCurrency(Number(value));

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center gap-2">
          <span className="text-2xl">💰</span> Tax Breakdown (2024-25)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Chart */}
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={tooltipFormatter}
                  contentStyle={{ backgroundColor: "#1E293B", border: "1px solid #334155" }}
                  labelStyle={{ color: "#F8FAFC" }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-slate-300 text-sm">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Gross Income</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(data.grossIncome)}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Net Income</p>
                <p className="text-2xl font-bold text-emerald-400">{formatCurrency(data.netIncome)}</p>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Income Tax</span>
                <span className="text-white font-medium">{formatCurrency(data.incomeTax)}</span>
              </div>
              {data.lito > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-400">LITO Applied</span>
                  <span className="text-emerald-400 font-medium">-{formatCurrency(data.lito)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Medicare Levy</span>
                <span className="text-white font-medium">{formatCurrency(data.medicareLevy)}</span>
              </div>
              {data.medicareLevySurcharge > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Medicare Surcharge</span>
                  <span className="text-white font-medium">{formatCurrency(data.medicareLevySurcharge)}</span>
                </div>
              )}
              {data.hecsRepayment > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-400">HECS Repayment</span>
                  <span className="text-white font-medium">{formatCurrency(data.hecsRepayment)}</span>
                </div>
              )}
              <div className="border-t border-slate-700 pt-3 flex justify-between">
                <span className="text-slate-300 font-medium">Total Tax</span>
                <span className="text-white font-bold">{formatCurrency(data.totalTax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300 font-medium">Effective Rate</span>
                <span className="text-amber-400 font-bold">{data.effectiveTaxRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
