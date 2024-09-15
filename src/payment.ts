import { BillingDurableObject } from './durable-objects';
import { Payment } from './entities';

export async function processPayment(request: Request): Promise<Response> {
  try {
    const { invoice_id, amount, payment_method } : any = await request.json();

    // Logic to process and store the payment
    const payment: Payment = {
      id: crypto.randomUUID(),
      invoice_id,
      amount,
      payment_method,
      payment_date: new Date().toISOString()
    };

    // Assuming the storage of payment
    const durableObject = new BillingDurableObject({} as any);
    await durableObject.state.storage.put(`payment_${payment.id}`, JSON.stringify(payment));

    return new Response(
      JSON.stringify({ message: 'Payment processed', payment }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
