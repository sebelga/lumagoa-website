interface Quote {
  author: string;
  text: string;
}

export async function updateDailyQuote(): Promise<void> {
  try {
    const response = await fetch("/quotes.json");
    if (!response.ok) {
      console.error("Failed to fetch quotes.json");
      return;
    }
    const quotes: Quote[] = await response.json();

    if (quotes.length === 0) {
      console.warn("No quotes available.");
      return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];
    if (!selectedQuote || !selectedQuote.text || !selectedQuote.author) return;

    const today = +new Date(); // Get today's date
    const lastDayLastYear = +new Date(new Date().getFullYear(), 0, 0); // Dec 31 of the previous year
    const dayOfYear = Math.floor((today - lastDayLastYear) / 86400000); // e.g. for February 1st, it equals to 32

    const quote = quotes[dayOfYear % quotes.length];
    if (!quote || !quote.text || !quote.author) return;

    const quoteEl = document.getElementById("footer-quote");
    const authorEl = document.getElementById("footer-quote-author");
    if (quoteEl && authorEl) {
      quoteEl.innerText = `"${quote.text}"`;
      authorEl.innerText = `${quote.author}`;
    }
  } catch (error) {
    console.error("Error updating daily quote:", error);
  }
}
