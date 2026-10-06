// Charge le contenu depuis content/site.json (modifiable via /admin).
// Tout champ vide est simplement masqué : rien n'est obligatoire.
const $ = (id) => document.getElementById(id);

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}
const isUrl = (u) => typeof u === "string" && /^https?:\/\//.test(u);

// Menu mobile
$("burger").addEventListener("click", () => $("nav").classList.toggle("open"));
$("nav").addEventListener("click", () => $("nav").classList.remove("open"));

// Lightbox
const lb = $("lightbox");
lb.addEventListener("click", () => (lb.hidden = true));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") lb.hidden = true; });

fetch("content/site.json")
  .then((r) => r.json())
  .then((d) => {
    const name = d.name || "Notre restaurant";
    document.title = name + " – Restaurant";
    $("logo").textContent = name;
    $("hero-title").textContent = name;
    $("tagline").textContent = d.tagline || "";
    $("footer").textContent = `© ${new Date().getFullYear()} ${name} – Tous droits réservés`;

    // Bandeau d'annonce
    if (d.announcement) { $("banner").textContent = d.announcement; $("banner").hidden = false; }

    // Image d'accueil
    if (d.hero_image) $("top").style.setProperty("--hero", `url(${JSON.stringify(d.hero_image)})`);

    // Bouton de réservation : lien de réservation en ligne s'il existe, sinon appel téléphonique
    const tel = d.phone ? "tel:" + d.phone.replace(/[^\d+]/g, "") : "";
    const link = d.reservation_link || tel;
    if (link) {
      [$("cta-reserve"), $("call-bar")].forEach((a) => {
        a.href = link;
        a.hidden = false;
        if (d.reservation_link) { a.target = "_blank"; a.rel = "noopener"; }
      });
      $("cta-reserve").textContent = d.reservation_link ? "Réserver une table" : "Réserver par téléphone";
    }

    // À propos
    $("about-title").textContent = d.about_title || "";
    $("about-text").textContent = d.about_text || "";
    if (d.about_image) { $("about-image").src = d.about_image; $("about-image").hidden = false; }
    (d.highlights || []).forEach((h) => {
      const c = el("div", "highlight");
      c.appendChild(el("div", "icon", h.icon));
      c.appendChild(el("h3", "", h.title));
      c.appendChild(el("p", "", h.text));
      $("highlights").appendChild(c);
    });

    // Carte avec onglets
    const cats = (d.menu || []).filter((c) => c.category);
    if (!cats.length) $("menu").hidden = true;
    const panels = [], tabs = [];
    cats.forEach((cat, i) => {
      const tab = el("button", "tab" + (i === 0 ? " active" : ""), cat.category);
      const box = el("div", "menu-cat");
      box.hidden = i !== 0;
      box.appendChild(el("h3", "", cat.category));
      (cat.items || []).forEach((it) => {
        const row = el("div", "menu-item");
        const left = el("div");
        left.appendChild(el("strong", "", it.name));
        left.appendChild(el("span", "", it.description));
        row.appendChild(left);
        row.appendChild(el("div", "price", it.price));
        box.appendChild(row);
      });
      tab.addEventListener("click", () => {
        tabs.forEach((t, j) => { t.classList.toggle("active", j === i); panels[j].hidden = j !== i; });
      });
      tabs.push(tab); panels.push(box);
      $("menu-tabs").appendChild(tab);
      $("menu-list").appendChild(box);
    });

    // Galerie
    const photos = (d.gallery || []).filter(Boolean);
    if (photos.length) {
      $("gallery").hidden = false;
      photos.forEach((src) => {
        const img = el("img");
        img.src = src; img.alt = "Photo du restaurant"; img.loading = "lazy";
        img.addEventListener("click", () => { lb.querySelector("img").src = src; lb.hidden = false; });
        $("gallery-list").appendChild(img);
      });
    }

    // Avis
    const reviews = (d.reviews || []).filter((r) => r.text);
    if (reviews.length) {
      $("reviews").hidden = false;
      reviews.forEach((r) => {
        const c = el("div", "review");
        c.appendChild(el("div", "stars", "★★★★★"));
        c.appendChild(el("p", "", "« " + r.text + " »"));
        c.appendChild(el("small", "", r.author));
        $("reviews-list").appendChild(c);
      });
    }

    // Horaires & contact
    (d.hours || []).forEach((h) => {
      const li = el("li");
      li.appendChild(el("span", "", h.day));
      li.appendChild(el("span", "", h.time));
      $("hours-list").appendChild(li);
    });
    $("address").textContent = d.address || "";
    if (d.phone) { $("phone").textContent = d.phone; $("phone").href = tel; } else $("phone").hidden = true;
    if (d.email) { $("email").textContent = d.email; $("email").href = "mailto:" + d.email; } else $("email").hidden = true;
    if (isUrl(d.instagram)) { $("instagram").href = d.instagram; $("instagram").hidden = false; }
    if (isUrl(d.facebook)) { $("facebook").href = d.facebook; $("facebook").hidden = false; }
    if (d.address) {
      $("map").src = "https://www.google.com/maps?q=" + encodeURIComponent(d.address) + "&output=embed";
      $("map").hidden = false;
    }
  })
  .catch(() => {
    document.body.insertAdjacentHTML("afterbegin",
      "<p style='padding:5rem 1rem;text-align:center'>Impossible de charger le contenu. Ouvre le site via un serveur (Netlify, Live Server…), pas en double-clic.</p>");
  });
