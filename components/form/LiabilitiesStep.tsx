"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { liabilitiesSchema, type LiabilitiesData } from "@/lib/schemas";
import { useFormStore } from "@/hooks/useFormStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormWrapper } from "./FormWrapper";

export function LiabilitiesStep() {
  const { data, updateData, setStep, _hasHydrated } = useFormStore();

  const {
    register,

    handleSubmit,

    reset,
    formState: { errors },
  } = useForm<LiabilitiesData>({
    resolver: zodResolver(liabilitiesSchema),
    defaultValues: data.liabilities || {
      mortgageBalance: 0,
      investmentPropertyLoanBalance: 0,
      personalLoanBalance: 0,
      creditCardDebt: 0,
    },
  });

  useEffect(() => {
    if (_hasHydrated && data.liabilities) {
      reset(data.liabilities);
    }
  }, [_hasHydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = (formData: LiabilitiesData) => {
    updateData("liabilities", formData);
    setStep(6);
  };

  const liabilityFields = [
    { name: "mortgageBalance" as const, label: "Mortgage Balance", hint: "Outstanding home loan" },
    { name: "investmentPropertyLoanBalance" as const, label: "Investment Property Loans", hint: "Total outstanding investment loans" },
    { name: "personalLoanBalance" as const, label: "Personal Loans", hint: "Car loans, personal loans, etc." },
    { name: "creditCardDebt" as const, label: "Credit Card Debt", hint: "Total outstanding credit card balance" },
  ];

  return (
    <FormWrapper
      step={5}
      totalSteps={6}
      title="Liabilities"
      description="What do you owe?"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {liabilityFields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <Input
                id={field.name}
                type="number"
                {...register(field.name)}
                className="bg-slate-900/50 border-slate-600 pl-8"
                placeholder="0"
              />
            </div>
            <p className="text-xs text-slate-500">{field.hint}</p>
            {errors[field.name] && (
              <p className="text-red-400 text-sm">{errors[field.name]?.message}</p>
            )}
          </div>
        ))}

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(4)}
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Continue
          </Button>
        </div>
      </form>
    </FormWrapper>
  );
}
