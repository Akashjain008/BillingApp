import { generateInvoice } from '../src/invoice';

describe('Invoice Generation', () => {
  it('should generate an invoice successfully', async () => {
    const mockRequest = new Request('http://localhost/generate-invoice', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: '123',
        amount: 29.99,
        due_date: '2024-09-30',
      }),
    });

    const response = await generateInvoice(mockRequest);
    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data).toHaveProperty('message', 'Invoice generated');
    expect(data.invoice).toHaveProperty('amount', 29.99);
  });
});
