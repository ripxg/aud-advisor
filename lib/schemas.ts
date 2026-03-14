import { z } from "zod";

export const personalSchema = z.object({
  age: z.coerce.number().min(18).max(100),
  residencyStatus: z.enum(["australian_resident", "non_resident", "temporary_resident"]),
  state: z.enum(["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"]),
  hasHecsDebt: z.boolean(),
  hecsBalance: z.coerce.number().min(0).optional(),
  hasPrivateHealthInsurance: z.boolean(),
});

export const incomeSchema = z.object({
  annualGrossSalary: z.coerce.number().min(0),
  dividendIncome: z.coerce.number().min(0),
  rentalIncome: z.coerce.number().min(0),
  foreignIncome: z.coerce.number().min(0),
});

export const expensesSchema = z.object({
  monthlyRentOrMortgage: z.coerce.number().min(0),
  monthlyLifestyleExpenses: z.coerce.number().min(0),
  annualInsurancePremiums: z.coerce.number().min(0),
});

export const assetsSchema = z.object({
  primaryResidenceValue: z.coerce.number().min(0),
  domesticSharePortfolio: z.coerce.number().min(0),
  internationalSharePortfolio: z.coerce.number().min(0),
  investmentPropertyValues: z.coerce.number().min(0),
  cashSavings: z.coerce.number().min(0),
});

export const liabilitiesSchema = z.object({
  mortgageBalance: z.coerce.number().min(0),
  investmentPropertyLoanBalance: z.coerce.number().min(0),
  personalLoanBalance: z.coerce.number().min(0),
  creditCardDebt: z.coerce.number().min(0),
});

export const superannuationSchema = z.object({
  currentSuperBalance: z.coerce.number().min(0),
  annualConcessionalContributions: z.coerce.number().min(0).max(30000),
  riskProfile: z.enum(["conservative", "balanced", "aggressive"]),
  expectedRetirementAge: z.coerce.number().min(60).max(70),
});

export const fullFormSchema = z.object({
  personal: personalSchema,
  income: incomeSchema,
  expenses: expensesSchema,
  assets: assetsSchema,
  liabilities: liabilitiesSchema,
  superannuation: superannuationSchema,
});

export type PersonalData = z.infer<typeof personalSchema>;
export type IncomeData = z.infer<typeof incomeSchema>;
export type ExpensesData = z.infer<typeof expensesSchema>;
export type AssetsData = z.infer<typeof assetsSchema>;
export type LiabilitiesData = z.infer<typeof liabilitiesSchema>;
export type SuperannuationData = z.infer<typeof superannuationSchema>;
export type FullFormData = z.infer<typeof fullFormSchema>;
