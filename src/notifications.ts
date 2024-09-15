export async function sendNotification(request: Request): Promise<Response> {
  try {
    const { email, subject, message }: any = await request.json();

    if (!email || !subject || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
      });
    }

    const response = await fetch('https://api.mailgun.net/v3/dummy/messages', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`api:${process.env.MAILGUN_API_KEY}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        from: 'no-reply@your-domain.com',
        to: email,
        subject: subject,
        text: message,
      }),
    });

    if (response.ok) {
      return new Response(
        JSON.stringify({ message: 'Notification sent successfully' }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'Failed to send notification' }),
        { status: 500 }
      );
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}