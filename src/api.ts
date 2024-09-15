import { createSubscriptionPlan } from './subscription';
import { generateInvoice } from './invoice';
import { processPayment } from './payment';
import { sendNotification } from './notifications';

export async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname.startsWith('/create-subscription-plan')) {
    return createSubscriptionPlan(request);
  } else if (url.pathname.startsWith('/generate-invoice')) {
    return generateInvoice(request);
  } else if (url.pathname.startsWith('/process-payment')) {
    return processPayment(request);
  } else if (url.pathname.startsWith('/send-notification')) {
    return sendNotification(request);
  } else {
    return new Response('Not Found', { status: 404 });
  }
}
