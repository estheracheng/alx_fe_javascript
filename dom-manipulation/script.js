let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", author: "Will Rogers", category: "Inspiration" },
  { text: "It's not whether you get knocked down, it's whether you get up.", author: "Vince Lombardi", category: "Perseverance" }
];
const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const quoteList = document.getElementById("quoteList");
const categoryFilter = document.getElementById("categoryFilter");
const addQuoteForm = document.getElementById("addQuoteForm");
const quoteInput = document.getElementById("quoteInput");
const authorInput = document.getElementById("authorInput");
const categoryInput = document.getElementById("categoryInput");
const newQuoteBtn = document.getElementById("newQuoteBtn");
const exportBtn = document.getElementById("exportBtn");
const importFile = document.getElementById("importFile");
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
  if (lastFilter) {
    categoryFilter.value = lastFilter;
  }
}

function displayQuotes(filteredQuotes) {
  quoteList.innerHTML = "";
  filteredQuotes.forEach(q => {
    const li = document.createElement("li");
    li.textContent = `"${q.text}" — ${q.author} [${q.category}]`;
    quoteList.appendChild(li);
  });
}

function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);

  const filtered = selected === "all"
    ? quotes
    : quotes.filter(q => q.category === selected);

  displayQuotes(filtered);
}

function showRandomQuote() {
  const selected = categoryFilter.value;
  const filtered = selected === "all"
    ? quotes
    : quotes.filter(q => q.category === selected);

  if (filtered.length === 0) {
    quoteText.textContent = "No quotes available for this category.";
    quoteAuthor.textContent = "";
    return;
  }

  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteText.textContent = randomQuote.text;
  quoteAuthor.textContent = `— ${randomQuote.author}`;
}
addQuoteForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const newQuote = {
    text: quoteInput.value.trim(),
    author: authorInput.value.trim(),
    category: categoryInput.value.trim()
  };

  quotes.push(newQuote);
  localStorage.setItem("quotes", JSON.stringify(quotes));

  quoteInput.value = "";
  authorInput.value = "";
  categoryInput.value = "";

  populateCategories();
  filterQuotes();
});
exportBtn.addEventListener("click", function () {
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
importFile.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = importedQuotes;
        localStorage.setItem("quotes", JSON.stringify(quotes));
        populateCategories();
        filterQuotes();
      } else {
        alert("Invalid file format.");
      }
    } catch (error) {
      alert("Error reading file.");
    }
  };
  reader.readAsText(file);
});
categoryFilter.addEventListener("change", filterQuotes);
newQuoteBtn.addEventListener("click", showRandomQuote);
populateCategories();
filterQuotes();
