import nodemailer from 'nodemailer'

interface Address {
  name: string
  address_line: string
  city: string
  state: string
  zip: string
  country: string
}

interface OrderEmailData {
  orderId: number
  customerName: string
  customerEmail: string
  totalAmount: number
  discountCode?: string
  discountAmount?: number
  shippingAddress: Address
  billingAddress: Address
  items: Array<{
    product: { title: string }
    customization_json: string | null
    qty: number
    price: number
  }>
}

// Create transporter with Gmail SMTP (for demo purposes)
// In production, use a service like SendGrid, Mailgun, or AWS SES
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.EMAIL_SMTP_PASS || process.env.EMAIL_PASS
  }
})

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const { orderId, customerName, customerEmail, totalAmount, discountCode, discountAmount, shippingAddress, items } = data

  const orderItemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.product.title}</strong>
        ${item.customization_json ? `<br><small style="color: #666;">Customization: ${JSON.parse(item.customization_json).text || 'Custom'}</small>` : ''}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.qty}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toFixed(2)}</td>
    </tr>
  `).join('')

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - DreamKnot</title>
    </head>
    <body style="font-family: 'Playfair Display', serif; margin: 0; padding: 0; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #19325C 0%, #2D4A7A 100%); color: white; padding: 40px 30px; text-align: center;">
          <h1 style="font-family: 'Great Vibes', cursive; font-size: 48px; margin: 0; color: #F6E6B6;">DreamKnot</h1>
          <h2 style="font-size: 24px; margin: 10px 0 0 0; color: #D4C08A;">Order Confirmation</h2>
        </div>

        <!-- Order Details -->
        <div style="padding: 30px;">
          <div style="background: linear-gradient(135deg, #F6E6B6 0%, #C1A86F 100%); color: #19325C; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
            <h3 style="margin: 0 0 15px 0; font-size: 20px;">Thank you for your order, ${customerName}!</h3>
            <p style="margin: 0; font-size: 16px;">Your order has been received and is being processed. We'll send you updates as your personalized gifts are created.</p>
          </div>

          <div style="margin-bottom: 30px;">
            <h3 style="color: #19325C; border-bottom: 2px solid #C1A86F; padding-bottom: 10px;">Order Details</h3>
            <p style="margin: 10px 0;"><strong>Order Number:</strong> #${orderId.toString().padStart(6, '0')}</p>
            <p style="margin: 10px 0;"><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
            ${discountCode ? `<p style="margin: 10px 0;"><strong>Discount Applied:</strong> ${discountCode} (-₹${discountAmount?.toFixed(2)})</p>` : ''}
            <p style="margin: 10px 0;"><strong>Total Amount:</strong> ₹${totalAmount.toFixed(2)}</p>
          </div>

          <!-- Order Items -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #19325C; border-bottom: 2px solid #C1A86F; padding-bottom: 10px;">Items Ordered</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f8f9fa;">
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #C1A86F; color: #19325C;">Product</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 2px solid #C1A86F; color: #19325C;">Qty</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #C1A86F; color: #19325C;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${orderItemsHtml}
                ${discountCode ? `
                <tr style="background-color: #f0f8f0;">
                  <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Subtotal:</td>
                  <td style="padding: 10px; text-align: right;">₹${(totalAmount + (discountAmount || 0)).toFixed(2)}</td>
                </tr>
                <tr style="background-color: #fff0f0;">
                  <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; color: #d32f2f;">Discount (${discountCode}):</td>
                  <td style="padding: 10px; text-align: right; color: #d32f2f;">-₹${discountAmount?.toFixed(2)}</td>
                </tr>
                ` : ''}
                <tr style="background-color: #f8f9fa; font-weight: bold;">
                  <td colspan="2" style="padding: 15px; text-align: right; border-top: 2px solid #C1A86F;">Total:</td>
                  <td style="padding: 15px; text-align: right; border-top: 2px solid #C1A86F; color: #19325C;">₹${totalAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Shipping Address -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #19325C; border-bottom: 2px solid #C1A86F; padding-bottom: 10px;">Shipping Address</h3>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px;">
              <p style="margin: 0; line-height: 1.6;">
                ${shippingAddress.name}<br>
                ${shippingAddress.address_line}<br>
                ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}<br>
                ${shippingAddress.country}
              </p>
            </div>
          </div>

          <!-- What's Next -->
          <div style="background: linear-gradient(135deg, #19325C 0%, #2D4A7A 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
            <h3 style="margin: 0 0 15px 0;">What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">We'll start creating your personalized gifts within 24 hours</li>
              <li style="margin-bottom: 8px;">You'll receive email updates on your order progress</li>
              <li style="margin-bottom: 8px;">Standard delivery takes 7-10 business days</li>
              <li style="margin-bottom: 0;">Track your order anytime in your account</li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #333333; color: white; padding: 30px; text-align: center;">
          <p style="margin: 0 0 15px 0; font-size: 18px; font-family: 'Great Vibes', cursive;">DreamKnot</p>
          <p style="margin: 0 0 15px 0; font-size: 14px; color: #cccccc;">
            Creating personalized gifts that bring joy and meaning to every occasion.
          </p>
          <p style="margin: 0; font-size: 12px; color: #999999;">
            Questions? Contact us at support@dreamknot.com<br>
            &copy; 2025 DreamKnot. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  const mailOptions = {
    from: `"DreamKnot" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: `Order Confirmation - DreamKnot #${orderId.toString().padStart(6, '0')}`,
    html: html
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Order confirmation email sent:', info.messageId)
    return true
  } catch (error) {
    console.error('Failed to send order confirmation email:', error)
    return false
  }
}

export async function sendAdminOrderNotification(data: OrderEmailData) {
  const { orderId, customerName, customerEmail, totalAmount, discountCode, discountAmount, items } = data

  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER

  if (!adminEmail) return false

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Order Received - DreamKnot</h2>
      <p><strong>Order ID:</strong> #${orderId.toString().padStart(6, '0')}</p>
      <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
      ${discountCode ? `<p><strong>Discount Applied:</strong> ${discountCode} (-₹${discountAmount?.toFixed(2)})</p>` : ''}
      <p><strong>Total:</strong> ₹${totalAmount.toFixed(2)}</p>
      <p><strong>Items:</strong> ${items.length}</p>

      <h3>Order Items:</h3>
      <ul>
        ${items.map(item => `<li>${item.product.title} - Qty: ${item.qty} - ₹${item.price.toFixed(2)}</li>`).join('')}
      </ul>

      <p>Please process this order in the admin dashboard.</p>
    </div>
  `

  const mailOptions = {
    from: `"DreamKnot" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: `New Order - DreamKnot #${orderId.toString().padStart(6, '0')}`,
    html: html
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Admin notification email sent:', info.messageId)
    return true
  } catch (error) {
    console.error('Failed to send admin notification email:', error)
    return false
  }
}

export async function sendOrderStatusUpdateEmail(orderId: number, customerEmail: string, customerName: string, newStatus: string) {
  const statusMessages = {
    pending: 'Your order is being prepared',
    processing: 'Your personalized gifts are being created',
    in_production: 'Your custom items are in production',
    shipped: 'Your order has been shipped!',
    delivered: 'Your order has been delivered',
    cancelled: 'Your order has been cancelled'
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Update - DreamKnot</title>
    </head>
    <body style="font-family: 'Playfair Display', serif; margin: 0; padding: 0; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #19325C 0%, #2D4A7A 100%); color: white; padding: 40px 30px; text-align: center;">
          <h1 style="font-family: 'Great Vibes', cursive; font-size: 48px; margin: 0; color: #F6E6B6;">DreamKnot</h1>
          <h2 style="font-size: 24px; margin: 10px 0 0 0; color: #D4C08A;">Order Update</h2>
        </div>

        <!-- Status Update -->
        <div style="padding: 30px;">
          <div style="background: linear-gradient(135deg, #F6E6B6 0%, #C1A86F 100%); color: #19325C; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
            <h3 style="margin: 0 0 15px 0; font-size: 20px;">Hello ${customerName}!</h3>
            <p style="margin: 0; font-size: 16px;">${statusMessages[newStatus as keyof typeof statusMessages] || 'Your order status has been updated'}</p>
          </div>

          <div style="margin-bottom: 30px;">
            <h3 style="color: #19325C; border-bottom: 2px solid #C1A86F; padding-bottom: 10px;">Order Details</h3>
            <p style="margin: 10px 0;"><strong>Order Number:</strong> #${orderId.toString().padStart(6, '0')}</p>
            <p style="margin: 10px 0;"><strong>New Status:</strong> <span style="color: #19325C; font-weight: bold;">${newStatus.replace('_', ' ').toUpperCase()}</span></p>
            <p style="margin: 10px 0;"><strong>Update Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>

          <!-- Next Steps -->
          <div style="background: linear-gradient(135deg, #19325C 0%, #2D4A7A 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
            <h3 style="margin: 0 0 15px 0;">What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px;">
              ${newStatus === 'shipped' ? "<li style=\"margin-bottom: 8px;\">Track your package with the tracking number we'll send separately</li>" : ''}
              ${newStatus === 'in_production' ? "<li style=\"margin-bottom: 8px;\">Your personalized items are being carefully crafted</li>" : ''}
              ${newStatus === 'processing' ? "<li style=\"margin-bottom: 8px;\">Our team is preparing your order for production</li>" : ''}
              <li style="margin-bottom: 0;">Check your order status anytime in your account</li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #333333; color: white; padding: 30px; text-align: center;">
          <p style="margin: 0 0 15px 0; font-size: 18px; font-family: 'Great Vibes', cursive;">DreamKnot</p>
          <p style="margin: 0 0 15px 0; font-size: 14px; color: #cccccc;">
            Creating personalized gifts that bring joy and meaning to every occasion.
          </p>
          <p style="margin: 0; font-size: 12px; color: #999999;">
            Questions? Contact us at support@dreamknot.com<br>
            &copy; 2025 DreamKnot. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  const mailOptions = {
    from: `"DreamKnot" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: `Order Update - DreamKnot #${orderId.toString().padStart(6, '0')}`,
    html: html
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Order status update email sent:', info.messageId)
    return true
  } catch (error) {
    console.error('Failed to send order status update email:', error)
    return false
  }
}
