const navToggle = document.querySelector(".nav-toggle");
const portalNav = document.querySelector(".portal-nav");
const navLinks = [...document.querySelectorAll(".portal-nav > a[href^='#']")];
const copyButtons = [...document.querySelectorAll(".copy-address")];
const topButton = document.querySelector(".back-to-top");
const statusMessage = document.querySelector("#status-message");
const yearTarget = document.querySelector("#year");
const revealTargets = [...document.querySelectorAll("[data-reveal]")];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

const announce = (message) => {
  if (!statusMessage) return;

  statusMessage.textContent = message;
  statusMessage.classList.add("is-visible");

  window.setTimeout(() => {
    statusMessage.classList.remove("is-visible");
  }, 2200);
};

if (navToggle && portalNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = portalNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      portalNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const fallbackCopy = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.append(textArea);
  textArea.select();

  const copied = document.execCommand("copy");
  textArea.remove();
  return copied;
};

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const address = button.dataset.address;
    if (!address) return;

    let copied = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(address);
        copied = true;
      } else {
        copied = fallbackCopy(address);
      }
    } catch {
      copied = fallbackCopy(address);
    }

    const originalLabel = button.textContent;
    button.textContent = copied ? "地址已复制" : "请手动复制";
    announce(copied ? "校区地址已复制到剪贴板" : address);

    window.setTimeout(() => {
      button.textContent = originalLabel;
    }, 1800);
  });
});

if (topButton) {
  topButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  const updateTopButton = () => {
    topButton.classList.toggle("is-visible", window.scrollY > 560);
  };

  window.addEventListener("scroll", updateTopButton, { passive: true });
  updateTopButton();
}

const sections = [...document.querySelectorAll("main > section[id], footer[id]")];

if ("IntersectionObserver" in window) {
  const navigationObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries.find((entry) => entry.isIntersecting);
      if (!visibleEntry) return;

      const currentHash = "#" + visibleEntry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle("is-current", link.getAttribute("href") === currentHash);
      });
    },
    { rootMargin: "-18% 0px -62% 0px", threshold: 0.05 }
  );

  sections.forEach((section) => navigationObserver.observe(section));
}

if (!reduceMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((element) => revealObserver.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add("is-visible"));
}
