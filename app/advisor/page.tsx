"use client";

import { useFormStore } from "@/hooks/useFormStore";
import { PersonalStep } from "@/components/form/PersonalStep";
import { IncomeStep } from "@/components/form/IncomeStep";
import { ExpensesStep } from "@/components/form/ExpensesStep";
import { AssetsStep } from "@/components/form/AssetsStep";
import { LiabilitiesStep } from "@/components/form/LiabilitiesStep";
import { SuperannuationStep } from "@/components/form/SuperannuationStep";
import Link from "next/link";

export default function AdvisorPage() {
  const { currentStep } = useFormStore();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalStep />;
      case 2:
        return <IncomeStep />;
      case 3:
        return <ExpensesStep />;
      case 4:
        return <AssetsStep />;
      case 5:
        return <LiabilitiesStep />;
      case 6:
        return <SuperannuationStep />;
      default:
        return <PersonalStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <Link 
          href="/" 
          className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2"
        >
          ← Back to Home
        </Link>
        <h1 className="text-2xl font-bold text-white mt-4">
          Financial Health Check
        </h1>
        <p className="text-slate-400 mt-1">
          Complete the following steps to generate your personalised report
        </p>
      </div>

      {/* Form Steps */}
      {renderStep()}

      {/* General Advice Notice */}
      <div className="max-w-2xl mx-auto mt-8">
        <p className="text-slate-500 text-xs text-center">
          ⚠️ This tool provides general information only and does not constitute financial advice.
        </p>
      </div>
    </div>
  );
}
