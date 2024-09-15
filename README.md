# Simple Billing App for SaaS Platform

## Overview

This is a billing app for a SaaS platform built using Cloudflare Workers. It supports subscription management, billing, payment processing, and notifications.

## Features

- **Subscription Management**: Create and manage subscription plans with different pricing and billing cycles.
- **Billing Engine**: Generate invoices at the end of each billing cycle and handle prorated billing.
- **Payment Processing**: Record payments and handle retries for failed payments.
- **Notifications**: Send email notifications for invoice generation, successful payments, and payment failures.

## Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Akashjain008/BillingApp
   cd BillingApp

2. **Install dependencies**

    ```bash
    npm install

3. **Configure Cloudflare Workers**

    ```bash
    Create a wrangler.toml file with your Cloudflare account details

4. **Deploy**

    ```bash
    npx wrangler publish

## API Endpoints

**Create Subscription Plan**
    URL: /create-subscription-plan
    Method: POST
    Request Body: { "name": "Pro", "billing_cycle": "monthly", "price": 29.99 }
    Response: { "message": "Subscription plan created", "plan": {...} }

**Generate Invoice**
    URL: /generate-invoice
    Method: POST
    Request Body: { "customer_id": "...", "amount": 29.99, "due_date": "2024-09-30" }
    Response: { "message": "Invoice generated", "invoice": {...} }

**Process Payment**
    URL: /process-payment
    Method: POST
    Request Body: { "invoice_id": "...", "amount": 29.99, "payment_method": "credit_card" }
    Response: { "message": "Payment processed", "payment": {...} }

**Send Notification**
    URL: /send-notification
    Method: POST
    Request Body: { "email": "...", "subject": "Invoice Generated", "message": "Your invoice has been generated." }
    Response: { "message": "Notification sent" }


## Testing
Run tests using Jest:
    ```bash
    npm test
