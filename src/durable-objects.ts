import { Customer, SubscriptionPlan, Invoice, Payment } from './entities';
import { v4 as uuidv4 } from 'uuid';

interface StorageInterface {
  get<T>(key: string): Promise<T | undefined>;
  put<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
}

export class BillingDurableObject {
  state: DurableObjectState;
  storage: StorageInterface;

  constructor(state: DurableObjectState) {
    this.state = state;
    this.storage = {
      get: (key: string) => this.state.storage.get(key),
      put: (key: string, value: any) => this.state.storage.put(key, value),
      delete: (key: string) => this.state.storage.delete(key),
    };
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;
    const path = url.pathname;

    // Route the request to the appropriate method
    if (method === 'POST' && path === '/create-customer') {
      return this.createCustomer(request);
    } else if (method === 'GET' && path.startsWith('/get-customer')) {
      return this.getCustomer(path);
    } else if (method === 'PUT' && path.startsWith('/update-customer')) {
      return this.updateCustomer(request, path);
    } else if (method === 'DELETE' && path.startsWith('/delete-customer')) {
      return this.deleteCustomer(path);
    } else {
      return new Response('Not Found', { status: 404 });
    }
  }

  // Create a new customer and store it in Durable Object storage
  async createCustomer(request: Request): Promise<Response> {
    try {
      const customerData: Customer = await request.json();
      if (!customerData.name || !customerData.email || !customerData.subscription_plan_id) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
        });
      }

      const customer: Customer = {
        id: uuidv4(),
        ...customerData,
        subscription_status: 'active',
      };

      await this.storage.put(`customer_${customer.id}`, customer);

      return new Response(JSON.stringify({ message: 'Customer created successfully', customer }), {
        status: 201,
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to create customer' }), { status: 500 });
    }
  }

  // Retrieve a customer by ID
  async getCustomer(path: string): Promise<Response> {
    const customerId = path.split('/').pop();

    if (!customerId) {
      return new Response(JSON.stringify({ error: 'Customer ID is required' }), { status: 400 });
    }

    const customer = await this.storage.get<Customer>(`customer_${customerId}`);
    if (!customer) {
      return new Response(JSON.stringify({ error: 'Customer not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(customer), { status: 200 });
  }

  // Update customer information
  async updateCustomer(request: Request, path: string): Promise<Response> {
    const customerId = path.split('/').pop();
    if (!customerId) {
      return new Response(JSON.stringify({ error: 'Customer ID is required' }), { status: 400 });
    }

    const customer = await this.storage.get<Customer>(`customer_${customerId}`);
    if (!customer) {
      return new Response(JSON.stringify({ error: 'Customer not found' }), { status: 404 });
    }

    const updatedData = await request.json();
    const updatedCustomer = {
      ...customer,
      ...updatedData,
    };

    await this.storage.put(`customer_${customerId}`, updatedCustomer);

    return new Response(
      JSON.stringify({ message: 'Customer updated successfully', customer: updatedCustomer }),
      { status: 200 }
    );
  }

  // Delete a customer
  async deleteCustomer(path: string): Promise<Response> {
    const customerId = path.split('/').pop();

    if (!customerId) {
      return new Response(JSON.stringify({ error: 'Customer ID is required' }), { status: 400 });
    }

    const customer = await this.storage.get<Customer>(`customer_${customerId}`);
    if (!customer) {
      return new Response(JSON.stringify({ error: 'Customer not found' }), { status: 404 });
    }

    await this.storage.delete(`customer_${customerId}`);

    return new Response(JSON.stringify({ message: 'Customer deleted successfully' }), {
      status: 200,
    });
  }

  // Additional methods can be added for SubscriptionPlan, Invoice, and Payment CRUD operations

  async createSubscriptionPlan(subscriptionPlan: SubscriptionPlan): Promise<void> {
    await this.storage.put(`subscription_plan_${subscriptionPlan.id}`, subscriptionPlan);
  }

  async getSubscriptionPlan(subscriptionPlanId: string): Promise<SubscriptionPlan | undefined> {
    return this.storage.get<SubscriptionPlan>(`subscription_plan_${subscriptionPlanId}`);
  }

  async createInvoice(invoice: Invoice): Promise<void> {
    await this.storage.put(`invoice_${invoice.id}`, invoice);
  }

  async getInvoice(invoiceId: string): Promise<Invoice | undefined> {
    return this.storage.get<Invoice>(`invoice_${invoiceId}`);
  }

  async createPayment(payment: Payment): Promise<void> {
    await this.storage.put(`payment_${payment.id}`, payment);
  }

  async getPayment(paymentId: string): Promise<Payment | undefined> {
    return this.storage.get<Payment>(`payment_${paymentId}`);
  }
}
