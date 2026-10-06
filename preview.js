// Prévisualisation en direct (volet de droite dans l'admin).
// Elle réutilise css/style.css : le rendu est identique au vrai site.
const h = CMS.h;

CMS.registerPreviewStyle("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Inter:wght@400;500&display=swap");
CMS.registerPreviewStyle("/css/style.css");

const SitePreview = ({ entry, getAsset }) => {
  const get = (k) => entry.getIn(["data", k]);
  const list = (k) => { const v = get(k); return v && v.toJS ? v.toJS() : []; };
  const asset = (p) => (p ? getAsset(p).toString() : "");

  const name = get("name") || "";
  const heroSrc = asset(get("hero_image"));
  const aboutSrc = asset(get("about_image"));

  return h("div", {},
    get("announcement") ? h("div", { className: "banner" }, get("announcement")) : null,

    h("header", { className: "nav", style: { position: "static" } },
      h("span", { className: "logo" }, name)),

    h("section", { className: "hero", style: { minHeight: "50vh", "--hero": heroSrc ? `url("${heroSrc}")` : "none" } },
      h("div", { className: "hero-content" },
        h("h1", {}, name),
        h("p", {}, get("tagline") || ""),
        h("div", { className: "hero-btns" },
          h("span", { className: "btn" }, get("reservation_link") ? "Réserver une table" : "Réserver par téléphone"),
          h("span", { className: "btn btn-ghost" }, "Voir la carte")))),

    h("section", { className: "section" },
      h("div", { className: "about" },
        aboutSrc ? h("img", { src: aboutSrc, alt: "" }) : null,
        h("div", {}, h("h2", {}, get("about_title") || ""), h("p", {}, get("about_text") || ""))),
      h("div", { className: "highlights" },
        list("highlights").map((x, i) => h("div", { className: "highlight", key: i },
          h("div", { className: "icon" }, x.icon), h("h3", {}, x.title), h("p", {}, x.text))))),

    h("section", { className: "section" },
      h("h2", { className: "title" }, "Notre carte"),
      list("menu").map((cat, i) => h("div", { className: "menu-cat", key: i },
        h("h3", {}, cat.category),
        (cat.items || []).map((it, j) => h("div", { className: "menu-item", key: j },
          h("div", {}, h("strong", {}, it.name), h("span", {}, it.description)),
          h("div", { className: "price" }, it.price)))))),

    list("gallery").length ? h("section", { className: "section" },
      h("h2", { className: "title" }, "Galerie"),
      h("div", { className: "gallery" },
        list("gallery").map((p, i) => h("img", { key: i, src: asset(p), alt: "" })))) : null,

    list("reviews").length ? h("section", { className: "section" },
      h("h2", { className: "title" }, "Avis"),
      h("div", { className: "reviews" },
        list("reviews").map((r, i) => h("div", { className: "review", key: i },
          h("div", { className: "stars" }, "★★★★★"),
          h("p", {}, "« " + (r.text || "") + " »"),
          h("small", {}, r.author))))) : null,

    h("section", { className: "section" },
      h("h2", { className: "title" }, "Infos & réservation"),
      h("div", { className: "contact-grid" },
        h("div", { className: "card" }, h("h3", {}, "Horaires"),
          h("ul", {}, list("hours").map((x, i) => h("li", { key: i }, h("span", {}, x.day), h("span", {}, x.time))))),
        h("div", { className: "card" }, h("h3", {}, "Nous trouver"),
          h("p", {}, get("address") || ""), h("p", {}, get("phone") || ""), h("p", {}, get("email") || "")))),

    h("footer", {}, h("p", {}, "© " + name))
  );
};

CMS.registerPreviewTemplate("contenu", SitePreview);
