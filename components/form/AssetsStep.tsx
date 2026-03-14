"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assetsSchema, type AssetsData } from "@/lib/schemas";
import { useFormStore } from "@/hooks/useFormStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormWrapper } from "./FormWrapper";

export function AssetsStep() {
  const { data, updateData, setStep, _hasHydrated } = useFormStore();

  const {
    register,

    handleSubmit,

    reset,
    formState: { errors },
  } = useForm<AssetsData>({
    resolver: zodResolver(assetsSchema),
    defaultValues: data.assets || {
      primaryResidenceValue: 0,
      domesticSharePortfolio: 0,
      internationalSharePortfolio: 0,
      investmentPropertyValues: 0,
      cashSavings: 0,
    },
  });

  useEffect(() => {
    if (_hasHydrated && data.assets) {
      reset(data.assets);
    }
  }, [_hasHydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = (formData: AssetsData) => {
    updateData("assets", formData);
    setStep(5);
  };

  const assetFields = [
    { name: "primaryResidenceValue" as const, label: "Primary Residence Value", hint: "Enter 0 if renting" },
    { name: "domesticSharePortfolio" as const, label: "Domestic Share Portfolio", hint: "Australian shares" },
    { name: "internationalSharePortfolio" as const, label: "International Share Portfolio", hint: "Overseas shares and ETFs" },
    { name: "investmentPropertyValues" as const, label: "Investment Property Values", hint: "Total value of investment properties" },
    { name: "cashSavings" as const, label: "Cash & Savings", hint: "Bank accounts, term deposits, etc." },
  ];

  return (
    <FormWrapper
      step={4}
      totalSteps={6}
      title="Assets"
      description="What do you own?"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {assetFields.map((field) => (
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
            onClick={() => setStep(3)}
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
