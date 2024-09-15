import { createSubscriptionPlan } from '../src/subscription';

describe('Subscription Management', () => {
  it('should create a subscription plan successfully', async () => {
    const mockRequest = new Request('http://localhost/create-subscription-plan', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Pro',
        billing_cycle: 'monthly',
        price: 29.99,
      }),
    });

    const response = await createSubscriptionPlan(mockRequest);
    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data).toHaveProperty('message', 'Subscription plan created');
    expect(data.plan).toHaveProperty('name', 'Pro');
  });

  it('should fail to create a subscription plan with missing fields', async () => {
    const mockRequest = new Request('http://localhost/create-subscription-plan', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Pro',
        price: 29.99,
      }),
    });

    const response = await createSubscriptionPlan(mockRequest);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('error', 'Missing required fields');
  });
});
