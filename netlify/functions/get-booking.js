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
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: guest[1],
          customerEmail: guest[2],
          checkIn: guest[3],
          checkOut: guest[4],
          bookingAmount: +guest[5].trim(),
          depositAmount: +guest[7].trim(),
          depositPaid: Boolean(guest[8].trim()),
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
