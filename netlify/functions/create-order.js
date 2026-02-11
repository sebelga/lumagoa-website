const Razorpay = require("razorpay");

exports.handler = async (event) => {
  // Only allow POST or GET depending on your preference;
  // POST is generally better for creating resources.
  const amount = event.queryStringParameters.amount;
  const bookingId = event.queryStringParameters.id || "manual_entry";

  // Accessing your keys securely from Environment Variables
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  if (!amount) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Amount is required" }),
    };
  }

  try {
    // Razorpay expects amount in PAISA (INR * 100)
    // We sanitize the input to ensure it's a clean number
    const amountInPaisa = Math.round(
      parseFloat(amount.replace(/,/g, "")) * 100,
    );

    const shortTimestamp = Date.now().toString().slice(-6);
    const receiptId = `${bookingId}_${shortTimestamp}`.slice(0, 40);

    const options = {
      amount: amountInPaisa,
      currency: "INR",
      receipt: receiptId,
      notes: {
        booking_reference: bookingId,
        resort: "LUMA Goa",
      },
    };

    const order = await instance.orders.create(options);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    };
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Failed to create order",
        details: error.message,
      }),
    };
  }
};
