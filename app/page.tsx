import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Brand */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
              AUD Advisor
            </h1>
            <p className="text-slate-400 text-lg">Australian Financial & Tax Advisory Tool</p>
          </div>

          {/* Main Headline */}
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Your Free Australian
            <br />
            <span className="text-emerald-400">Financial Health Check</span>
          </h2>

          <p className="text-slate-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
            Get personalised insights into your tax position, net worth, investment projections, 
            and AI-powered financial guidance — all in under 5 minutes.
          </p>

          {/* CTA Button */}
          <Link href="/advisor">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-6 rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:shadow-emerald-600/40 hover:scale-105"
            >
              Start My Report →
            </Button>
          </Link>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> 100% Free
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> No Sign-up Required
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Data Not Stored
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> ATO 2024-25 Rates
            </div>
          </div>
        </div>

        {/* General Advice Warning */}
        <div className="max-w-3xl mx-auto mt-16">
          <div className="bg-amber-900/20 border-2 border-amber-600/50 rounded-xl p-6">
            <div className="flex gap-4">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="text-amber-400 font-semibold text-lg mb-2">General Advice Warning</h3>
                <p className="text-amber-200/80 text-sm leading-relaxed">
                  This tool provides general information only and does not consider your personal circumstances. 
                  It is not financial advice. Before making any financial decisions, please consult with a 
                  licensed financial adviser. The creators of this tool do not hold an Australian Financial 
                  Services Licence (AFSL).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-5xl mx-auto mt-24">
          <h3 className="text-2xl font-bold text-white text-center mb-12">What You&apos;ll Discover</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">💰</div>
              <h4 className="text-white font-semibold mb-2">Tax Breakdown</h4>
              <p className="text-slate-400 text-sm">
                See exactly where your money goes — income tax, Medicare, HECS repayments, 
                and your effective tax rate.
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">📊</div>
              <h4 className="text-white font-semibold mb-2">Net Worth Analysis</h4>
              <p className="text-slate-400 text-sm">
                Understand your complete financial picture — assets, liabilities, 
                and monthly cash flow.
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">📈</div>
              <h4 className="text-white font-semibold mb-2">Wealth Projections</h4>
              <p className="text-slate-400 text-sm">
                See how your investments could grow over 10, 20, and 30 years 
                across different risk profiles.
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🏦</div>
              <h4 className="text-white font-semibold mb-2">Super Outlook</h4>
              <p className="text-slate-400 text-sm">
                Project your superannuation balance at retirement and estimate 
                your sustainable retirement income.
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h4 className="text-white font-semibold mb-2">AI Insights</h4>
              <p className="text-slate-400 text-sm">
                Get personalised commentary on tax optimisation, diversification, 
                risks, and actionable next steps.
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">📄</div>
              <h4 className="text-white font-semibold mb-2">PDF Download</h4>
              <p className="text-slate-400 text-sm">
                Download a professional PDF report to save, print, 
                or share with your financial adviser.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="max-w-4xl mx-auto mt-24 text-center text-slate-500 text-sm">
          <p>Built with Next.js, powered by ZhipuAI GLM-5</p>
          <p className="mt-2">Tax calculations based on ATO 2024-25 rates for Australian residents</p>
        </footer>
      </div>
    </div>
  );
}
