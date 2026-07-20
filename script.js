const navToggle = document.querySelector(".nav-toggle");
const portalNav = document.querySelector(".portal-nav");
const navLinks = [...document.querySelectorAll(".portal-nav > a[href^='#']")];
const copyButtons = [...document.querySelectorAll(".copy-address")];
const topButton = document.querySelector(".back-to-top");
const statusMessage = document.querySelector("#status-message");
const yearTarget = document.querySelector("#year");
const revealTargets = [...document.querySelectorAll("[data-reveal]")];
const soundToggle = document.querySelector(".sound-toggle");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let soundEnabled = false;
let audioContext;

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

const playUiSound = (tone = "tick") => {
  if (!soundEnabled) return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    audioContext ??= new AudioContext();
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const frequencies = { tick: 560, open: 440, close: 300, success: 720, lift: 620 };
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = tone === "success" ? "sine" : "triangle";
    oscillator.frequency.setValueAtTime(frequencies[tone] ?? frequencies.tick, now);
    oscillator.frequency.exponentialRampToValueAtTime((frequencies[tone] ?? frequencies.tick) * 1.18, now + 0.09);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.045, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.15);
  } catch {
    // Audio is optional; the page remains fully usable when it is unavailable.
  }
};

const setSoundState = (enabled, notify = false, playConfirmation = false) => {
  soundEnabled = enabled;
  if (soundToggle) {
    soundToggle.classList.toggle("is-enabled", enabled);
    soundToggle.setAttribute("aria-pressed", String(enabled));
    soundToggle.setAttribute("aria-label", enabled ? "关闭页面提示音" : "开启页面提示音");
    soundToggle.innerHTML = `<span aria-hidden="true">${enabled ? "◉" : "◌"}</span> 声景：${enabled ? "开" : "关"}`;
  }

  try {
    window.localStorage.setItem("hit-sound-enabled", String(enabled));
  } catch {
    // A blocked storage API should not prevent sound controls from working.
  }

  if (enabled && playConfirmation) playUiSound("success");
  if (notify) announce(enabled ? "页面提示音已开启" : "页面提示音已关闭");
};

if (soundToggle) {
  try {
    setSoundState(window.localStorage.getItem("hit-sound-enabled") === "true");
  } catch {
    setSoundState(false);
  }

  soundToggle.addEventListener("click", () => {
    setSoundState(!soundEnabled, true, true);
  });
}

if (navToggle && portalNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = portalNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    playUiSound(isOpen ? "open" : "close");
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
    if (copied) playUiSound("success");

    window.setTimeout(() => {
      button.textContent = originalLabel;
    }, 1800);
  });
});

if (topButton) {
  topButton.addEventListener("click", () => {
    playUiSound("lift");
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  const updateTopButton = () => {
    topButton.classList.toggle("is-visible", window.scrollY > 560);
  };

  window.addEventListener("scroll", updateTopButton, { passive: true });
  updateTopButton();
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("a, button");
  if (!target || target === soundToggle || target.classList.contains("copy-address") || target === topButton) return;

  if (target.matches(".portal-nav a, .hero-actions a, .hero-ticker a, .campus-actions a, .service-card, .consult-links a, .text-link, .story-link")) {
    playUiSound("tick");
  }
});

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
