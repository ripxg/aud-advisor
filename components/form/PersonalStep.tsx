"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalSchema, type PersonalData } from "@/lib/schemas";
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

const states = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"] as const;

export function PersonalStep() {
  const { data, updateData, setStep, _hasHydrated } = useFormStore();
  
  const {
    register,

    handleSubmit,

    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PersonalData>({
    resolver: zodResolver(personalSchema),
    defaultValues: data.personal || {
      age: 30,
      residencyStatus: "australian_resident",
      state: "NSW",
      hasHecsDebt: false,
      hecsBalance: 0,
      hasPrivateHealthInsurance: false,
    },
  });

  const hasHecsDebt = watch("hasHecsDebt");

  useEffect(() => {
    if (_hasHydrated && data.personal) {
      reset(data.personal);
    }
  }, [_hasHydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = (formData: PersonalData) => {
    updateData("personal", formData);
    setStep(2);
  };

  return (
    <FormWrapper
      step={1}
      totalSteps={6}
      title="Personal Details"
      description="Tell us about yourself to personalise your tax calculations"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              {...register("age")}
              className="bg-slate-900/50 border-slate-600"
            />
            {errors.age && (
              <p className="text-red-400 text-sm">{errors.age.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select
              defaultValue={data.personal?.state || "NSW"}
              onValueChange={(value) => setValue("state", value as typeof states[number])}
            >
              <SelectTrigger className="bg-slate-900/50 border-slate-600">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.state && (
              <p className="text-red-400 text-sm">{errors.state.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="residencyStatus">Residency Status</Label>
          <Select
            defaultValue={data.personal?.residencyStatus || "australian_resident"}
            onValueChange={(value) => setValue("residencyStatus", value as PersonalData["residencyStatus"])}
          >
            <SelectTrigger className="bg-slate-900/50 border-slate-600">
              <SelectValue placeholder="Select residency status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="australian_resident">Australian Resident</SelectItem>
              <SelectItem value="non_resident">Non-Resident</SelectItem>
              <SelectItem value="temporary_resident">Temporary Resident</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="hasHecsDebt"
              {...register("hasHecsDebt")}
              className="w-4 h-4 rounded border-slate-600 bg-slate-900/50 text-emerald-500 focus:ring-emerald-500"
            />
            <Label htmlFor="hasHecsDebt" className="cursor-pointer">
              I have a HECS/HELP debt
            </Label>
          </div>

          {hasHecsDebt && (
            <div className="space-y-2 pl-7">
              <Label htmlFor="hecsBalance">HECS/HELP Balance</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <Input
                  id="hecsBalance"
                  type="number"
                  {...register("hecsBalance")}
                  className="bg-slate-900/50 border-slate-600 pl-8"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="hasPrivateHealthInsurance"
            {...register("hasPrivateHealthInsurance")}
            className="w-4 h-4 rounded border-slate-600 bg-slate-900/50 text-emerald-500 focus:ring-emerald-500"
          />
          <Label htmlFor="hasPrivateHealthInsurance" className="cursor-pointer">
            I have private health insurance
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Continue
        </Button>
      </form>
    </FormWrapper>
  );
}
