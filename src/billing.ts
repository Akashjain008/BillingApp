import { Customer, SubscriptionPlan, Invoice } from './entities';
import { calculateProratedAmount, formatCurrency, generateUUID, getCurrentDate } from './utils';

// Generate an invoice for a customer based on their subscription plan
export function generateCustomerInvoice(customer: Customer, plan: SubscriptionPlan): Invoice {
  const invoice: Invoice = {
    id: generateUUID(),
    customer_id: customer.id,
    amount: plan.price,
    due_date: getCurrentDate(),
    payment_status: 'pending',
  };

  return invoice;
}

// Handle mid-cycle plan change and calculate prorated amount
export function handlePlanUpgradeOrDowngrade(
  currentPlan: SubscriptionPlan,
  newPlan: SubscriptionPlan,
  daysUsed: number,
  totalDays: number
): number {
  const proratedAmount = calculateProratedAmount(
    currentPlan.price,
    newPlan.price,
    daysUsed,
    totalDays
  );
  return proratedAmount;
}

// Automatically generate invoices for customers at the end of each billing cycle
export function autoGenerateInvoices(customers: Customer[], plans: SubscriptionPlan[]): Invoice[] {
  const invoices: Invoice[] = [];

  customers.forEach((customer) => {
    const plan = plans.find((p) => p.id === customer.subscription_plan_id);

    if (plan && customer.subscription_status === 'active') {
      const invoice = generateCustomerInvoice(customer, plan);
      invoices.push(invoice);
    }
  });

  return invoices;
}
