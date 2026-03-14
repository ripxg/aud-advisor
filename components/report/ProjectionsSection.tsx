"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { WealthProjection } from "@/lib/projections";

interface ProjectionsSectionProps {
  projections: WealthProjection[];
}

export function ProjectionsSection({ projections }: ProjectionsSectionProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(value);

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value}`;
  };

  // Filter to show key years for table
  const keyYears = projections.filter((p) => [0, 10, 20, 30].includes(p.year));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tooltipFormatter = (value: any) => formatCurrency(Number(value));

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center gap-2">
          <span className="text-2xl">📈</span> Investment Projections
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-400 mb-6">
          Projected wealth growth over 30 years based on your current investable assets and monthly surplus contributions.
        </p>

        {/* Chart */}
        <div className="h-[350px] mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projections}>
              <XAxis 
                dataKey="year" 
                tickFormatter={(v) => `Year ${v}`}
                tick={{ fill: "#94A3B8", fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={formatYAxis}
                tick={{ fill: "#94A3B8", fontSize: 12 }}
                width={80}
              />
              <Tooltip 
                formatter={tooltipFormatter}
                labelFormatter={(label) => `Year ${label}`}
                contentStyle={{ backgroundColor: "#1E293B", border: "1px solid #334155" }}
                labelStyle={{ color: "#F8FAFC" }}
              />
              <Legend 
                verticalAlign="top"
                height={36}
                formatter={(value) => <span className="text-slate-300">{value}</span>}
              />
              <Line 
                type="monotone" 
                dataKey="conservative" 
                name="Conservative (5%)"
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="balanced" 
                name="Balanced (7.5%)"
                stroke="#10B981" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="aggressive" 
                name="Aggressive (10%)"
                stroke="#F59E0B" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Year</th>
                <th className="text-right py-3 px-4 text-blue-400 font-medium">Conservative</th>
                <th className="text-right py-3 px-4 text-emerald-400 font-medium">Balanced</th>
                <th className="text-right py-3 px-4 text-amber-400 font-medium">Aggressive</th>
              </tr>
            </thead>
            <tbody>
              {keyYears.map((row) => (
                <tr key={row.year} className="border-b border-slate-700/50">
                  <td className="py-3 px-4 text-white font-medium">
                    {row.year === 0 ? "Now" : `Year ${row.year}`}
                  </td>
                  <td className="text-right py-3 px-4 text-slate-300">{formatCurrency(row.conservative)}</td>
                  <td className="text-right py-3 px-4 text-slate-300">{formatCurrency(row.balanced)}</td>
                  <td className="text-right py-3 px-4 text-slate-300">{formatCurrency(row.aggressive)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
