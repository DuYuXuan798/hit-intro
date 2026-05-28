const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const copyButtons = [...document.querySelectorAll(".copy-address")];
const topButton = document.querySelector(".back-to-top");
const yearTarget = document.querySelector("#year");
const revealTargets = [...document.querySelectorAll(".hub-card, .section-heading, .hero-copyblock, .hero-aside")];

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const address = button.dataset.address;

    try {
      await navigator.clipboard.writeText(address);
      const previousText = button.textContent;
      button.textContent = "已复制";
      button.classList.add("is-success");
      window.setTimeout(() => {
        button.textContent = previousText;
        button.classList.remove("is-success");
      }, 1400);
    } catch (error) {
      window.alert(`复制失败，请手动复制：${address}`);
    }
  });
});

if (topButton) {
  topButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const sections = [...document.querySelectorAll("main [id], footer[id]")];

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const currentId = `#${entry.target.id}`;
      navLinks.forEach((link) => {
        link.classList.toggle("is-current", link.getAttribute("href") === currentId);
      });
    });
  },
  {
    threshold: 0.28,
    rootMargin: "-15% 0px -45% 0px",
  }
);

sections.forEach((section) => sectionObserver.observe(section));

revealTargets.forEach((item) => item.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);

revealTargets.forEach((item) => revealObserver.observe(item));

const updateTopButton = () => {
  if (!topButton) {
    return;
  }

  topButton.classList.toggle("is-visible", window.scrollY > 480);
};

window.addEventListener("scroll", updateTopButton, { passive: true });
updateTopButton();
