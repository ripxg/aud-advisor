"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { incomeSchema, type IncomeData } from "@/lib/schemas";
import { useFormStore } from "@/hooks/useFormStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormWrapper } from "./FormWrapper";

export function IncomeStep() {
  const { data, updateData, setStep } = useFormStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IncomeData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: data.income || {
      annualGrossSalary: 0,
      dividendIncome: 0,
      rentalIncome: 0,
      foreignIncome: 0,
    },
  });

  const onSubmit = (formData: IncomeData) => {
    updateData("income", formData);
    setStep(3);
  };

  const incomeFields = [
    { name: "annualGrossSalary" as const, label: "Annual Gross Salary", hint: "Your base salary before tax" },
    { name: "dividendIncome" as const, label: "Dividend Income", hint: "Annual dividends from shares" },
    { name: "rentalIncome" as const, label: "Rental Income", hint: "Net rental income after expenses" },
    { name: "foreignIncome" as const, label: "Foreign Income", hint: "Income earned overseas" },
  ];

  return (
    <FormWrapper
      step={2}
      totalSteps={6}
      title="Income"
      description="Enter your annual income from all sources"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {incomeFields.map((field) => (
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
            onClick={() => setStep(1)}
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
