import Order from '../models/orderModel.js';

// @desc    Create mock payment intent
// @route   POST /api/checkout/create-payment-intent
// @access  Private
export const createStripePaymentIntent = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    // Validate input
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Return mock payment intent
    res.json({
      clientSecret: 'mock_payment_success',
      orderId: orderId
    });
  } catch (error) {
    console.error('Error creating mock payment:', error);
    res.status(500).json({ message: error.message || 'Payment setup failed' });
  }
};

// @desc    Confirm payment success
// @route   POST /api/checkout/confirm-payment
// @access  Private
export const confirmPaymentSuccess = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Validate input
    if (!orderId) {
      return res.status(400).json({ message: 'Missing order ID' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status and payment details
    order.status = 'processing';
    order.paymentResult = {
      id: 'mock_payment_' + Date.now(),
      status: 'succeeded',
      update_time: new Date().toISOString(),
      email_address: req.user.email
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ message: error.message || 'Payment confirmation failed' });
  }
};

// @desc    Handle mock webhook events (disabled)
// @route   POST /api/checkout/webhook
// @access  Public
export const handleStripeWebhook = async (req, res) => {
  // Return success response for mock webhook
  res.json({ received: true });
}; 