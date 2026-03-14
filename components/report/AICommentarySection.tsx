"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { FullFormData } from "@/lib/schemas";
import type { TaxBreakdown } from "@/lib/tax-calculator";
import type { NetWorthBreakdown, CashFlowBreakdown, SuperProjection } from "@/lib/projections";

interface AICommentarySectionProps {
  formData: FullFormData;
  taxBreakdown: TaxBreakdown;
  netWorth: NetWorthBreakdown;
  cashFlow: CashFlowBreakdown;
  superProjection: SuperProjection;
}

export function AICommentarySection({
  formData,
  taxBreakdown,
  netWorth,
  cashFlow,
  superProjection,
}: AICommentarySectionProps) {
  const [commentary, setCommentary] = useState<string | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommentary = async () => {
      try {
        const response = await fetch("/api/generate-commentary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            age: formData.personal.age,
            grossIncome: taxBreakdown.grossIncome,
            netIncome: taxBreakdown.netIncome,
            totalTax: taxBreakdown.totalTax,
            effectiveTaxRate: taxBreakdown.effectiveTaxRate,
            hasPrivateHealth: formData.personal.hasPrivateHealthInsurance,
            hasHecsDebt: formData.personal.hasHecsDebt,
            hecsBalance: formData.personal.hecsBalance,
            netWorth: netWorth.netWorth,
            totalAssets: netWorth.totalAssets,
            totalLiabilities: netWorth.totalLiabilities,
            monthlyExpenses: cashFlow.monthlyExpenses,
            monthlySurplus: cashFlow.monthlySurplus,
            superBalance: superProjection.currentBalance,
            superProjectedBalance: superProjection.projectedBalance,
            yearsToRetirement: superProjection.yearsToRetirement,
            riskProfile: formData.superannuation.riskProfile,
          }),
        });

        if (!response.ok) throw new Error("Failed to fetch commentary");

        const data = await response.json();
        setCommentary(data.commentary);
        setModel(data.model || "unknown");
        setIsFallback(data.fallback || false);
      } catch (err) {
        setError("Unable to generate AI commentary at this time.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommentary();
  }, [formData, taxBreakdown, netWorth, cashFlow, superProjection]);

  const formatCommentary = (text: string) => {
    // Split into sections and format
    const lines = text.split("\n");
    return lines.map((line, index) => {
      // Headers (numbered sections or bold markers or ## headers)
      if (line.match(/^#+\s/) || line.match(/^\d+\.\s+[A-Z]/) || line.match(/^\*\*[^*]+\*\*/)) {
        const cleanLine = line.replace(/^#+\s*/, "").replace(/\*\*/g, "");
        return (
          <h4 key={index} className="text-lg font-semibold text-emerald-400 mt-6 mb-2 first:mt-0">
            {cleanLine}
          </h4>
        );
      }
      // Bullet points
      if (line.match(/^[-•]\s/)) {
        return (
          <li key={index} className="text-slate-300 ml-4 mb-1">
            {line.replace(/^[-•]\s/, "")}
          </li>
        );
      }
      // Horizontal rules / dividers
      if (line.match(/^---+$/)) {
        return <hr key={index} className="border-slate-700 my-4" />;
      }
      // Regular paragraphs
      if (line.trim()) {
        // Handle bold text within paragraphs
        const formattedLine = line.split(/\*\*([^*]+)\*\*/).map((part, i) => 
          i % 2 === 1 ? <strong key={i} className="text-white">{part}</strong> : part
        );
        return (
          <p key={index} className="text-slate-300 mb-3">
            {formattedLine}
          </p>
        );
      }
      return null;
    });
  };

  const getModelBadge = () => {
    if (!model) return null;
    
    if (isFallback) {
      return (
        <Badge className="bg-amber-600/20 text-amber-400 border-amber-500/30 text-xs ml-2">
          Rule-Based Analysis
        </Badge>
      );
    }
    
    const modelDisplay = model === "glm-4-air" ? "GLM-4 Air" 
      : model === "glm-4-plus" ? "GLM-4 Plus"
      : model;
    
    return (
      <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/30 text-xs ml-2">
        Powered by {modelDisplay}
      </Badge>
    );
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center gap-2 flex-wrap">
          <span className="text-2xl">🤖</span> AI Advisory Commentary
          {!loading && getModelBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4 bg-slate-700" />
            <Skeleton className="h-4 w-full bg-slate-700" />
            <Skeleton className="h-4 w-full bg-slate-700" />
            <Skeleton className="h-4 w-5/6 bg-slate-700" />
            <Skeleton className="h-6 w-2/3 bg-slate-700 mt-6" />
            <Skeleton className="h-4 w-full bg-slate-700" />
            <Skeleton className="h-4 w-4/5 bg-slate-700" />
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none">
            {isFallback && (
              <div className="bg-amber-900/10 border border-amber-700/30 rounded-lg p-3 mb-4">
                <p className="text-amber-400 text-sm">
                  📊 This analysis was generated using our rule-based engine based on Australian financial best practices.
                </p>
              </div>
            )}
            {formatCommentary(commentary || "")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
