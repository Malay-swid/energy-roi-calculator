import React, { useState, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Building2, 
  Mail, 
  Industry 
} from 'lucide-react';

/**
 * Energy ROI Calculator
 * A professional, multi-step financial projection tool for B2B Industrial SaaS.
 */

type TechType = 'Solar PV' | 'Wind-Solar Hybrid' | 'BESS';

interface FormState {
  monthlyBill: string;
  tariff: string;
  installationCost: string;
  techType: TechType;
  savingsPercent: number;
  companyName: string;
  email: string;
  industry: string;
}

const INITIAL_STATE: FormState = {
  monthlyBill: '',
  tariff: '',
  installationCost: '',
  techType: 'Solar PV',
  savingsPercent: 20,
  companyName: '',
  email: '',
  industry: '',
};

export default function EnergyROICalculator() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = (field: keyof FormState, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- Calculations ---
  const results = useMemo(() => {
    const monthlyBill = parseFloat(formData.monthlyBill) || 0;
    const investment = parseFloat(formData.installationCost) || 0;
    const savingsPct = formData.savingsPercent / 100;

    const annualSavings = (monthlyBill * 12) * savingsPct;
    const paybackPeriod = annualSavings > 0 ? investment / annualSavings : 0;

    // 10-year projection data for Recharts
    const data = [];
    for (let year = 0; year <= 10; year++) {
      data.push({
        year: `Year ${year}`,
        cumulativeSavings: year * annualSavings,
        investment: investment,
      });
    }

    return {
      annualSavings,
      paybackPeriod,
      chartData: data,
    };
  }, [formData]);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleLeadCapture = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  // --- UI Components ---

  const ProgressBar = () => {
    const progress = (step / 4) * 100;
    return (
      <div className="w-full mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4].map(i => (
            <span key={i} className={`text-xs font-medium ${step === i ? 'text-emerald-500' : 'text-slate-400'}`}>
              Step {i}
            </span>
          ))}
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-500 h-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-3xl shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Your Energy ROI Projection</h2>
          <p className="text-slate-500">Based on your industrial profile, here is your 10-year financial outlook.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Estimated Annual Savings</p>
              <p className="text-3xl font-bold text-slate-900">${results.annualSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-4">
            <div className="p-3 bg-navy-100 text-blue-600 rounded-xl" style={{ backgroundColor: '#e0e7ff' }}>
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Payback Period</p>
              <p className="text-3xl font-bold text-slate-900">{results.paybackPeriod.toFixed(1)} Years</p>
            </div>
          </div>
        </div>

        <div className="mb-10 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Cumulative Savings vs. Investment</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={results.chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" />
                <Line 
                  name="Cumulative Savings" 
                  type="monotone" 
                  dataKey="cumulativeSavings" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#10b981' }} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  name="Initial Investment" 
                  type="step" 
                  dataKey="investment" 
                  stroke="#0A192F" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="text-center">
          <button className="bg-[#0A192F] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg shadow-blue-900/20 flex items-center justify-center mx-auto space-x-2">
            <span>Book a Free Consultation</span>
            <ChevronRight size={20} />
          </button>
          <p className="mt-4 text-sm text-slate-400 italic">Connect with a Senior Energy Consultant to refine these projections.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Energy ROI Calculator</h1>
        <p className="text-slate-500">Project your renewable energy savings in 4 simple steps.</p>
      </div>

      <ProgressBar />

      <div className="min-h-[400px]">
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <DollarSign size={20} className="text-emerald-500" /> Energy Consumption
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Average Monthly Energy Bill ($)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 5000"
                  value={formData.monthlyBill}
                  onChange={(e) => updateField('monthlyBill', e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Current Energy Tariff (cost per kWh)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 0.12"
                  value={formData.tariff}
                  onChange={(e) => updateField('tariff', e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Building2 size={20} className="text-emerald-500" /> Investment Details
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Estimated System Installation Cost ($)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 50000"
                  value={formData.installationCost}
                  onChange={(e) => updateField('installationCost', e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Technology Type</label>
                <select 
                  value={formData.techType}
                  onChange={(e) => updateField('techType', e.target.value as TechType)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-white"
                >
                  <option value="Solar PV">Solar PV</option>
                  <option value="Wind-Solar Hybrid">Wind-Solar Hybrid</option>
                  <option value="BESS">Battery Energy Storage System (BESS)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <TrendingUp size={20} className="text-emerald-500" /> Optimization
            </h3>
            <div>
              <div className="flex justify-between mb-4">
                <label className="text-sm font-medium text-slate-600">Expected Energy Saving %</label>
                <span className="text-lg font-bold text-emerald-600">{formData.savingsPercent}%</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="40" 
                step="1"
                value={formData.savingsPercent}
                onChange={(e) => updateField('savingsPercent', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>5% (Conservative)</span>
                <span>40% (Aggressive)</span>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <form onSubmit={handleLeadCapture} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-emerald-500" /> Unlock Your Results
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="relative">
                <Building2 className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  required
                  type="text" 
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={(e) => updateField('companyName', e.target.value)}
                  className="w-full p-3 pl-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  required
                  type="email" 
                  placeholder="Work Email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full p-3 pl-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="relative">
                <Industry className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  required
                  type="text" 
                  placeholder="Industry (e.g. Logistics, Manufacturing)"
                  value={formData.industry}
                  onChange={(e) => updateField('industry', e.target.value)}
                  className="w-full p-3 pl-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full bg-emerald-500 text-white p-4 rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200"
            >
              Generate My Report
            </button>
          </form>
        )}
      </div>

      <div className="mt-10 flex justify-between items-center">
        <button 
          onClick={prevStep} 
          disabled={step === 1}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${step === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <ChevronLeft size={16} /> Previous
        </button>
        {step < 4 && (
          <button 
            onClick={nextStep}
            className="flex items-center gap-2 px-6 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
          >
            Next Step <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
