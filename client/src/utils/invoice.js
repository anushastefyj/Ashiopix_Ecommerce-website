export const printInvoice = (order, user) => {
  const invoiceWindow = window.open('', '_blank');
  if (!invoiceWindow) {
    alert('Please allow popups to download the invoice');
    return;
  }

  const itemsHtml = order.orderItems
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: left; font-size: 12px;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; font-size: 12px;">${item.qty}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-size: 12px;">$${item.price.toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-size: 12px; font-weight: 700;">$${(item.qty * item.price).toFixed(2)}</td>
    </tr>`
    )
    .join('');

  const html = `
    <html>
      <head>
        <title>Invoice - Order #${order._id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;900&display=swap');
          body { font-family: 'Outfit', sans-serif; color: #1F2937; line-height: 1.6; padding: 40px; background-color: #fff; margin: 0; }
          .invoice-box { max-width: 800px; margin: auto; padding: 40px; border: 1px solid #e5e7eb; border-radius: 24px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03); background: #fff; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #F5F0E8; padding-bottom: 20px; }
          .logo { font-size: 28px; font-weight: 900; color: #1F2937; letter-spacing: -1px; }
          .logo span { color: #5B7CFA; }
          .tagline { font-size: 9px; color: #4B5563; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; margin-top: -2px; }
          .billing-info { font-size: 12px; color: #4B5563; line-height: 1.5; }
          .billing-info h4 { margin: 0 0 6px 0; font-size: 13px; color: #1F2937; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 30px; }
          th { background-color: #F5F0E8; font-weight: 700; text-align: left; padding: 12px; border-bottom: 2px solid #e5e7eb; font-size: 11px; text-transform: uppercase; color: #4B5563; }
          .totals { margin-top: 30px; display: flex; flex-direction: column; align-items: flex-end; font-size: 13px; color: #4B5563; }
          .totals-row { display: flex; justify-content: space-between; width: 280px; padding: 4px 0; }
          .totals-grand { display: flex; justify-content: space-between; width: 280px; padding: 10px 0 0 0; border-top: 2px solid #F5F0E8; margin-top: 8px; font-size: 18px; font-weight: 900; color: #1F2937; }
          .status-badge { display: inline-block; font-size: 10px; font-weight: 800; border-radius: 9999px; padding: 4px 12px; margin-top: 15px; text-transform: uppercase; }
          .status-pending { background-color: #FEF3C7; color: #D97706; border: 1px solid #FDE68A; }
          .status-paid { background-color: #D1FAE5; color: #065F46; border: 1px solid #A7F3D0; }
          .action-bar { max-width: 800px; margin: 0 auto 20px auto; text-align: right; }
          .print-btn { display: inline-flex; align-items: center; background-color: #5B7CFA; color: white; border: none; padding: 10px 24px; font-size: 12px; font-weight: 700; border-radius: 9999px; cursor: pointer; font-family: 'Outfit', sans-serif; transition: background 0.2s; }
          .print-btn:hover { background-color: #4864e0; }
          @media print {
            .action-bar { display: none; }
            body { padding: 0; }
            .invoice-box { border: none; box-shadow: none; padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="action-bar">
          <button class="print-btn" onclick="window.print()">Print or Save as PDF</button>
        </div>
        <div class="invoice-box">
          <div class="header">
            <div>
              <div class="logo">ASHIOPIX<span>.</span></div>
              <div class="tagline">Pixels of Perfect Shopping</div>
              <div style="margin-top: 20px; font-size: 12px; color: #6B7280;">
                <div><strong>Invoice #</strong> ${order._id}</div>
                <div><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
            <div class="billing-info" style="text-align: right;">
              <h4>Shipping Details</h4>
              <p style="font-weight: 700; color: #1F2937; margin: 0 0 4px 0;">${user?.name || 'Customer'}</p>
              <p style="margin: 0;">${order.shippingAddress.street}</p>
              <p style="margin: 0;">${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}</p>
              <p style="margin: 0;">${order.shippingAddress.country}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th style="border-top-left-radius: 12px; border-bottom-left-radius: 12px;">Product</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right; border-top-right-radius: 12px; border-bottom-right-radius: 12px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div class="totals">
            <div class="totals-row">
              <span>Subtotal</span>
              <span>$${order.itemsPrice.toFixed(2)}</span>
            </div>
            <div class="totals-row">
              <span>Shipping</span>
              <span>$${order.shippingPrice.toFixed(2)}</span>
            </div>
            <div class="totals-row">
              <span>Tax (8%)</span>
              <span>$${order.taxPrice.toFixed(2)}</span>
            </div>
            <div class="totals-grand">
              <span>Total Price</span>
              <span>$${order.totalPrice.toFixed(2)}</span>
            </div>
            
            <div>
              <span class="status-badge ${order.isPaid ? 'status-paid' : 'status-pending'}">
                ${order.paymentMethod} - ${order.isPaid ? 'Paid' : 'Pending on Delivery'}
              </span>
            </div>
          </div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 600);
          }
        </script>
      </body>
    </html>
  `;

  invoiceWindow.document.write(html);
  invoiceWindow.document.close();
};
