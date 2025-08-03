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

    const quoteElement = document.getElementById("daily-quote");
    if (quoteElement && selectedQuote) {
      quoteElement.textContent = `"${selectedQuote.text}" - ${selectedQuote.author}`;
    } else {
      console.warn('Element with id "daily-quote" not found');
    }
  } catch (error) {
    console.error("Error updating daily quote:", error);
  }
}
