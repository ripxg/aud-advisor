"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface FormWrapperProps {
  step: number;
  totalSteps: number;
  title: string;
  description: string;
  children: React.ReactNode;
}

const stepLabels = [
  "Personal",
  "Income",
  "Expenses",
  "Assets",
  "Liabilities",
  "Super",
];

export function FormWrapper({
  step,
  totalSteps,
  title,
  description,
  children,
}: FormWrapperProps) {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {stepLabels.map((label, index) => (
            <span
              key={label}
              className={cn(
                "text-xs font-medium transition-colors",
                index + 1 <= step
                  ? "text-emerald-500"
                  : "text-slate-400"
              )}
            >
              {label}
            </span>
          ))}
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-slate-400 mt-2 text-center">
          Step {step} of {totalSteps}
        </p>
      </div>

      {/* Animated content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
              <p className="text-slate-400">{description}</p>
            </div>
            {children}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
