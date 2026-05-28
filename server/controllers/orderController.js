import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentResult,
  } = req.body;

  try {
    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Check stock for all products before creating order
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }
      if (product.stock < item.qty) {
        return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
      }
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: paymentResult ? paymentResult.status === 'succeeded' : false,
      paidAt: paymentResult && paymentResult.status === 'succeeded' ? Date.now() : undefined,
      paymentResult,
      stripePaymentId: paymentResult ? paymentResult.id : undefined,
    });

    const createdOrder = await order.save();

    // Deduct stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty },
      });
    }

    res.status(201).json(createdProductOrderDetails(createdOrder));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createdProductOrderDetails = (order) => {
  return order;
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (order) {
      // Allow user to see their own order, or admin to see any order
      if (
        order.user._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({ message: 'Not authorized to view this order' });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      const { status } = req.body;
      if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid order status' });
      }

      order.orderStatus = status;
      if (status === 'delivered') {
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate invoice for an order
// @route   GET /api/orders/:id/invoice
// @access  Private
export const getOrderInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Generate clean text-based / HTML invoice
    const itemsHtml = order.orderItems
      .map(
        (item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.qty}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${item.price.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${(item.qty * item.price).toFixed(2)}</td>
      </tr>`
      )
      .join('');

    const invoiceHtml = `
      <html>
        <head>
          <title>Invoice - Order #${order._id}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
            .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, .15); }
            h1 { font-weight: 300; margin-bottom: 0; }
            .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #f7f7f7; font-weight: bold; text-align: left; padding: 8px; border-bottom: 2px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header">
              <div>
                <h1>Ashiopix</h1>
                <p>Order #${order._id}</p>
                <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div style="text-align: right;">
                <h3>Customer</h3>
                <p>${order.user.name}</p>
                <p>${order.user.email}</p>
                <p>${order.shippingAddress.street}, ${order.shippingAddress.city}</p>
                <p>${order.shippingAddress.state}, ${order.shippingAddress.postalCode}</p>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Unit Price</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            <div style="text-align: right; margin-top: 20px;">
              <p>Items Subtotal: $${order.itemsPrice.toFixed(2)}</p>
              <p>Shipping: $${order.shippingPrice.toFixed(2)}</p>
              <p>Tax: $${order.taxPrice.toFixed(2)}</p>
              <h3>Total Amount: $${order.totalPrice.toFixed(2)}</h3>
              <p>Status: <strong>${order.isPaid ? 'PAID' : 'UNPAID'}</strong></p>
            </div>
          </div>
        </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(invoiceHtml);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
