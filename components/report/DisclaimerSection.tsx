"use client";

import { Card, CardContent } from "@/components/ui/card";

export function DisclaimerSection() {
  return (
    <Card className="bg-amber-900/20 border-amber-700/50">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <span className="text-3xl">⚠️</span>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-400">General Advice Warning</h3>
            <p className="text-amber-200/80 text-sm leading-relaxed">
              The information provided in this report is general in nature and does not take into account your 
              personal financial situation, objectives, or needs. It is not intended to be, and should not be 
              construed as, personal financial advice.
            </p>
            <p className="text-amber-200/80 text-sm leading-relaxed">
              Before making any financial decisions, you should consider seeking independent professional advice 
              from a licensed financial adviser who can assess your individual circumstances and provide 
              personalised recommendations.
            </p>
            <div className="bg-amber-900/30 rounded-lg p-4 mt-4">
              <p className="text-amber-300 text-sm font-medium">
                📋 This tool is for educational and informational purposes only. The creators of this tool do not 
                hold an Australian Financial Services Licence (AFSL).
              </p>
            </div>
            <p className="text-amber-200/60 text-xs mt-4">
              🔒 <strong>Privacy Notice:</strong> This tool does not store your financial data. All calculations 
              are performed locally in your browser, and data is only temporarily used for AI commentary generation.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
