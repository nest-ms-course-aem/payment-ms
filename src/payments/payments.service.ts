import Stripe from 'stripe';

import { Injectable } from '@nestjs/common';
import { envs } from 'src/config/envs';
import { PaymentSessionDto } from './dto/create-session.dto';
import { Request, Response } from 'express';

@Injectable()
export class PaymentsService {

    private readonly stripeClient = new Stripe(envs.secretApiKey);

    async createPaymentSession(paymentSessionDto: PaymentSessionDto) {

        const { currency, items, orderId } = paymentSessionDto;
        const lineItems = items.map(item => ({
            price_data: {
                currency,
                product_data: {
                    name: item.name
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        const createSession = await this.stripeClient.checkout.sessions.create({
            payment_intent_data: {
                metadata: {
                    orderId
                }
            },
            line_items: lineItems,
            mode: 'payment',
            success_url: envs.succesUrl,
            cancel_url: envs.cancelUrl,
        });
        return createSession;
    }

    handleWebhook(req: Request, res: Response) {
        const signature = req.headers['stripe-signature'];
        //Testing
        // const endpointSecret = 'whsec_61ed72f05d90826052fff68cf6c54653d18fcfec38a2a6e20df2ec3aaf001081';
        //Real
        const endpointSecret = envs.endpointSecet;
        //The previous signature and endpoint secret are valdiated to check if those request actually come from stripe
        let event: Stripe.Event;
        try {
            event = this.stripeClient.webhooks.constructEvent(req['rawBody'], signature, endpointSecret);
        }
        catch (err) {
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }
        switch (event?.type) {
            case 'charge.succeeded':
                const paymentIntent = event.data.object;
                console.log('PaymentIntent was successful!', {
                    metadata: {
                        orderId: paymentIntent.metadata
                    }
                });
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        // console.log({ event }); 
        //Because of the raw evidence
        return res.status(201).json({ signature })
    }

}


/**
 * Event charge succeeded is the one we need to be aware of
 * 
 * {
        event: {
            id: 'evt_3Px1EvP0GbtvUfX01uBSrV70',
            object: 'event',
            api_version: '2024-06-20',
            created: 1725863901,
            data: { object: [Object] },
            livemode: false,
            pending_webhooks: 2,
            request: {
            id: 'req_e2v5WkeUruUkcU',
            idempotency_key: '7460a085-f884-4eb3-8ccc-41c437bb29b0'
            },
            type: 'charge.succeeded'
        }
    }
 */