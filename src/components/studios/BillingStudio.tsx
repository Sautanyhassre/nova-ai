'use client';

import React, { useState } from 'react';
import { SUBSCRIPTION_PLANS } from '@/lib/constants';
import {
  CreditCard,
  Check,
  Sparkles,
  ShieldCheck,
  Download,
  QrCode,
  FileText,
  Building,
  HelpCircle,
  ArrowRight,
  Zap,
} from 'lucide-react';

export const BillingStudio: React.FC = () => {
  const [cycle, setCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlanId, setSelectedPlanId] = useState<'plus' | 'pro' | 'ultra'>('pro');
  const [gstin, setGstin] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutOrder, setCheckoutOrder] = useState<any>(null);
  const [paymentStep, setPaymentStep] = useState<'method' | 'upi_qr' | 'success'>('method');

  const selectedPlan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[1];

  const handleStartCheckout = async (planId: 'plus' | 'pro' | 'ultra') => {
    setSelectedPlanId(planId);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          cycle,
          gstin: gstin.trim() || undefined,
          businessName: businessName.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setCheckoutOrder(data.order);
        setPaymentStep('method');
        setIsCheckoutOpen(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSimulatePaymentSuccess = () => {
    setPaymentStep('success');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#08090C] overflow-y-auto">
      {/* Top Banner */}
      <div className="p-8 bg-gradient-to-b from-[#111420] to-[#08090C] border-b border-[#222733] text-center max-w-4xl mx-auto w-full">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>India-Ready Sovereign AI Infrastructure</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
          Transparent, Scalable Intelligence in Indian Rupees (₹)
        </h2>
        <p className="text-xs md:text-sm text-slate-400 max-w-2xl mx-auto mb-6">
          Funded entirely by transparent subscriptions without ads, trackers, or data exploitation. Compliant with RBI guidelines and Indian GST standards.
        </p>

        {/* Monthly / Annual Toggle */}
        <div className="inline-flex items-center bg-[#151925] p-1.5 rounded-2xl border border-[#262c3e]">
          <button
            onClick={() => setCycle('monthly')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
              cycle === 'monthly'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setCycle('annual')}
            className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
              cycle === 'annual'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-bold">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="max-w-6xl mx-auto px-6 py-10 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const price = cycle === 'annual' ? plan.priceAnnualINR : plan.priceMonthlyINR;
          const isPro = plan.id === 'pro';

          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 ${
                isPro
                  ? 'bg-gradient-to-b from-[#191d2c] via-[#121520] to-[#0d0f17] border-2 border-indigo-500 shadow-2xl shadow-indigo-600/20'
                  : 'bg-[#10131d] border border-[#222736] hover:border-slate-600'
              }`}
            >
              {isPro && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider shadow">
                  Most Popular for Builders
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-slate-400 mb-4 min-h-[32px]">{plan.tagline}</p>

                {/* Price Display */}
                <div className="mb-4">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-extrabold text-white">
                      ₹{price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-400">/{cycle === 'annual' ? 'yr' : 'mo'}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    + 18% GST (Eligible for Input Tax Credit)
                  </p>
                </div>

                <hr className="border-[#222736] my-4" />

                {/* Features list */}
                <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <button
                  onClick={() => handleStartCheckout(plan.id)}
                  className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-lg transition ${
                    isPro
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-indigo-600/30'
                      : 'bg-[#1b202e] hover:bg-[#252c40] text-slate-200'
                  }`}
                >
                  <span>Select {plan.name}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Indian GST / Enterprise B2B Billing Details Form */}
      <div className="max-w-4xl mx-auto px-6 pb-12 w-full">
        <div className="p-6 rounded-3xl bg-[#10131d] border border-[#222736] space-y-4">
          <div className="flex items-center space-x-2">
            <Building className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">GSTIN & Enterprise Invoicing Details</h3>
          </div>
          <p className="text-xs text-slate-400">
            Provide your business GSTIN to receive automatic GST-compliant tax invoices with 18% Input Tax Credit (ITC) under HSN/SAC code 998313.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Company / Legal Entity Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Acme Technologies India Pvt Ltd"
                className="w-full bg-[#161a25] border border-[#262c3e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                GSTIN (15 Digits)
              </label>
              <input
                type="text"
                maxLength={15}
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                placeholder="e.g. 29AAAAA0000A1Z5"
                className="w-full bg-[#161a25] border border-[#262c3e] rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Checkout Modal (Razorpay / UPI simulator) */}
      {isCheckoutOpen && checkoutOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#10131e] border border-[#262d40] shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-5 bg-[#141824] border-b border-[#242b3b] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">
                  NOVA AI Secure Checkout (India Gateway)
                </h3>
                <p className="text-[11px] text-slate-400">Order Ref: {checkoutOrder.orderId}</p>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="text-slate-400 hover:text-white text-base px-2 py-1"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {paymentStep === 'method' && (
                <div className="space-y-4">
                  {/* Order breakdown */}
                  <div className="p-4 rounded-2xl bg-[#0c0e14] border border-[#222736] space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>{checkoutOrder.planName} ({checkoutOrder.cycle})</span>
                      <span className="font-semibold text-white">₹{checkoutOrder.baseAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>CGST (9%) + SGST (9%)</span>
                      <span>₹{checkoutOrder.gstAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="pt-2 border-t border-[#222736] flex justify-between font-bold text-sm text-emerald-400">
                      <span>Total Amount Payable</span>
                      <span>₹{checkoutOrder.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-slate-300">Select Indian Payment Rail:</p>

                  <div className="space-y-2">
                    <button
                      onClick={() => setPaymentStep('upi_qr')}
                      className="w-full p-3 rounded-xl bg-[#161a25] hover:bg-[#1e2332] border border-[#262c3e] flex items-center justify-between text-xs text-slate-200 transition"
                    >
                      <div className="flex items-center space-x-3">
                        <QrCode className="h-5 w-5 text-indigo-400" />
                        <div className="text-left">
                          <p className="font-bold text-white">UPI FastPay & Dynamic QR</p>
                          <p className="text-[10px] text-slate-400">Google Pay, PhonePe, Paytm, BHIM</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        Zero Fee
                      </span>
                    </button>

                    <button
                      onClick={handleSimulatePaymentSuccess}
                      className="w-full p-3 rounded-xl bg-[#161a25] hover:bg-[#1e2332] border border-[#262c3e] flex items-center justify-between text-xs text-slate-200 transition"
                    >
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5 text-cyan-400" />
                        <div className="text-left">
                          <p className="font-bold text-white">RuPay, Visa & MasterCard</p>
                          <p className="text-[10px] text-slate-400">Domestic & International Cards</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">RBI 2FA Ready</span>
                    </button>
                  </div>
                </div>
              )}

              {paymentStep === 'upi_qr' && (
                <div className="flex flex-col items-center justify-center p-4 space-y-4 text-center">
                  <div className="p-4 bg-white rounded-2xl shadow-xl">
                    {/* Simulated Clean QR */}
                    <div className="h-44 w-44 bg-slate-900 flex flex-col items-center justify-center text-white text-xs p-2 rounded-lg font-mono">
                      <QrCode className="h-24 w-24 text-white mb-2" />
                      <span className="text-[10px]">SCAN VIA ANY UPI APP</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Scan & Pay ₹{checkoutOrder.totalAmount.toLocaleString('en-IN')}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      UPI ID: <span className="font-mono text-indigo-400">novaai@icici</span>
                    </p>
                  </div>

                  <button
                    onClick={handleSimulatePaymentSuccess}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition"
                  >
                    Simulate Successful UPI Authorization
                  </button>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="text-center py-6 space-y-4">
                  <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-white">Payment Confirmed!</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Subscription active for {checkoutOrder.planName}. Tax invoice issued.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0c0e14] border border-[#222736] text-xs text-slate-300 text-left space-y-1">
                    <p><b>Invoice No:</b> {checkoutOrder.invoiceNumber}</p>
                    <p><b>SAC Code:</b> 998313 (Information Technology Services)</p>
                    <p><b>GSTIN:</b> {checkoutOrder.gstin}</p>
                    <p><b>Amount Paid:</b> ₹{checkoutOrder.totalAmount.toLocaleString('en-IN')}</p>
                  </div>

                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
                  >
                    Return to Workspace
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
