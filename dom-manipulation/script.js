let quotes = [
  { text: "Believe you can and you're halfway there.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Happiness is not something ready-made. It comes from your own actions.", category: "Happiness" }
];
function showRandomQuote() {
  let randomIndex = Math.floor(Math.random() * quotes.length);
  let randomQuote = quotes[randomIndex];
  let displayArea = document.getElementById("quoteDisplay");
  displayArea.innerHTML = `"${randomQuote.text}" <br><em>— ${randomQuote.category}</em>`;
}
function addQuote() {
  let quoteText = document.getElementById("newQuoteText").value.trim();
  let quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText === "" || quoteCategory === "") {
    alert("Please enter both a quote and a category!");
    return;
  }
  quotes.push({ text: quoteText, category: quoteCategory });
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added successfully!");
}
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
showRandomQuote();
