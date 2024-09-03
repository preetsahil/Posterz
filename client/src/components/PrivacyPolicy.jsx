import React from "react";

const PrivacyPolicy = () => {
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>Privacy Policy for Payment</h2>
      <h3 style={{ marginTop: "5px" }}>
        SECTION 1 - WHAT DO WE DO WITH YOUR INFORMATION?
      </h3>
      <p>
        When you purchase something from our app or website, as part of the
        buying and selling process, we collect the personal information you give
        us such as your name, and email address. We may send you emails about
        our app, new products or services, and other updates.
      </p>

      <h3 style={{ marginTop: "5px" }}>SECTION 2 - DISCLOSURE</h3>
      <p>
        We may disclose your personal information if we are required by law to
        do so or if you violate our Terms of Service.
      </p>

      <h3 style={{ marginTop: "5px" }}>SECTION 3 - PAYMENT</h3>
      <p>
        We use Razorpay for processing payments. Our payment gateway does not
        store your card data on their servers. The data is encrypted through the
        Payment Card Industry Data Security Standard (PCI-DSS) when processing
        payment. Your purchase transaction data is only used as long as is
        necessary to complete your purchase transaction. After that is complete,
        your purchase transaction information is not saved.
      </p>
      <p>
        Our payment gateway adheres to the standards set by PCI-DSS as managed
        by the PCI Security Standards Council, which is a joint effort of brands
        like Visa, MasterCard, American Express, and Discover.
      </p>
      <p>
        PCI-DSS requirements help ensure the secure handling of credit card
        information by our store and its service providers.
      </p>
      <p>
        For more insight, you may also want to read terms and conditions of
        razorpay on{" "}
        <a
          href="https://razorpay.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://razorpay.com
        </a>
        .
      </p>

      <h3 style={{ marginTop: "5px" }}>SECTION 4 - THIRD-PARTY SERVICES</h3>
      <p>No Third Party services are used in this application.</p>

      <h3 style={{ marginTop: "5px" }}>SECTION 5 - SECURITY</h3>
      <p>
        To protect your personal information, we take reasonable precautions and
        follow industry best practices to make sure it is not inappropriately
        lost, misused, accessed, disclosed, altered, or destroyed.
      </p>

      <h3 style={{ marginTop: "5px" }}>SECTION 6 - COOKIES</h3>
      <p>
        We use cookies to maintain session of your user. It is not used to
        personally identify you on other websites.
      </p>

      <h3 style={{ marginTop: "5px" }}>
        SECTION 7 - CHANGES TO THIS PRIVACY POLICY
      </h3>
      <p>
        We reserve the right to modify this privacy policy at any time, so
        please review it frequently. Changes and clarifications will take effect
        immediately upon their posting on the website. If we make material
        changes to this policy, we will notify you here that it has been
        updated, so that you are aware of what information we collect, how we
        use it, and under what circumstances, if any, we use and/or disclose it.
        If our store is acquired or merged with another company, your
        information may be transferred to the new owners so that we may continue
        to sell products to you.
      </p>

      <h3 style={{ marginTop: "5px" }}>QUESTIONS AND CONTACT INFORMATION</h3>
      <p>
        If you would like to: access, correct, amend or delete any personal
        information we have about you, register a complaint, or simply want more
        information contact us at{" "}
        <a href="mailto:preetsahil289@gmail.com" style={{ color: "black" }}>
          preetsahil289@gmail.com{" "}
        </a>{" "}
      </p>
    </div>
  );
};

export default PrivacyPolicy;
