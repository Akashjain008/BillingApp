export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0]; // Returns current date in YYYY-MM-DD format
}

export function generateUUID(): string {
  return crypto.randomUUID();
}

export function calculateProratedAmount(
  currentPlanPrice: number,
  newPlanPrice: number,
  daysUsed: number,
  totalDays: number
): number {
  const dailyRate = currentPlanPrice / totalDays;
  const remainingAmount = dailyRate * (totalDays - daysUsed);
  return newPlanPrice - remainingAmount;
}
