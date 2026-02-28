import nodemailer from "nodemailer";
import "dotenv/config"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.APP_PASSWORD,
  },
});

export const sendOtpMail = async (to, otp) => {
  await transporter.sendMail({
    from: `"YourStore Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Password Reset OTP - YourStore",
    html: `
    <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:40px;">
      <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:10px;">
        
        <h2 style="color:#333;">Reset Your Password</h2>
        
        <p style="color:#555;">
          We received a request to reset your password.
        </p>

        <div style="text-align:center; margin:30px 0;">
          <span style="font-size:28px; letter-spacing:6px; font-weight:bold; background:#000; color:#fff; padding:12px 20px; border-radius:6px;">
            ${otp}
          </span>
        </div>

        <p style="color:#777;">
          This OTP will expire in <b>5 minutes</b>. Do not share it with anyone.
        </p>

        <hr style="margin:30px 0;" />

        <p style="font-size:12px; color:#aaa;">
          If you did not request this, please ignore this email.
        </p>

      </div>
    </div>
    `,
  });
};

export const sendWelcomeMail = async (to, name) => {
  await transporter.sendMail({
    from: `"YourStore" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Welcome to OUTFYT 🎉",
    html: `
    <div style="font-family: Arial; background:#f4f4f4; padding:40px;">
      <div style="max-width:600px; margin:auto; background:#fff; padding:30px; border-radius:10px;">
        
        <h2>Welcome ${name}! 👋</h2>
        
        <p>Thank you for creating an account with us.</p>
        
        <p>
          We're excited to have you onboard. Start exploring our latest collections now!
        </p>

        <div style="text-align:center; margin:30px 0;">
          <a href="https://yourstore.com"
             style="background:#000; color:#fff; padding:12px 25px; text-decoration:none; border-radius:6px;">
             Start Shopping
          </a>
        </div>

        <p style="font-size:12px; color:#aaa;">
          Need help? Contact our support anytime.
        </p>

      </div>
    </div>
    `,
  });

  console.log("send mail done 😀")
};

export const sendOrderConfirmationMail = async (to, order) => {
  await transporter.sendMail({
    from: `"YourStore Orders" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Order Confirmed - ${order._id}`,
    html: `
    <div style="font-family: Arial; background:#f4f4f4; padding:40px;">
      <div style="max-width:600px; margin:auto; background:#fff; padding:30px; border-radius:10px;">
        
        <h2>Order Confirmed ✅</h2>
        
        <p>Thank you for your purchase!</p>
        
        <p><b>Order ID:</b> ${order._id}</p>
        <p><b>Total Amount:</b> ₹${order.totalAmount}</p>

        <p><b>Shipping Address:</b><br/>
        ${order.address}</p>

        <hr/>

        <p style="color:#555;">
          We will notify you once your order is shipped.
        </p>

      </div>
    </div>
    `,
  });
};

export const sendPaymentSuccessMail = async (to, order, transactionId) => {
  await transporter.sendMail({
    from: `"YourStore Payments" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Payment Successful 💳",
    html: `
    <div style="font-family: Arial; background:#f4f4f4; padding:40px;">
      <div style="max-width:600px; margin:auto; background:#fff; padding:30px; border-radius:10px;">
        
        <h2>Payment Successful 🎉</h2>
        
        <p>Your payment has been received successfully.</p>

        <p><b>Order ID:</b> ${order._id}</p>
        <p><b>Transaction ID:</b> ${transactionId}</p>
        <p><b>Amount Paid:</b> ₹${order.totalAmount}</p>

        <hr/>

        <p style="color:#555;">
          Your order is now being processed.
        </p>

      </div>
    </div>
    `,
  });
};