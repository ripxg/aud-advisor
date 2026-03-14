"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFormStore } from "@/hooks/useFormStore";
import { calculateTaxBreakdown } from "@/lib/tax-calculator";
import { calculateNetWorth, calculateCashFlow, projectWealthDetailed, projectSuperannuation } from "@/lib/projections";
import { TaxBreakdownSection } from "@/components/report/TaxBreakdownSection";
import { NetWorthSection } from "@/components/report/NetWorthSection";
import { ProjectionsSection } from "@/components/report/ProjectionsSection";
import { SuperSection } from "@/components/report/SuperSection";
import { AICommentarySection } from "@/components/report/AICommentarySection";
import { DisclaimerSection } from "@/components/report/DisclaimerSection";
import { Button } from "@/components/ui/button";
import type { FullFormData } from "@/lib/schemas";

export default function ReportPage() {
  const router = useRouter();
  const { data, isComplete, resetForm } = useFormStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isComplete()) {
      router.push("/advisor");
    }
  }, [mounted, isComplete, router]);

  if (!mounted || !isComplete()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const formData = data as FullFormData;
  const taxBreakdown = calculateTaxBreakdown(formData);
  const netWorth = calculateNetWorth(formData);
  const cashFlow = calculateCashFlow(formData);
  const wealthProjections = projectWealthDetailed(formData);
  const superProjection = projectSuperannuation(formData);

  const handleStartOver = () => {
    resetForm();
    router.push("/advisor");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/advisor"
            className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2"
          >
            ← Edit My Details
          </Link>
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Your Financial Health Report
              </h1>
              <p className="text-slate-400 mt-1">
                Generated for a {formData.personal.age}-year-old {formData.personal.state} resident
              </p>
            </div>
            <Button
              onClick={handleStartOver}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Start Over
            </Button>
          </div>
        </div>

        {/* Report Sections */}
        <div className="space-y-8">
          {/* Section A: Tax Breakdown */}
          <TaxBreakdownSection data={taxBreakdown} />

          {/* Section B: Net Worth & Cash Flow */}
          <NetWorthSection netWorth={netWorth} cashFlow={cashFlow} />

          {/* Section C: Investment Projections */}
          <ProjectionsSection projections={wealthProjections} />

          {/* Section D: Superannuation Outlook */}
          <SuperSection
            projection={superProjection}
            riskProfile={formData.superannuation.riskProfile}
          />

          {/* Section E: AI Commentary */}
          <AICommentarySection
            formData={formData}
            taxBreakdown={taxBreakdown}
            netWorth={netWorth}
            cashFlow={cashFlow}
            superProjection={superProjection}
          />

          {/* Section F: Disclaimer */}
          <DisclaimerSection />
        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleStartOver}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            Generate New Report
          </Button>
          <Link href="/">
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 w-full"
            >
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-slate-500 text-sm">
          <p>AUD Advisor — Australian Financial & Tax Advisory Tool</p>
          <p className="mt-1">Tax calculations based on ATO 2024-25 rates</p>
        </footer>
      </div>
    </div>
  );
}
