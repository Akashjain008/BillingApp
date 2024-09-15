import { BillingDurableObject } from './durable-objects';
import { Invoice } from './entities';

export async function generateInvoice(request: Request): Promise<Response> {
  try {
    const { customer_id, amount, due_date } : any = await request.json();

    // Logic to generate and store the invoice
    const invoice: Invoice = {
      id: crypto.randomUUID(),
      customer_id,
      amount,
      due_date,
      payment_status: 'pending'
    };

    // Assuming the storage of invoice
    const durableObject = new BillingDurableObject({} as any);
    await durableObject.state.storage.put(`invoice_${invoice.id}`, JSON.stringify(invoice));

    return new Response(
      JSON.stringify({ message: 'Invoice generated', invoice }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}

