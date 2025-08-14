let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", author: "Will Rogers", category: "Inspiration" },
  { text: "It's not whether you get knocked down, it's whether you get up.", author: "Vince Lombardi", category: "Perseverance" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const addQuoteForm = document.getElementById("addQuoteForm");
const quoteInput = document.getElementById("quoteInput");
const authorInput = document.getElementById("authorInput");
const categoryInput = document.getElementById("categoryInput");
const newQuoteBtn = document.getElementById("newQuoteBtn");
const exportBtn = document.getElementById("exportBtn");
const importFile = document.getElementById("importFile");
const syncBtn = document.getElementById("syncBtn");

function populateCategories() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(option);
  });

  const lastFilter = localStorage.getItem("selectedCategory");
  if (lastFilter) categoryFilter.value = lastFilter;
}

function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);

  const filtered = selected === "all"
    ? quotes
    : quotes.filter(q => q.category === selected);

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "No quotes available for this category.";
    return;
  }

  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = `"${randomQuote.text}" — ${randomQuote.author} [${randomQuote.category}]`;
}

function showRandomQuote() {
  filterQuotes(); 
}

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
    const data = await response.json();
    console.log("Quote posted to server:", data);
  } catch (error) {
    console.error("Error posting quote to server:", error);
  }
}

addQuoteForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const newQuote = {
    text: quoteInput.value.trim(),
    author: authorInput.value.trim(),
    category: categoryInput.value.trim()
  };

  if (!newQuote.text || !newQuote.author || !newQuote.category) {
    alert("Please fill in all fields!");
    return;
  }

  quotes.push(newQuote);
  localStorage.setItem("quotes", JSON.stringify(quotes));

  quoteInput.value = "";
  authorInput.value = "";
  categoryInput.value = "";

  populateCategories();
  filterQuotes();

  // Post to server simulation
  postQuoteToServer(newQuote);
});

exportBtn.addEventListener("click", function() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

importFile.addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        localStorage.setItem("quotes", JSON.stringify(quotes));
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch {
      alert("Error reading JSON file.");
    }
  };
  reader.readAsText(file);
});

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();
    const serverQuotes = data.slice(0, 5).map(item => ({
      text: item.title,
      author: "Server User",
      category: "Server"
    }));
    return serverQuotes;
  } catch (error) {
    console.error("Error fetching server quotes:", error);
    return [];
  }
}

async function syncWithServer() {
  const serverQuotes = await fetchQuotesFromServer();
  let newDataAdded = false;

  serverQuotes.forEach(serverQuote => {
    const exists = quotes.some(
      q => q.text === serverQuote.text && q.author === serverQuote.author
    );
    if (!exists) {
      quotes.push(serverQuote);
      newDataAdded = true;
    }
  });

  if (newDataAdded) {
    localStorage.setItem("quotes", JSON.stringify(quotes));
    populateCategories();
    filterQuotes();
    alert("Quotes synced with server! New quotes were added.");
  }
}

setInterval(syncWithServer, 30000);

syncBtn.addEventListener("click", syncWithServer);

categoryFilter.addEventListener("change", filterQuotes);
newQuoteBtn.addEventListener("click", showRandomQuote);

populateCategories();
filterQuotes();
