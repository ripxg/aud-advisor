import type { FullFormData } from "./schemas";

// ATO 2024-2025 Tax Brackets for Australian Residents
const TAX_BRACKETS = [
  { min: 0, max: 18200, rate: 0, base: 0 },
  { min: 18201, max: 45000, rate: 0.19, base: 0 },
  { min: 45001, max: 120000, rate: 0.325, base: 5092 },
  { min: 120001, max: 180000, rate: 0.37, base: 29467 },
  { min: 180001, max: Infinity, rate: 0.45, base: 51667 },
];

// HECS/HELP Repayment thresholds 2024-25
const HECS_THRESHOLDS = [
  { min: 0, max: 51550, rate: 0 },
  { min: 51550, max: 59518, rate: 0.01 },
  { min: 59518, max: 63089, rate: 0.02 },
  { min: 63089, max: 66875, rate: 0.025 },
  { min: 66875, max: 70888, rate: 0.03 },
  { min: 70888, max: 75140, rate: 0.035 },
  { min: 75140, max: 79649, rate: 0.04 },
  { min: 79649, max: 84429, rate: 0.045 },
  { min: 84429, max: 89494, rate: 0.05 },
  { min: 89494, max: 94865, rate: 0.055 },
  { min: 94865, max: 100557, rate: 0.06 },
  { min: 100557, max: 106590, rate: 0.065 },
  { min: 106590, max: 112985, rate: 0.07 },
  { min: 112985, max: 119764, rate: 0.075 },
  { min: 119764, max: 126950, rate: 0.08 },
  { min: 126950, max: 134568, rate: 0.085 },
  { min: 134568, max: 142642, rate: 0.09 },
  { min: 142642, max: 151200, rate: 0.095 },
  { min: 151200, max: Infinity, rate: 0.10 },
];

export interface TaxBreakdown {
  grossIncome: number;
  taxableIncome: number;
  incomeTax: number;
  lito: number;
  medicareLevy: number;
  medicareLevySurcharge: number;
  hecsRepayment: number;
  totalTax: number;
  netIncome: number;
  effectiveTaxRate: number;
}

export function calculateIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  
  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome >= bracket.min && taxableIncome <= bracket.max) {
      return bracket.base + (taxableIncome - bracket.min + 1) * bracket.rate;
    }
  }
  
  // Highest bracket
  const lastBracket = TAX_BRACKETS[TAX_BRACKETS.length - 1];
  return lastBracket.base + (taxableIncome - lastBracket.min + 1) * lastBracket.rate;
}

export function calculateLITO(taxableIncome: number): number {
  // Low Income Tax Offset (LITO) 2024-25
  // Max $700, phases out between $37,500 and $66,667
  if (taxableIncome <= 37500) {
    return 700;
  } else if (taxableIncome <= 45000) {
    // Reduces by 5 cents per dollar over $37,500
    return 700 - (taxableIncome - 37500) * 0.05;
  } else if (taxableIncome <= 66667) {
    // Reduces by 1.5 cents per dollar over $45,000
    const afterFirstPhase = 700 - (45000 - 37500) * 0.05; // $325 remaining
    return afterFirstPhase - (taxableIncome - 45000) * 0.015;
  }
  return 0;
}

export function calculateMedicareLevy(taxableIncome: number): number {
  // Medicare Levy is 2% of taxable income
  // Phase-in for low income: exempt under ~$26,000, phases in until ~$32,500
  const LOW_THRESHOLD = 26000;
  const SHADE_IN_THRESHOLD = 32500;
  
  if (taxableIncome <= LOW_THRESHOLD) {
    return 0;
  } else if (taxableIncome <= SHADE_IN_THRESHOLD) {
    // Shade-in rate: 10% of excess over low threshold
    return (taxableIncome - LOW_THRESHOLD) * 0.10;
  }
  return taxableIncome * 0.02;
}

export function calculateMedicareLevySurcharge(
  taxableIncome: number,
  hasPrivateHealthInsurance: boolean
): number {
  // Medicare Levy Surcharge for those without private health insurance
  // Income tiers for singles (2024-25)
  if (hasPrivateHealthInsurance || taxableIncome <= 93000) {
    return 0;
  } else if (taxableIncome <= 108000) {
    return taxableIncome * 0.01; // Tier 1: 1%
  } else if (taxableIncome <= 144000) {
    return taxableIncome * 0.0125; // Tier 2: 1.25%
  }
  return taxableIncome * 0.015; // Tier 3: 1.5%
}

export function calculateHecsRepayment(
  repaymentIncome: number,
  hasHecsDebt: boolean
): number {
  if (!hasHecsDebt) return 0;
  
  for (const threshold of HECS_THRESHOLDS) {
    if (repaymentIncome >= threshold.min && repaymentIncome < threshold.max) {
      return repaymentIncome * threshold.rate;
    }
  }
  
  // Above all thresholds
  return repaymentIncome * 0.10;
}

export function calculateTaxBreakdown(data: FullFormData): TaxBreakdown {
  const { income, personal } = data;
  
  const grossIncome = 
    income.annualGrossSalary + 
    income.dividendIncome + 
    income.rentalIncome + 
    income.foreignIncome;
  
  // For simplicity, taxable income = gross income (no deductions modeled)
  const taxableIncome = grossIncome;
  
  // Calculate components
  const rawIncomeTax = calculateIncomeTax(taxableIncome);
  const lito = calculateLITO(taxableIncome);
  const incomeTax = Math.max(0, rawIncomeTax - lito);
  
  const medicareLevy = calculateMedicareLevy(taxableIncome);
  const medicareLevySurcharge = calculateMedicareLevySurcharge(
    taxableIncome,
    personal.hasPrivateHealthInsurance
  );
  
  const hecsRepayment = calculateHecsRepayment(
    taxableIncome,
    personal.hasHecsDebt
  );
  
  const totalTax = incomeTax + medicareLevy + medicareLevySurcharge + hecsRepayment;
  const netIncome = grossIncome - totalTax;
  const effectiveTaxRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;
  
  return {
    grossIncome,
    taxableIncome,
    incomeTax,
    lito,
    medicareLevy,
    medicareLevySurcharge,
    hecsRepayment,
    totalTax,
    netIncome,
    effectiveTaxRate,
  };
}
