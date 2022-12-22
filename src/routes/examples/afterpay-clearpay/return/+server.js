import Stripe from 'stripe'
import { SECRET_STRIPE_KEY } from '$env/static/private'

const stripe = new Stripe(SECRET_STRIPE_KEY)

export async function GET(req) {
  const { searchParams } = req.url
  const intentId = searchParams.get('payment_intent')
  const clientSecret = searchParams.get('payment_intent_client_secret')
  const paymentIntent = await stripe.paymentIntents.retrieve(intentId)

  if (paymentIntent.client_secret !== clientSecret)
    throw new Error('Client secret mismatch')

  if (paymentIntent.status === 'succeeded') {
    return new Response(undefined, {
      status: 302,
      headers: {
        location: '/examples/afterpay-clearpay/thanks'
      }
    })
  }

  return new Response(undefined, {
    status: 302,
    headers: {
      location: '/examples/afterpay-clearpay?error=true'
    }
  })
}
