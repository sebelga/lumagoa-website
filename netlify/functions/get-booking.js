const axios = require("axios");

exports.handler = async (event) => {
  const bookingId = event.queryStringParameters.id?.toUpperCase();

  const SHEET_ID = process.env.GOOGLE_SHEET_ID;
  const csvUrl = `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pub?gid=0&output=csv`;

  if (!bookingId) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing ID" }) };
  }

  try {
    const response = await axios.get(`${csvUrl}&t=${Date.now()}`);
    const rows = response.data.split("\n").map((row) => row.split(","));
    const dataRows = rows.slice(1);

    // Find the specific guest
    const guest = dataRows.find(
      (row) => row[0].trim().toUpperCase() === bookingId,
    );

    if (guest) {
      const rawEmail = guest[2] || "";
      // Check if the email belongs to the booking.com relay domain
      const isBookingDotCom = rawEmail.toLowerCase().includes("booking.com");

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: guest[1],
          customerEmail: isBookingDotCom ? "" : rawEmail, // Return empty if it's booking.com relay email
          customerPhone: guest[3],
          checkIn: guest[4],
          checkOut: guest[5],
          bookingAmount: +guest[6].trim(),
          depositAmount: +guest[8].trim(),
          depositPaid: Boolean(guest[9].trim()),
        }),
      };
    } else {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Booking not found" }),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
