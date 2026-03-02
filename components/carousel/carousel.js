(() => {
/**
 * Ombujoweb Carousel Web Component
 * A highly customizable, accessible, and visually stunning carousel.
 *
 * Usage:
 * <premium-carousel autoplay="true" interval="5000">
 *   <div slot="slide">Content 1</div>
 *   <div slot="slide">Content 2</div>
 * </premium-carousel>
 */

const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      --carousel-bg: #fff;
      --carousel-indicator-color: rgba(255, 255, 255, 0.5);
      --carousel-indicator-active-color: #aa2828ff;
      --carousel-arrow-color: #fff;
      --carousel-arrow-bg: rgba(0, 0, 0, 0.3);
      --carousel-arrow-hover-bg: rgba(0, 0, 0, 0.5);
      --carousel-transition-speed: 0.6s;
      
      display: block;
      position: relative;
      overflow: hidden;
      width: 100%;
      height: 400px;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      touch-action: pan-y;
      user-select: none;
    }

    .carousel-container {
      display: flex;
      height: 100%;
      width: 100%;
      list-style: none;
      margin: 0;
      padding: 0;
      transition: transform var(--carousel-transition-speed) cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform;
    }

    .carousel-container.dragging {
      transition: none;
    }

    ::slotted([slot="slide"]) {
      flex: 0 0 100%;
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 2rem;
      background-size: cover;
      background-position: center;
      transition: opacity var(--carousel-transition-speed) ease;
    }

    /* Navigation Arrows */
    .arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: var(--carousel-arrow-bg);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      color: var(--carousel-arrow-color);
      border: none;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      transition: all 0.3s ease;
      z-index: 10;
      opacity: 0;
    }

    :host(:hover) .arrow {
      opacity: 1;
    }

    .arrow:hover {
      background: var(--carousel-arrow-hover-bg);
      scale: 1.1;
    }

    .arrow-left {
      left: 20px;
    }

    .arrow-right {
      right: 20px;
    }

    /* Indicators */
    .indicators {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 12px;
      z-index: 10;
    }

    .indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--carousel-indicator-color);
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
      padding: 0;
    }

    .indicator.active {
      background: var(--carousel-indicator-active-color);
      width: 25px;
      border-radius: 5px;
    }

    /* Overlay Styling if needed */
    .overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40%;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
      pointer-events: none;
      z-index: 5;
    }
  </style>

  <ul class="carousel-container" id="container">
    <slot name="slide"></slot>
  </ul>

  <output class="aria-live-region" style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;"></output>

  <button class="arrow arrow-left" id="prevBtn" aria-label="Previous Slide">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
  </button>
  <button class="arrow arrow-right" id="nextBtn" aria-label="Next Slide">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
  </button>

  <nav class="indicators" id="indicators" aria-label="Slides"></nav>
  <div class="overlay"></div>
`;

class OmbujowebCarousel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    // Add top-level ARIA roles to the host element
    this.setAttribute("role", "region");
    this.setAttribute("aria-roledescription", "carousel");
    if (!this.hasAttribute("aria-label")) {
      this.setAttribute("aria-label", "Image Carousel");
    }

    this.currentIndex = 0;
    this.slides = [];
    this.autoPlayTimer = null;
    this.isPaused = false;

    // Dragging state
    this.isDragging = false;
    this.startX = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;
    this.animationID = 0;
  }
// Called when the element is added to the DOM
  connectedCallback() {
    this.container = this.shadowRoot.getElementById("container");
    this.indicatorsContainer = this.shadowRoot.getElementById("indicators");
    this.prevBtn = this.shadowRoot.getElementById("prevBtn");
    this.nextBtn = this.shadowRoot.getElementById("nextBtn");
    this.liveRegion = this.shadowRoot.querySelector(".aria-live-region");

    // Make the host focusable for keyboard navigation if not already
    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", "0");
    }

    // Initial setup
    this.updateSlides();

    // Event Listeners
    this.prevBtn.addEventListener("click", () => this.prev());
    this.nextBtn.addEventListener("click", () => this.next());

    // Pause on hover AND focus (important for a11y)
    this.addEventListener("mouseenter", () => this.setPaused(true));
    this.addEventListener("mouseleave", () => this.setPaused(false));
    this.addEventListener("focusin", () => this.setPaused(true));
    this.addEventListener("focusout", () => this.setPaused(false));

    // Keyboard navigation
    this.addEventListener("keydown", (e) => this.handleKeyDown(e));

    // Drag/Swipe Events
    this.container.addEventListener("pointerdown", (e) => this.dragStart(e));
    window.addEventListener("pointermove", (e) => this.dragMove(e));
    window.addEventListener("pointerup", () => this.dragEnd());
    window.addEventListener("pointercancel", () => this.dragEnd());

    // Handle dynamic slide additions (MutationObserver)
    const slot = this.shadowRoot.querySelector("slot");
    slot.addEventListener("slotchange", () => this.updateSlides());

    this.startAutoPlay();
  }

  updateSlides() {
    const slot = this.shadowRoot.querySelector("slot");
    this.slides = slot.assignedElements({ flatten: true });

    this.createIndicators();
    this.updatePosition();
  }

  createIndicators() {
    this.indicatorsContainer.innerHTML = "";
    this.slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.classList.add("indicator");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
      dot.setAttribute("aria-selected", index === this.currentIndex ? "true" : "false");
      
      if (index === this.currentIndex) dot.classList.add("active");
      dot.addEventListener("click", () => this.goTo(index));
      this.indicatorsContainer.appendChild(dot);
    });
  }

  handleKeyDown(e) {
    if (e.key === "ArrowLeft") {
      this.prev();
    } else if (e.key === "ArrowRight") {
      this.next();
    }
  }

  updatePosition() {
    if (this.slides.length === 0) return;

    const offset = this.currentIndex * 100;
    this.container.style.transform = `translateX(-${offset}%)`;

    // Update active dot and ARIA states
    const dots = this.indicatorsContainer.querySelectorAll(".indicator");
    dots.forEach((dot, index) => {
      const isActive = index === this.currentIndex;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    // Announce to screen readers
    this.liveRegion.textContent = `Slide ${this.currentIndex + 1} of ${this.slides.length}`;

    this.prevTranslate = -this.currentIndex * this.offsetWidth;
  }

  dragStart(e) {
    if (this.slides.length <= 1) return;
    this.isDragging = true;
    this.startX = e.clientX;
    this.container.classList.add("dragging");
    this.setPaused(true);
    
    // Prevent default to avoid image dragging ghosts
    if (e.pointerType === 'mouse') e.preventDefault();
  }

  dragMove(e) {
    if (!this.isDragging) return;

    const currentX = e.clientX;
    const diff = currentX - this.startX;
    const width = this.offsetWidth;
    
    // Calculate new position
    const baseTranslate = -this.currentIndex * width;
    let newTranslate = baseTranslate + diff;

    // Add resistance at bounds
    if (this.currentIndex === 0 && diff > 0) {
      newTranslate = diff * 0.3;
    } else if (this.currentIndex === this.slides.length - 1 && diff < 0) {
      newTranslate = baseTranslate + (diff * 0.3);
    }

    this.container.style.transform = `translateX(${newTranslate}px)`;
  }

  dragEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.container.classList.remove("dragging");

    const width = this.offsetWidth;
    const currentTranslate = parseFloat(
      this.container.style.transform.replace("translateX(", "").replace("px)", "")
    );
    const diff = currentTranslate - (-this.currentIndex * width);

    // Threshold for swipe (20% of width)
    const threshold = width * 0.2;

    if (diff < -threshold && this.currentIndex < this.slides.length - 1) {
      this.next();
    } else if (diff > threshold && this.currentIndex > 0) {
      this.prev();
    } else {
      this.updatePosition(); // Snap back
    }

    this.setPaused(false);
  }

  next() {
    if (this.slides.length <= 1) return;
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updatePosition();
  }

  prev() {
    if (this.slides.length <= 1) return;
    this.currentIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updatePosition();
  }

  goTo(index) {
    this.currentIndex = index;
    this.updatePosition();
  }

  setPaused(paused) {
    this.isPaused = paused;
    if (paused) {
      this.stopAutoPlay();
    } else {
      this.startAutoPlay();
    }
  }

  startAutoPlay() {
    const autoplay = this.getAttribute("autoplay") === "true";
    if (!autoplay || this.isPaused) return;

    const interval = parseInt(this.getAttribute("interval")) || 5000;
    this.stopAutoPlay(); // Clear existing
    this.autoPlayTimer = setInterval(() => this.next(), interval);
  }

  stopAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  disconnectedCallback() {
    this.stopAutoPlay();
  }

  static get observedAttributes() {
    return ["autoplay", "interval"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "autoplay" || name === "interval") {
      this.startAutoPlay();
    }
  }
}

customElements.define("ombujoweb-carousel", OmbujowebCarousel);
})();
