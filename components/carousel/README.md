# 🎠 Premium Carousel Web Component

<p align="center">
  <strong>A highly customizable, zero-dependency carousel built with pure Vanilla Web Components.</strong><br />
  Works in any framework — or no framework at all.
</p>

<p align="center">
  <img alt="Vanilla JS" src="https://img.shields.io/badge/Vanilla-JS-F7DF1E?style=flat-square&logo=javascript&logoColor=black" />
  <img alt="Web Components" src="https://img.shields.io/badge/Web_Components-CustomElements-29ABE2?style=flat-square&logo=webcomponents.org&logoColor=white" />
  <img alt="Accessible" src="https://img.shields.io/badge/Accessibility-WCAG_2.1-005A9C?style=flat-square&logo=w3c&logoColor=white" />
  <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
  <img alt="Zero dependencies" src="https://img.shields.io/badge/Dependencies-0-brightgreen?style=flat-square" />
</p>

---

## ✨ Features

- 🔌 **Plug & Play** — Drop one `<script>` tag in; works instantly, no build step required.
- 🧩 **Framework Agnostic** — Works with React, Vue, Angular, Svelte, or plain HTML.
- 🔒 **Shadow DOM Encapsulated** — Styles are fully isolated; zero cascade leakage.
- 🎰 **Slot-based Content** — Put anything inside slides: images, videos, cards, or arbitrary HTML.
- ♿ **Accessible by Default** — Full ARIA roles, live regions for screen readers, and keyboard navigation.
- 👆 **Touch & Swipe Support** — Smooth pointer-based drag with edge resistance on mobile and desktop.
- 🎨 **Themeable via CSS Variables** — Override colours, speeds, and sizes with a single CSS rule.
- ⚡ **GPU-accelerated Animations** — `will-change: transform` and `cubic-bezier` transitions for silky transitions.
- 🔁 **Autoplay with Pause-on-Focus** — Autoplay pauses automatically on hover _and_ keyboard focus (WCAG 2.1 compliant).

---

## 🚀 Quick Start

### 1. Copy the file

Download or copy [`carousel.js`](./carousel.js) into your project.

### 2. Include it

```html
<script src="path/to/carousel.js"></script>
```

### 3. Use the element

```html
<premium-carousel autoplay="true" interval="5000">
  <div slot="slide" style="background-image: url('slide1.jpg')">
    <h2>Slide One</h2>
  </div>
  <div slot="slide" style="background-image: url('slide2.jpg')">
    <h2>Slide Two</h2>
  </div>
  <div slot="slide" style="background-image: url('slide3.jpg')">
    <h2>Slide Three</h2>
  </div>
</premium-carousel>
```

Open [`index.html`](./index.html) in your browser to see a working demo.

---

## 📖 API Reference

### Attributes

| Attribute    | Type      | Default            | Description                                                                         |
| ------------ | --------- | ------------------ | ----------------------------------------------------------------------------------- |
| `autoplay`   | `boolean` | `false`            | Set to `"true"` to enable automatic slide advancement.                              |
| `interval`   | `number`  | `5000`             | Time in milliseconds between auto-advances. Only used when `autoplay="true"`.       |
| `aria-label` | `string`  | `"Image Carousel"` | Accessible name for the carousel region. Override to describe the specific content. |

### JavaScript Methods

You can drive the carousel programmatically by getting a reference to the element:

```js
const carousel = document.querySelector("premium-carousel");

carousel.next(); // Advance to the next slide
carousel.prev(); // Go back to the previous slide
carousel.goTo(2); // Jump to a specific slide (0-indexed)
carousel.setPaused(true); // Pause autoplay
carousel.setPaused(false); // Resume autoplay
```

---

## 🎨 Customization (CSS Variables)

Theme any instance of the carousel by setting CSS custom properties from outside the Shadow DOM:

```css
premium-carousel {
  /* Slide transition speed */
  --carousel-transition-speed: 0.6s;

  /* Navigation arrow colours */
  --carousel-arrow-color: #ffffff;
  --carousel-arrow-bg: rgba(0, 0, 0, 0.3);
  --carousel-arrow-hover-bg: rgba(0, 0, 0, 0.6);

  /* Indicator dot colours */
  --carousel-indicator-color: rgba(255, 255, 255, 0.4);
  --carousel-indicator-active-color: #ffffff;

  /* Height of the carousel */
  height: 500px;
}
```

You can have multiple carousels on the same page, each themed independently:

```css
#hero-carousel {
  height: 600px;
  --carousel-transition-speed: 0.4s;
  --carousel-arrow-bg: rgba(99, 102, 241, 0.5);
}

#thumbnail-carousel {
  height: 250px;
  --carousel-indicator-active-color: #a855f7;
}
```

---

## 🖼️ Styling Slides

Slides are injected via the `slot="slide"` attribute, so you can style them any way you like from your own stylesheet — the Shadow DOM boundary doesn't block you from styling light DOM children.

```css
/* Full-bleed background image slide */
[slot="slide"] {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-position: center;
  color: white;
  font-size: 2rem;
}

/* Glassmorphism text overlay */
.slide-label {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  padding: 24px 40px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}
```

---

## 🧩 Framework Integration Examples

The component works as a native HTML element in any environment.

### React

```jsx
// No additional setup needed — Web Components work natively in React 19+.
// For React 18 and below, pass attributes as strings.
export default function App() {
  return (
    <premium-carousel
      autoplay="true"
      interval="4000"
      aria-label="Featured Products"
    >
      <div slot="slide" style={{ backgroundImage: `url('/img/product1.jpg')` }}>
        <h2>Product One</h2>
      </div>
      <div slot="slide" style={{ backgroundImage: `url('/img/product2.jpg')` }}>
        <h2>Product Two</h2>
      </div>
    </premium-carousel>
  );
}
```

### Vue

```vue
<template>
  <premium-carousel autoplay="true" interval="5000" aria-label="Gallery">
    <div
      v-for="slide in slides"
      :key="slide.id"
      slot="slide"
      :style="{ backgroundImage: `url(${slide.image})` }"
    >
      <h2>{{ slide.title }}</h2>
    </div>
  </premium-carousel>
</template>

<script setup>
const slides = [
  { id: 1, image: "/img/slide1.jpg", title: "Mountains" },
  { id: 2, image: "/img/slide2.jpg", title: "Ocean" },
];
</script>
```

### Svelte

```svelte
<script>
  let slides = ['Mountains', 'Ocean', 'Forest'];
</script>

<premium-carousel autoplay="true">
  {#each slides as name}
    <div slot="slide">{name}</div>
  {/each}
</premium-carousel>
```

---

## ♿ Accessibility

This component is built to be usable by everyone:

| Feature                 | Implementation                                                                 |
| ----------------------- | ------------------------------------------------------------------------------ |
| **Region landmark**     | `role="region"` + `aria-roledescription="carousel"` on the host element        |
| **Accessible label**    | `aria-label` attribute (defaults to `"Image Carousel"`, override per use-case) |
| **Live announcements**  | A visually hidden `<output>` element announces "Slide X of Y" on every change  |
| **Indicator buttons**   | Each dot has `role="tab"`, `aria-label="Go to slide N"`, and `aria-selected`   |
| **Keyboard navigation** | `←` / `→` arrow keys navigate slides when the carousel is focused              |
| **Pause on focus**      | Autoplay pauses when keyboard focus enters the component (WCAG 2.1 SC 2.2.2)   |
| **Focusable host**      | The host element receives `tabindex="0"` automatically                         |

---

## 🌐 Browser Support

This component uses standard Web APIs with broad modern browser support:

| Feature               | Chrome | Firefox | Safari   | Edge   |
| --------------------- | ------ | ------- | -------- | ------ |
| Custom Elements v1    | ✅ 67+ | ✅ 63+  | ✅ 10.1+ | ✅ 79+ |
| Shadow DOM v1         | ✅ 53+ | ✅ 63+  | ✅ 10+   | ✅ 79+ |
| Pointer Events        | ✅     | ✅      | ✅ 13+   | ✅     |
| CSS `backdrop-filter` | ✅     | ✅ 103+ | ✅       | ✅     |

> **Note:** For older browsers, a polyfill like [`@webcomponents/webcomponentsjs`](https://github.com/webcomponents/polyfills) can be used.

---

## 📁 File Structure

```
my-web-components/
├── carousel.js    # The self-contained Web Component
├── index.html     # Live demo page
└── README.md      # This file
```

---

## 🛠️ Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feat/your-feature-name`
5. Open a Pull Request

Please make sure any new feature maintains zero external dependencies and doesn't break the existing accessibility guarantees.

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use it in personal and commercial projects.

---

<p align="center">Built with ❤️ using modern Web Standards. No frameworks required.</p>
