// Ses News frontend script
window.API_URL = "https://script.google.com/macros/s/AKfycbyjeltLwzn14tM2D3RpcjIXLeF-wHXFuPPJcHTcxlr0wxbNXahDyTTWrMbk3Uzkn8k/exec";

async function fetchJSON(url) {
  const proxy = "https://api.allorigins.win/get?url=" + encodeURIComponent(url);
  const res = await fetch(proxy);
  const wrapped = await res.json();
  return JSON.parse(wrapped.contents);
}

async function loadNews() {
  const data = await fetchJSON(window.API_URL);
  renderNews(data);
}

async function loadNewsById(id) {
  const data = await fetchJSON(window.API_URL + "?id=" + encodeURIComponent(id));
  if (data.length > 0) renderSingleNews(data[0]);
}

function renderNews(newsArray) {
  const sections = {
    "বাংলাদেশ": "bangladesh-list",
    "আন্তর্জাতিক": "international-list",
    "খেলা": "sports-list",
    "চাকরি": "jobs-list"
  };

  // clear
  Object.values(sections).forEach(id => {
    document.getElementById(id).innerHTML = "";
  });
  document.getElementById("latest-list").innerHTML = "";

  newsArray.forEach(n => {
    const card = document.createElement("div");
    card.className = "news-item";
    card.innerHTML = `<h2><a href="news.html?id=${n.id}">${n.title}</a></h2><p>${n.content.substring(0,100)}...</p>`;

    let placed = false;
    for (const [cat, id] of Object.entries(sections)) {
      if (n.category.includes(cat)) {
        document.getElementById(id).appendChild(card);
        placed = true;
        break;
      }
    }
    if (!placed) {
      const li = document.createElement("li");
      li.innerHTML = `<a href="news.html?id=${n.id}">${n.title}</a>`;
      document.getElementById("latest-list").appendChild(li);
    }
  });
}

function renderSingleNews(n) {
  const container = document.getElementById("newsDetail");
  container.innerHTML = `<h1>${n.title}</h1><p><em>${n.category}</em></p><img src="${n.image}" style="max-width:100%"><p>${n.content}</p>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  if (window.location.pathname.endsWith("news.html") && params.get("id")) {
    loadNewsById(params.get("id"));
  } else {
    loadNews();
  }
});
