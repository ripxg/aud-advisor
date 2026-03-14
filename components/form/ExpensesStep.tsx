"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expensesSchema, type ExpensesData } from "@/lib/schemas";
import { useFormStore } from "@/hooks/useFormStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormWrapper } from "./FormWrapper";

export function ExpensesStep() {
  const { data, updateData, setStep, _hasHydrated } = useFormStore();

  const {
    register,

    handleSubmit,

    reset,
    formState: { errors },
  } = useForm<ExpensesData>({
    resolver: zodResolver(expensesSchema),
    defaultValues: data.expenses || {
      monthlyRentOrMortgage: 0,
      monthlyLifestyleExpenses: 0,
      annualInsurancePremiums: 0,
    },
  });

  useEffect(() => {
    if (_hasHydrated && data.expenses) {
      reset(data.expenses);
    }
  }, [_hasHydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = (formData: ExpensesData) => {
    updateData("expenses", formData);
    setStep(4);
  };

  return (
    <FormWrapper
      step={3}
      totalSteps={6}
      title="Expenses"
      description="Tell us about your regular expenses"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="monthlyRentOrMortgage">Monthly Rent or Mortgage Payment</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <Input
              id="monthlyRentOrMortgage"
              type="number"
              {...register("monthlyRentOrMortgage")}
              className="bg-slate-900/50 border-slate-600 pl-8"
              placeholder="0"
            />
          </div>
          <p className="text-xs text-slate-500">Your monthly housing payment</p>
          {errors.monthlyRentOrMortgage && (
            <p className="text-red-400 text-sm">{errors.monthlyRentOrMortgage.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="monthlyLifestyleExpenses">Monthly Lifestyle Expenses</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <Input
              id="monthlyLifestyleExpenses"
              type="number"
              {...register("monthlyLifestyleExpenses")}
              className="bg-slate-900/50 border-slate-600 pl-8"
              placeholder="0"
            />
          </div>
          <p className="text-xs text-slate-500">Food, transport, entertainment, etc.</p>
          {errors.monthlyLifestyleExpenses && (
            <p className="text-red-400 text-sm">{errors.monthlyLifestyleExpenses.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="annualInsurancePremiums">Annual Insurance Premiums</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <Input
              id="annualInsurancePremiums"
              type="number"
              {...register("annualInsurancePremiums")}
              className="bg-slate-900/50 border-slate-600 pl-8"
              placeholder="0"
            />
          </div>
          <p className="text-xs text-slate-500">Total annual premiums (health, car, home, etc.)</p>
          {errors.annualInsurancePremiums && (
            <p className="text-red-400 text-sm">{errors.annualInsurancePremiums.message}</p>
          )}
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(2)}
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
