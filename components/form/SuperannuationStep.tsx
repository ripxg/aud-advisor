"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { superannuationSchema, type SuperannuationData } from "@/lib/schemas";
import { useFormStore } from "@/hooks/useFormStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormWrapper } from "./FormWrapper";

export function SuperannuationStep() {
  const router = useRouter();
  const { data, updateData, setStep, _hasHydrated } = useFormStore();

  const {
    register,

    handleSubmit,

    reset,
    setValue,
    formState: { errors },
  } = useForm<SuperannuationData>({
    resolver: zodResolver(superannuationSchema),
    defaultValues: data.superannuation || {
      currentSuperBalance: 0,
      annualConcessionalContributions: 0,
      riskProfile: "balanced",
      expectedRetirementAge: 65,
    },
  });

  useEffect(() => {
    if (_hasHydrated && data.superannuation) {
      reset(data.superannuation);
    }
  }, [_hasHydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = (formData: SuperannuationData) => {
    updateData("superannuation", formData);
    router.push("/advisor/report");
  };

  return (
    <FormWrapper
      step={6}
      totalSteps={6}
      title="Superannuation"
      description="Your retirement savings details"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="currentSuperBalance">Current Super Balance</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <Input
              id="currentSuperBalance"
              type="number"
              {...register("currentSuperBalance")}
              className="bg-slate-900/50 border-slate-600 pl-8"
              placeholder="0"
            />
          </div>
          {errors.currentSuperBalance && (
            <p className="text-red-400 text-sm">{errors.currentSuperBalance.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="annualConcessionalContributions">Annual Concessional Contributions</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <Input
              id="annualConcessionalContributions"
              type="number"
              {...register("annualConcessionalContributions")}
              className="bg-slate-900/50 border-slate-600 pl-8"
              placeholder="0"
            />
          </div>
          <p className="text-xs text-slate-500">Including employer contributions (max $30,000/year)</p>
          {errors.annualConcessionalContributions && (
            <p className="text-red-400 text-sm">{errors.annualConcessionalContributions.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="riskProfile">Investment Risk Profile</Label>
          <Select
            defaultValue={data.superannuation?.riskProfile || "balanced"}
            onValueChange={(value) => setValue("riskProfile", value as SuperannuationData["riskProfile"])}
          >
            <SelectTrigger className="bg-slate-900/50 border-slate-600">
              <SelectValue placeholder="Select risk profile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="conservative">Conservative (~5% return)</SelectItem>
              <SelectItem value="balanced">Balanced (~7.5% return)</SelectItem>
              <SelectItem value="aggressive">Aggressive (~10% return)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectedRetirementAge">Expected Retirement Age</Label>
          <Input
            id="expectedRetirementAge"
            type="number"
            {...register("expectedRetirementAge")}
            className="bg-slate-900/50 border-slate-600"
            min={18}
            max={100}
          />
          <p className="text-xs text-slate-500">Any age</p>
          {errors.expectedRetirementAge && (
            <p className="text-red-400 text-sm">{errors.expectedRetirementAge.message}</p>
          )}
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(5)}
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Generate My Report
          </Button>
        </div>
      </form>
    </FormWrapper>
  );
}
