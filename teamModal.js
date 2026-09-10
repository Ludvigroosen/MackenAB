// Macken & Macken AB — team roster + accessible detail modal
(function () {
  "use strict";

  const teamMembers = [
    {
      id: "roy",
      name: "Roy Bensindahl",
      title: "Verkställande Tankchef",
      email: "roy.bensindahl@mackenmacken.se",
      quote: "Jag har hört vad du sa, men jag tänker ändå stå kvar här.",
      story:
        "Roy har stått vid samma pump sedan 1984. Ingen vet vad han väntar på. Inte ens Roy.",
      image: "images/roy",
    },
    {
      id: "roger",
      name: "Roger Dieselsson",
      title: "Vice VD för Vänsterbackning",
      email: "roger.dieselsson@mackenmacken.se",
      quote: "Allt går att backa. Utom ansvar.",
      story:
        "Roger backade in på jobbet 1996. Han har aldrig slutat backa.",
      image: "images/roger",
    },
    {
      id: "edvard",
      name: "Edvard Svarthammar",
      title: "IT-ansvarig (ingen vet varför)",
      email: "edvard.svarthammar@mackenmacken.se",
      quote: "Har du provat att inte fråga mig?",
      story: "Ingen vet vad Edvard egentligen gör. Det inkluderar Edvard.",
      image: "images/edvard",
    },
    {
      id: "sten",
      name: "Sten Gustavsson",
      title: "Klientrepresentant",
      email: "sten.gustavsson@mackenmacken.se",
      quote: "Jag var här förra veckan. Samma ärende. Fortfarande arg.",
      story:
        "Sten är inte anställd. Han bara dyker upp. Och alla lyssnar.",
      image: "images/sten",
    },
    {
      id: "maud",
      name: "Maud Tankelund",
      title: "Samordnare för saker som ingen annan tar tag i",
      email: "Maud.Tankelund@mackenmacken.se",
      quote: "Jag hinner – om ingen stör mig med nåt oviktigt. Som IT-support.",
      story:
        "Maud började egentligen bara hjälpa till med att hämta filterkaffe och ställa frågor som 'har ni provat att starta om den?'. Tio år senare är det hon som håller ihop hela Macken – inte för att hon ville, utan för att någon var tvungen. Hon vet var nycklarna är, när leveranser kommer trots att ingen har sagt något, och exakt hur man får Roy att sluta prata med kunder som bara 'tittar runt'.",
      image: "images/maud",
    },
    {
      id: "gunnar",
      name: "Gunnar Ekblad",
      title: "Möjligen ekonomiansvarig",
      email: "Gunnar.Ekblad@mackenmacken.se",
      quote: "Det står här att vi har ett avtal på Umbrella. Vem tog med paraplyet?",
      story:
        "Gunnar har ett skrivbord i förrådet mellan reservdelar och kvittopärmen. Han säger att han ansvarar för budgeten – men ingen har riktigt bekräftat det.",
      image: "images/gunnar",
    },
  ];

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));

  function pictureTag(base, alt, cls) {
    return `
      <picture>
        <source srcset="${base}.webp" type="image/webp" />
        <img src="${base}.jpg" alt="${esc(alt)}" loading="lazy" decoding="async" class="${cls}" />
      </picture>`;
  }

  // ---------- Roster ----------
  function renderRoster() {
    const grid = document.getElementById("team-grid");
    if (!grid) return;

    grid.className =
      "mt-14 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 dark:border-cloud/10 dark:bg-cloud/10 sm:grid-cols-2 lg:grid-cols-3";

    grid.innerHTML = teamMembers
      .map(
        (m, i) => `
      <button
        type="button"
        data-member="${m.id}"
        class="reveal group flex flex-col gap-4 bg-paper p-6 text-left transition-colors hover:bg-paper-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rust dark:bg-night dark:hover:bg-night-soft"
      >
        <div class="flex items-start justify-between">
          ${pictureTag(
            m.image,
            m.name,
            "photo-frame h-16 w-16 rounded-full object-cover object-top ring-1 ring-ink/10 transition-transform duration-300 group-hover:scale-105 dark:ring-cloud/15"
          )}
          <span class="font-display text-sm text-cloud-soft">0${i + 1}</span>
        </div>
        <div>
          <h3 class="font-display text-lg font-bold leading-tight">${esc(m.name)}</h3>
          <p class="mt-1 text-sm text-ink-soft dark:text-cloud-soft">${esc(m.title)}</p>
        </div>
        <p class="text-sm leading-relaxed text-ink-soft dark:text-cloud-soft">"${esc(m.quote)}"</p>
        <span class="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-rust">
          Läs mer
          <svg class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </button>`
      )
      .join("");

    grid.querySelectorAll("[data-member]").forEach((btn) => {
      btn.addEventListener("click", () => openModal(btn.dataset.member, btn));
    });

    window.dispatchEvent(new CustomEvent("mm:team-ready"));
  }

  // ---------- Modal ----------
  let lastFocused = null;
  const root = () => document.getElementById("modal-root");

  function buildModal() {
    const el = document.createElement("div");
    el.id = "modal";
    el.className =
      "modal-hidden fixed inset-0 z-[80] hidden items-center justify-center p-4";
    el.innerHTML = `
      <div class="modal-backdrop absolute inset-0 bg-night/60 backdrop-blur-sm" data-close></div>
      <div
        class="modal-panel relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-ink/10 bg-paper p-7 shadow-2xl dark:border-cloud/10 dark:bg-night-soft sm:p-9"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-name"
      >
        <button
          type="button"
          data-close
          class="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ink/5 dark:text-cloud-soft dark:hover:bg-cloud/10"
          aria-label="Stäng"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </button>
        <div id="modal-body"></div>
      </div>`;
    root().appendChild(el);

    el.querySelectorAll("[data-close]").forEach((n) =>
      n.addEventListener("click", closeModal)
    );
    return el;
  }

  function openModal(id, trigger) {
    const member = teamMembers.find((m) => m.id === id);
    if (!member) return;
    lastFocused = trigger || document.activeElement;

    const modal = document.getElementById("modal") || buildModal();
    document.getElementById("modal-body").innerHTML = `
      <div class="space-y-5">
        ${pictureTag(
          member.image,
          member.name,
          "photo-frame h-24 w-24 rounded-full object-cover object-top ring-1 ring-ink/10 dark:ring-cloud/15"
        )}
        <div>
          <h2 id="modal-name" class="font-display text-2xl font-bold leading-tight">${esc(
            member.name
          )}</h2>
          <p class="mt-1 text-sm text-rust">${esc(member.title)}</p>
        </div>
        <p class="font-display text-lg leading-snug">"${esc(member.quote)}"</p>
        <p class="text-[15px] leading-relaxed text-ink-soft dark:text-cloud-soft">${esc(
          member.story
        )}</p>
        <a
          href="mailto:${esc(member.email)}"
          class="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-medium transition-colors hover:bg-ink/5 dark:border-cloud/20 dark:hover:bg-cloud/10"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.6" />
            <path d="M4 7l8 6 8-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
          ${esc(member.email)}
        </a>
      </div>`;

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => modal.classList.remove("modal-hidden"));

    document.addEventListener("keydown", onKeydown);
    const focusable = modal.querySelector("[data-close]");
    if (focusable) focusable.focus();
  }

  function closeModal() {
    const modal = document.getElementById("modal");
    if (!modal || modal.classList.contains("hidden")) return;
    modal.classList.add("modal-hidden");
    document.removeEventListener("keydown", onKeydown);
    document.body.style.overflow = "";

    const done = () => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      modal.removeEventListener("transitionend", done);
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    };
    modal.addEventListener("transitionend", done);
    // Fallback if transitions are disabled
    setTimeout(done, 350);
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      closeModal();
      return;
    }
    if (e.key !== "Tab") return;
    const modal = document.getElementById("modal");
    const items = modal.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderRoster);
  } else {
    renderRoster();
  }
})();
