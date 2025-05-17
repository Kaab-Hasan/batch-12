import { createPaymentIntent, confirmPayment } from '../utils/stripe.js';
import Order from '../models/orderModel.js';

// @desc    Create Stripe payment intent
// @route   POST /api/checkout/create-payment-intent
// @access  Private
export const createStripePaymentIntent = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    // Validate input
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Create payment intent with Stripe
    const paymentIntent = await createPaymentIntent(
      amount,
      'usd',
      { orderId, userId: req.user._id.toString() }
    );

    // Return the client secret to the client
    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: error.message || 'Payment setup failed' });
  }
};

// @desc    Confirm payment success (webhook or client notification)
// @route   POST /api/checkout/confirm-payment
// @access  Private
export const confirmPaymentSuccess = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    // Validate input
    if (!paymentIntentId || !orderId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Confirm payment with Stripe
    const paymentIntent = await confirmPayment(paymentIntentId);

    // If payment is successful, update order status
    if (paymentIntent.status === 'succeeded') {
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Update order status and payment details
      order.status = 'processing';
      order.paymentResult = {
        id: paymentIntent.id,
        status: paymentIntent.status,
        update_time: new Date().toISOString(),
        email_address: req.user.email
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(400).json({ 
        message: 'Payment not completed', 
        status: paymentIntent.status 
      });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ message: error.message || 'Payment confirmation failed' });
  }
};

// @desc    Handle Stripe webhook events
// @route   POST /api/checkout/webhook
// @access  Public
export const handleStripeWebhook = async (req, res) => {
  const stripe = await import('../utils/stripe.js').then(module => module.default);
  
  // Verify webhook signature
  let event;
  try {
    const signature = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error.message);
    return res.status(400).json({ message: `Webhook Error: ${error.message}` });
  }

  // Handle specific events
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`Payment succeeded: ${paymentIntent.id}`);
      
      // If there's metadata with orderId, update the order
      if (paymentIntent.metadata && paymentIntent.metadata.orderId) {
        try {
          const order = await Order.findById(paymentIntent.metadata.orderId);
          if (order) {
            order.status = 'processing';
            order.paymentResult = {
              id: paymentIntent.id,
              status: 'succeeded',
              update_time: new Date().toISOString()
            };
            await order.save();
          }
        } catch (error) {
          console.error('Error updating order from webhook:', error);
        }
      }
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log(`Payment failed: ${failedPayment.id}`);
      
      // Handle failed payment if needed
      break;
      
    default:
      // Unexpected event type
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
}; 