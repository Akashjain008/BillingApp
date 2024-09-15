import { BillingDurableObject } from './durable-objects';
import { SubscriptionPlan } from './entities';

export async function createSubscriptionPlan(request: Request): Promise<Response> {
  try {
    const { name, billing_cycle, price } : any = await request.json();

    // Validate request body
    if (!name || !billing_cycle || price === undefined) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }

    // Create subscription plan object
    const subscriptionPlan: SubscriptionPlan = {
      id: crypto.randomUUID(),  // Generating a unique ID for the plan
      name,
      billing_cycle,
      price,
      status: 'active'
    };

    // Assuming the storage of subscription plan
    const durableObject = new BillingDurableObject({} as any);
    await durableObject.state.storage.put(`subscriptionPlan_${subscriptionPlan.id}`, JSON.stringify(subscriptionPlan));

    return new Response(
      JSON.stringify({ message: 'Subscription plan created', plan: subscriptionPlan }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
