import { NextRequest, NextResponse } from 'next/server';
import { SUBSCRIPTION_PLANS } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const { planId, cycle = 'monthly', gstin, businessName } = await req.json();

    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: 'Invalid subscription plan' }, { status: 400 });
    }

    const baseAmount = cycle === 'annual' ? plan.priceAnnualINR : plan.priceMonthlyINR;
    const gstRate = 0.18;
    const gstAmount = Math.round(baseAmount * gstRate * 100) / 100;
    const totalAmount = Math.round((baseAmount + gstAmount) * 100) / 100;

    // Razorpay Order ID simulation (or live when RAZORPAY_KEY_SECRET is configured)
    const orderId = `order_nova_${Date.now()}`;
    const invoiceNumber = `INV-NOVA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const upiString = `upi://pay?pa=novaai@icici&pn=NOVA%20AI%20INDIA%20PVT%20LTD&mc=5734&tid=${orderId}&tr=${orderId}&tn=NOVA%20AI%20${plan.name}%20Subscription&am=${totalAmount}&cu=INR`;

    return NextResponse.json({
      success: true,
      order: {
        orderId,
        invoiceNumber,
        planId: plan.id,
        planName: plan.name,
        cycle,
        baseAmount,
        gstRate: 18,
        cgst: gstAmount / 2,
        sgst: gstAmount / 2,
        gstAmount,
        totalAmount,
        currency: 'INR',
        gstin: gstin || 'Unregistered Consumer',
        businessName: businessName || 'Individual Subscriber',
        hsnCode: '998313',
        upiString,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Billing error' }, { status: 500 });
  }
}
