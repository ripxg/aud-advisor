import type { FullFormData } from "./schemas";
import { calculateTaxBreakdown } from "./tax-calculator";

export interface NetWorthBreakdown {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  assetBreakdown: {
    primaryResidence: number;
    domesticShares: number;
    internationalShares: number;
    investmentProperties: number;
    cash: number;
  };
  liabilityBreakdown: {
    mortgage: number;
    investmentLoans: number;
    personalLoans: number;
    creditCards: number;
  };
}

export interface CashFlowBreakdown {
  monthlyNetIncome: number;
  monthlyExpenses: number;
  monthlySurplus: number;
  annualSurplus: number;
}

export interface WealthProjection {
  year: number;
  conservative: number;
  balanced: number;
  aggressive: number;
}

export interface SuperProjection {
  currentBalance: number;
  projectedBalance: number;
  yearsToRetirement: number;
  estimatedAnnualIncome: number;
  monthlyIncome: number;
}

const RETURN_RATES = {
  conservative: 0.05,
  balanced: 0.075,
  aggressive: 0.10,
};

export function calculateNetWorth(data: FullFormData): NetWorthBreakdown {
  const { assets, liabilities } = data;
  
  const totalAssets = 
    assets.primaryResidenceValue +
    assets.domesticSharePortfolio +
    assets.internationalSharePortfolio +
    assets.investmentPropertyValues +
    assets.cashSavings;
  
  const totalLiabilities = 
    liabilities.mortgageBalance +
    liabilities.investmentPropertyLoanBalance +
    liabilities.personalLoanBalance +
    liabilities.creditCardDebt;
  
  return {
    totalAssets,
    totalLiabilities,
    netWorth: totalAssets - totalLiabilities,
    assetBreakdown: {
      primaryResidence: assets.primaryResidenceValue,
      domesticShares: assets.domesticSharePortfolio,
      internationalShares: assets.internationalSharePortfolio,
      investmentProperties: assets.investmentPropertyValues,
      cash: assets.cashSavings,
    },
    liabilityBreakdown: {
      mortgage: liabilities.mortgageBalance,
      investmentLoans: liabilities.investmentPropertyLoanBalance,
      personalLoans: liabilities.personalLoanBalance,
      creditCards: liabilities.creditCardDebt,
    },
  };
}

export function calculateCashFlow(data: FullFormData): CashFlowBreakdown {
  const taxBreakdown = calculateTaxBreakdown(data);
  const { expenses } = data;
  
  const monthlyNetIncome = taxBreakdown.netIncome / 12;
  const monthlyExpenses = 
    expenses.monthlyRentOrMortgage +
    expenses.monthlyLifestyleExpenses +
    (expenses.annualInsurancePremiums / 12);
  
  const monthlySurplus = monthlyNetIncome - monthlyExpenses;
  
  return {
    monthlyNetIncome,
    monthlyExpenses,
    monthlySurplus,
    annualSurplus: monthlySurplus * 12,
  };
}

export function projectWealth(data: FullFormData): WealthProjection[] {
  const { assets } = data;
  const cashFlow = calculateCashFlow(data);
  
  // Starting investable assets (excluding primary residence)
  const startingValue = 
    assets.domesticSharePortfolio +
    assets.internationalSharePortfolio +
    assets.investmentPropertyValues +
    assets.cashSavings;
  
  const monthlyContribution = Math.max(0, cashFlow.monthlySurplus);
  
  const projections: WealthProjection[] = [];
  
  for (let year = 0; year <= 30; year++) {
    const conservative = calculateFutureValue(
      startingValue,
      monthlyContribution,
      RETURN_RATES.conservative,
      year
    );
    const balanced = calculateFutureValue(
      startingValue,
      monthlyContribution,
      RETURN_RATES.balanced,
      year
    );
    const aggressive = calculateFutureValue(
      startingValue,
      monthlyContribution,
      RETURN_RATES.aggressive,
      year
    );
    
    if (year === 0 || year === 10 || year === 20 || year === 30) {
      projections.push({ year, conservative, balanced, aggressive });
    }
  }
  
  return projections;
}

export function projectWealthDetailed(data: FullFormData): WealthProjection[] {
  const { assets } = data;
  const cashFlow = calculateCashFlow(data);
  
  const startingValue = 
    assets.domesticSharePortfolio +
    assets.internationalSharePortfolio +
    assets.investmentPropertyValues +
    assets.cashSavings;
  
  const monthlyContribution = Math.max(0, cashFlow.monthlySurplus);
  
  const projections: WealthProjection[] = [];
  
  for (let year = 0; year <= 30; year++) {
    projections.push({
      year,
      conservative: calculateFutureValue(
        startingValue,
        monthlyContribution,
        RETURN_RATES.conservative,
        year
      ),
      balanced: calculateFutureValue(
        startingValue,
        monthlyContribution,
        RETURN_RATES.balanced,
        year
      ),
      aggressive: calculateFutureValue(
        startingValue,
        monthlyContribution,
        RETURN_RATES.aggressive,
        year
      ),
    });
  }
  
  return projections;
}

function calculateFutureValue(
  presentValue: number,
  monthlyContribution: number,
  annualRate: number,
  years: number
): number {
  if (years === 0) return presentValue;
  
  const monthlyRate = annualRate / 12;
  const months = years * 12;
  
  // Future value of present value
  const fvPresent = presentValue * Math.pow(1 + annualRate, years);
  
  // Future value of annuity (monthly contributions)
  const fvAnnuity = monthlyContribution * 
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  
  return fvPresent + fvAnnuity;
}

export function projectSuperannuation(data: FullFormData): SuperProjection {
  const { superannuation, personal } = data;
  
  const yearsToRetirement = superannuation.expectedRetirementAge - personal.age;
  const annualReturn = RETURN_RATES[superannuation.riskProfile];
  
  let balance = superannuation.currentSuperBalance;
  
  for (let year = 0; year < yearsToRetirement; year++) {
    // Add contributions at start of year
    balance += superannuation.annualConcessionalContributions;
    // Apply return
    balance *= (1 + annualReturn);
  }
  
  // 4% drawdown rule for sustainable income
  const estimatedAnnualIncome = balance * 0.04;
  
  return {
    currentBalance: superannuation.currentSuperBalance,
    projectedBalance: balance,
    yearsToRetirement,
    estimatedAnnualIncome,
    monthlyIncome: estimatedAnnualIncome / 12,
  };
}
