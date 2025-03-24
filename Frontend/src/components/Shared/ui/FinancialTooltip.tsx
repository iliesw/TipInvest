import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Financial terms glossary
const financialTerms: Record<string, string> = {
  'Return Multiplier': 'A factor that adjusts the expected return on investment based on property type. Higher values indicate potentially higher returns.',
  'Risk Factor': 'A measure of the relative risk associated with a property type. Higher values indicate higher risk.',
  'Appreciation': 'The annual percentage increase in property value over time.',
  'Interest Rate': 'The percentage charged by a lender for borrowing money, affecting monthly payments.',
  'Investment Quality': 'A score (1-10) indicating the overall quality of the investment based on multiple factors.',
  'Risk Level': 'A score (1-10) indicating the relative risk of the investment. Lower scores indicate lower risk.',
  'Duration': 'The time period (in months) over which the investment is calculated.',
  'Monthly Payment': 'The estimated monthly payment based on the investment amount, interest rate, and duration.',
  'Total Price': 'The total amount paid over the entire duration of the investment.',
  'Capital': 'The initial amount invested in the property.',
};

interface FinancialTooltipProps {
  term: string;
  children: React.ReactNode;
  className?: string;
}

export default function FinancialTooltip({ term, children, className = '' }: FinancialTooltipProps) {
  // Check if the term exists in our glossary
  const definition = financialTerms[term] || 'No definition available';
  
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`inline-flex items-center gap-1 ${className}`}>
            {children}
            
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-2 text-xs">
          {definition}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}