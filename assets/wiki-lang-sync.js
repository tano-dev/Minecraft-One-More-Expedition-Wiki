(function () {
  const KEY = "ome_wiki_lang";
  try {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get("lang");
    if (urlLang === "en" || urlLang === "vi") {
      localStorage.setItem(KEY, urlLang);
    }
  } catch (e) {}

  function applyLangToHref(a, lang) {
    const raw = a.getAttribute("href");
    if (!raw || raw.startsWith("#") || raw.startsWith("http") || raw.startsWith("mailto:")) return;
    if (!raw.includes(".html")) return;
    const hashIdx = raw.indexOf("#");
    const base = hashIdx >= 0 ? raw.slice(0, hashIdx) : raw;
    const hash = hashIdx >= 0 ? raw.slice(hashIdx) : "";
    const qIdx = base.indexOf("?");
    const path = qIdx >= 0 ? base.slice(0, qIdx) : base;
    const sp = new URLSearchParams(qIdx >= 0 ? base.slice(qIdx + 1) : "");
    sp.set("lang", lang);
    a.setAttribute("href", path + "?" + sp.toString() + hash);
  }

  document.addEventListener("click", function (e) {
    const a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a) return;
    const lang = localStorage.getItem(KEY) || document.documentElement.lang || "en";
    applyLangToHref(a, lang === "vi" ? "vi" : "en");
  }, true);

  window.addEventListener("pageshow", function () {
    const saved = localStorage.getItem(KEY);
    if (saved) {
      if (typeof window.setLanguage === "function" && document.documentElement.lang !== saved) {
        window.setLanguage(saved);
      } else if (typeof window.setWikiLang === "function" && document.documentElement.lang !== saved) {
        window.setWikiLang(saved);
      }
    }
    applyTimeOfDayBackground();
  });

  function applyTimeOfDayBackground() {
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 18;
    const bgUrl = isDay ? "url('assets/bg_morning.jpg')" : "url('assets/bg_night.jpg')";
    const el = document.querySelector(".minecraft-bg-fixed, .bg-fixed");
    if (el) {
      el.style.backgroundImage = bgUrl;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyTimeOfDayBackground);
  } else {
    applyTimeOfDayBackground();
  }
  setInterval(applyTimeOfDayBackground, 60000);
})();
