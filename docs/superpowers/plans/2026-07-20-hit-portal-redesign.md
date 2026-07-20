# HIT Portal Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the static HIT introduction page as a dense, polished university portal with official links, news focus, a three-campus feature, and accessible responsive behavior.

**Architecture:** Keep the existing zero-build static architecture: semantic HTML holds portal content, CSS provides the responsive visual system, and vanilla JavaScript owns progressive interactions. The new layout keeps source URLs in markup so each official outbound link remains auditable and replaceable without a build step.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, browser-native Clipboard API, `npx --yes html-validate` for markup validation.

## Global Constraints

- Deliver only static `index.html`, `style.css`, and `script.js` changes; add no dependency or build system.
- Keep all external destinations on HIT official domains or clearly named official public pages.
- Do not present the page as an official HIT site; retain the source and non-affiliation statement in the footer.
- Preserve Harbin, Weihai, and Shenzhen campus addresses and official outbound links.
- Use fallback backgrounds for remote images and honor `prefers-reduced-motion`.
- Support 320px through desktop widths with no horizontal overflow.

---

### Task 1: Rebuild the portal information hierarchy

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: Existing official links and campus addresses from `index.html`.
- Produces: Landmark sections with IDs `news`, `campuses`, `services`, and `contact`, plus `data-address` values for copy buttons.

- [ ] **Step 1: Add semantic structure checks before editing**

Run:

```powershell
npx --yes html-validate index.html
```

Expected: validation may fail until existing stale structural markup is replaced; record any actual error location.

- [ ] **Step 2: Replace the body with the portal landmarks and content**

Implement these required sections in `index.html`:

```html
<section class="lead-story" id="news" aria-labelledby="lead-story-title">
  <article class="lead-story-feature">...</article>
  <ol class="headline-list">...</ol>
</section>

<section class="campus-feature" id="campuses" aria-labelledby="campus-title">
  <div class="campus-rail">...</div>
</section>

<section class="service-hall" id="services" aria-labelledby="service-title">
  <div class="service-grid">...</div>
</section>
```

Use official domain URLs for all news and service links. Ensure the header has a compact service bar and main navigation targeting the landmark IDs.

- [ ] **Step 3: Validate the finished markup**

Run:

```powershell
npx --yes html-validate index.html
```

Expected: `0 error(s) found`.

- [ ] **Step 4: Commit the hierarchy**

Run:

```powershell
git add index.html
git commit -m "feat: rebuild HIT portal structure"
```

### Task 2: Establish the visual system and responsive layout

**Files:**
- Modify: `style.css`

**Interfaces:**
- Consumes: Classes from Task 1: `.service-bar`, `.portal-nav`, `.lead-story`, `.headline-list`, `.campus-rail`, and `.service-grid`.
- Produces: Desktop, tablet, mobile, and reduced-motion visual rules for the static portal.

- [ ] **Step 1: Add a CSS sanity check before editing**

Run:

```powershell
npx --yes stylelint style.css --config '{"rules":{"block-no-empty":true}}'
```

Expected: either a clean result or a tool configuration-only warning; there must be no empty CSS rule blocks.

- [ ] **Step 2: Define the portal tokens and layout rules**

Place core tokens at the top of `style.css`:

```css
:root {
  --navy-950: #061a35;
  --navy-800: #0d3970;
  --azure-500: #1573d2;
  --gold-400: #f2bd52;
  --paper: #f7fbff;
  --ink: #102542;
  --shell: min(1360px, calc(100vw - 40px));
}
```

Implement a dark editorial hero, a white news board with asymmetric columns, a dark blue three-campus band with gold active cues, and a compact grid service hall. Add media queries at `960px` and `640px`, plus this reduced-motion override:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Verify CSS structure and mobile overflow**

Run:

```powershell
npx --yes stylelint style.css --config '{"rules":{"block-no-empty":true}}'
```

Expected: no empty style blocks. Then open `index.html` at 320px and 1440px and confirm no horizontal scroll bar is visible.

- [ ] **Step 4: Commit the visual system**

Run:

```powershell
git add style.css
git commit -m "feat: add polished HIT portal visual system"
```

### Task 3: Upgrade progressive interactions and verify the page

**Files:**
- Modify: `script.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: `[data-address]`, `.copy-address`, `.nav-toggle`, `.portal-nav`, `[data-reveal]`, and `.back-to-top`.
- Produces: Clipboard feedback, responsive navigation state, active navigation highlighting, and reduced-motion-safe reveal behavior.

- [ ] **Step 1: Add behavior expectations before editing**

Inspect the required interaction contract:

```javascript
document.querySelectorAll(".copy-address").forEach((button) => {
  // Clicking copies button.dataset.address and announces completion.
});
```

Expected: the final implementation must not throw when Clipboard API or IntersectionObserver is unavailable.

- [ ] **Step 2: Implement resilient page behavior**

Use feature detection in `script.js`:

```javascript
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !reduceMotion) {
  // Observe [data-reveal] elements once, then add .is-visible.
} else {
  document.querySelectorAll("[data-reveal]").forEach((element) => {
    element.classList.add("is-visible");
  });
}
```

For address copying, use `navigator.clipboard.writeText` when available and otherwise use a temporary textarea fallback. Update an `aria-live="polite"` status element rather than using only a visual change.

- [ ] **Step 3: Run static validation and manual interaction checks**

Run:

```powershell
npx --yes html-validate index.html
node --check script.js
```

Expected: `0 error(s) found` from HTML validation and no output from `node --check`. Manually verify menu toggle, address copy feedback, back-to-top button, and campus official links.

- [ ] **Step 4: Commit the interaction updates**

Run:

```powershell
git add index.html script.js
git commit -m "feat: improve portal interactions and accessibility"
```

### Task 4: Document the refreshed portal and final verification

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: Final section names and validation commands from Tasks 1-3.
- Produces: An accurate repository overview and local-preview instructions.

- [ ] **Step 1: Update the README feature list**

Add these concrete bullets to `README.md`:

```markdown
- 双层导航与官方高频服务入口
- 工大要闻主视觉与新闻列表
- 哈尔滨、威海、深圳三地校区专题
- 官方招生、地图、图书馆和信息服务跳转
- 地址复制、移动端导航与减少动态偏好支持
```

- [ ] **Step 2: Verify the complete static site**

Run:

```powershell
npx --yes html-validate index.html
node --check script.js
git status --short
```

Expected: successful validations and only intended documentation changes before the commit.

- [ ] **Step 3: Commit the documentation**

Run:

```powershell
git add README.md
git commit -m "docs: describe refreshed HIT portal"
```

