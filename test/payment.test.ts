import { processPayment } from '../src/payment';

describe('Payment Processing', () => {
  it('should process a payment successfully', async () => {
    const mockRequest = new Request('http://localhost/process-payment', {
      method: 'POST',
      body: JSON.stringify({
        invoice_id: '456',
        amount: 29.99,
        payment_method: 'credit_card',
      }),
    });

    const response = await processPayment(mockRequest);
    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data).toHaveProperty('message', 'Payment processed');
    expect(data.payment).toHaveProperty('amount', 29.99);
  });
});
