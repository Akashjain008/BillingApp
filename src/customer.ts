import { Customer } from './entities';
import { generateUUID } from './utils';
import { BillingDurableObject } from './durable-objects';

export async function createCustomer(request: Request): Promise<Response> {
	try {
		const { name, email, subscription_plan_id }: any = await request.json();

		if (!name || !email || !subscription_plan_id) {
			return new Response(JSON.stringify({ error: 'Missing required fields' }), {
				status: 400,
			});
		}

		const customer: Customer = {
			id: generateUUID(),
			name,
			email,
			subscription_plan_id,
			subscription_status: 'active',
		};

		// Assuming the storage of customer
		const durableObject = new BillingDurableObject({} as any);
		await durableObject.state.storage.put(`customer_${customer.id}`, JSON.stringify(customer));

		return new Response(JSON.stringify({ message: 'Customer created successfully', customer }), { status: 201 });
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
			status: 500,
		});
	}
}

export async function getCustomer(request: Request): Promise<Response> {
	const url = new URL(request.url);
	const customerId = url.pathname.split('/').pop();

	if (!customerId) {
		return new Response(JSON.stringify({ error: 'Customer ID is required' }), {
			status: 400,
		});
	}

	try {
		const durableObject = new BillingDurableObject({} as any);
		const customer = await durableObject.state.storage.get(`customer_${customerId}`);

		if (customer) {
			return new Response(customer, { status: 200 });
		} else {
			return new Response(JSON.stringify({ error: 'Customer not found' }), {
				status: 404,
			});
		}
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
			status: 500,
		});
	}
}

export async function updateCustomer(request: Request): Promise<Response> {
	const url = new URL(request.url);
	const customerId = url.pathname.split('/').pop();

	if (!customerId) {
		return new Response(JSON.stringify({ error: 'Customer ID is required' }), {
			status: 400,
		});
	}

	try {
		const durableObject = new BillingDurableObject({} as any);
		const existingCustomer: any = await durableObject.state.storage.get(`customer_${customerId}`);

		if (!existingCustomer) {
			return new Response(JSON.stringify({ error: 'Customer not found' }), {
				status: 404,
			});
		}

		const { name, email, subscription_plan_id, subscription_status }: any = await request.json();
		const updatedCustomer: Customer = {
			...JSON.parse(existingCustomer),
			name: name || JSON.parse(existingCustomer).name,
			email: email || JSON.parse(existingCustomer).email,
			subscription_plan_id: subscription_plan_id || JSON.parse(existingCustomer).subscription_plan_id,
			subscription_status: subscription_status || JSON.parse(existingCustomer).subscription_status,
		};

		await durableObject.state.storage.put(`customer_${customerId}`, JSON.stringify(updatedCustomer));

		return new Response(JSON.stringify({ message: 'Customer updated successfully', customer: updatedCustomer }), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
			status: 500,
		});
	}
}

export async function deleteCustomer(request: Request): Promise<Response> {
	const url = new URL(request.url);
	const customerId = url.pathname.split('/').pop();

	if (!customerId) {
		return new Response(JSON.stringify({ error: 'Customer ID is required' }), {
			status: 400,
		});
	}

	try {
		const durableObject = new BillingDurableObject({} as any);
		await durableObject.state.storage.delete(`customer_${customerId}`);

		return new Response(JSON.stringify({ message: 'Customer deleted successfully' }), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
			status: 500,
		});
	}
}
