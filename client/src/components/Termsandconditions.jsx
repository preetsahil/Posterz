import React from "react";
import { Link } from "react-router-dom";

function Termsandconditions() {
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1>Terms and Conditions for Payments</h1>

      <h2 style={{ marginTop: "5px" }}>1. Introduction</h2>
      <p>
        Welcome to Posterz. By using our services and making payments through
        Razorpay, you agree to the following terms and conditions. Please read
        them carefully.
      </p>

      <h2 style={{ marginTop: "5px" }}>2. Payment Gateway</h2>
      <p>
        We use Razorpay as our third-party payment gateway to process payments.
        Razorpay is a secure payment gateway that complies with all regulatory
        requirements for processing online payments.
      </p>

      <h2 style={{ marginTop: "5px" }}>3. Payment Methods</h2>
      <p>
        Razorpay supports a variety of payment methods including credit cards,
        debit cards, net banking, UPI, and various wallets. The availability of
        specific payment methods may vary depending on your location and the
        policies of Razorpay.
      </p>

      <h2 style={{ marginTop: "5px" }}>4. Payment Processing</h2>
      <p>- All payments are processed in real-time by Razorpay.</p>
      <p>
        - Once the payment is successfully processed, you will receive a
        confirmation email from us.
      </p>
      <p>
        - If the payment fails, please check with your bank or card issuer for
        more information.
      </p>

      <h2 style={{ marginTop: "5px" }}>6. Security</h2>
      <p>
        - Your payment details are encrypted and securely processed by Razorpay.
        We do not store any of your payment information on our servers.
      </p>
      <p>
        - Razorpay complies with the Payment Card Industry Data Security
        Standard (PCI DSS) to ensure that your payment data is safe and secure.
      </p>

      <h2 style={{ marginTop: "5px" }}>7. Privacy</h2>
      <p>
        - We respect your privacy and are committed to protecting your personal
        data. Please refer to our{" "}
        <Link to="/privacy" style={{ color: "red" }}>
          Privacy Policy
        </Link>{" "}
        for more information on how we handle your data.
      </p>
      <p>
        - By using our services, you consent to the processing of your data by
        Razorpay in accordance with their privacy policy.
      </p>

      <h2 style={{ marginTop: "5px" }}>8. Disputes</h2>
      <p>
        - Any disputes related to payments should be reported to us within 30
        days of the transaction date.
      </p>
      <p>
        - For any disputes related to the payment processing by Razorpay, you
        may also contact Razorpay directly.
      </p>

      <h2 style={{ marginTop: "5px" }}>9. Changes to Terms</h2>
      <p>
        - We reserve the right to update or modify these terms and conditions at
        any time without prior notice.
      </p>
      <p>
        - It is your responsibility to review these terms periodically. Your
        continued use of our services after any changes indicates your
        acceptance of the new terms.
      </p>

      <h2 style={{ marginTop: "5px" }}>10. Contact Us</h2>
      <p>
        If you have any questions or concerns about these terms and conditions,
        please contact us at:
      </p>
      <p>
        - Email:{" "}
        <a style={{ color: "black" }} href="mailto:support@posterz.com">
          preetsahil289@gmail.com
        </a>
      </p>
      <p>- Address: NITJ ,Punjab</p>

      <p>
        By proceeding with a payment, you acknowledge that you have read,
        understood, and agree to be bound by these terms and conditions.
      </p>
    </div>
  );
}

export default Termsandconditions;
