const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const filterButtons = document.querySelectorAll("[data-filter]");
const catalogueCards = document.querySelectorAll("[data-category]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    catalogueCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      const shouldShow = filter === "all" || categories.includes(filter);
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

const catalogueNav = document.querySelector("[data-catalogue-nav]");
const catalogueSections = document.querySelector("[data-catalogue-sections]");
const catalogueTotal = document.querySelector("[data-catalogue-total]");
const catalogueCategories = window.catalogueCategories || [];

if (catalogueNav && catalogueSections && catalogueCategories.length > 0) {
  const createCarouselControl = (direction, label) => {
    const button = document.createElement("button");

    button.className = `carousel-control carousel-control-${direction}`;
    button.type = "button";
    button.setAttribute("aria-label", label);
    button.textContent = direction === "previous" ? "<" : ">";

    return button;
  };

  const navFragment = document.createDocumentFragment();
  const sectionsFragment = document.createDocumentFragment();

  catalogueCategories.forEach((category) => {
    const navLink = document.createElement("a");
    navLink.href = `#${category.slug}`;
    navLink.textContent = `${category.title} (${category.count})`;
    navFragment.append(navLink);

    const section = document.createElement("section");
    section.className = "catalogue-category";
    section.id = category.slug;

    const header = document.createElement("div");
    header.className = "category-heading";

    const title = document.createElement("h3");
    title.textContent = category.title;

    const count = document.createElement("span");
    count.textContent = `${category.count} designs`;

    header.append(title, count);

    const carousel = document.createElement("div");
    carousel.className = "catalogue-carousel";

    const previousButton = createCarouselControl("previous", `Scroll ${category.title} designs left`);
    const nextButton = createCarouselControl("next", `Scroll ${category.title} designs right`);

    const grid = document.createElement("div");
    grid.className = "portfolio-grid";
    grid.tabIndex = 0;
    grid.setAttribute("aria-label", `${category.title} design carousel`);

    category.images.forEach((item, index) => {
      const number = String(index + 1);
      const button = document.createElement("button");
      const image = document.createElement("img");
      const badge = document.createElement("span");

      button.className = "portfolio-card";
      button.type = "button";
      button.dataset.full = item.src;
      button.dataset.number = number;
      button.setAttribute("aria-label", `View ${category.title} henna design ${number}`);

      image.src = item.src;
      image.alt = `${category.title} henna design ${number} by Mehndi by Preet`;
      image.loading = "lazy";
      image.width = item.width;
      image.height = item.height;

      badge.className = "portfolio-number";
      badge.textContent = number;
      badge.setAttribute("aria-hidden", "true");

      button.append(image, badge);
      grid.append(button);
    });

    const scrollCarousel = (direction) => {
      grid.scrollBy({
        left: direction * grid.clientWidth * 0.86,
        behavior: "smooth"
      });
    };

    const updateControls = () => {
      const maxScroll = grid.scrollWidth - grid.clientWidth - 2;

      previousButton.disabled = grid.scrollLeft <= 2;
      nextButton.disabled = grid.scrollLeft >= maxScroll;
    };

    previousButton.addEventListener("click", () => scrollCarousel(-1));
    nextButton.addEventListener("click", () => scrollCarousel(1));
    grid.addEventListener("scroll", updateControls, { passive: true });
    window.addEventListener("resize", updateControls);
    window.requestAnimationFrame(updateControls);

    carousel.append(previousButton, grid, nextButton);
    section.append(header, carousel);
    sectionsFragment.append(section);
  });

  catalogueNav.append(navFragment);
  catalogueSections.append(sectionsFragment);

  if (catalogueTotal) {
    const total = catalogueCategories.reduce((sum, category) => sum + category.images.length, 0);
    catalogueTotal.textContent = String(total);
  }
}

const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox ? lightbox.querySelector("img") : null;
const lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;
const catalogueLightboxRoot = catalogueSections || document.querySelector("[data-portfolio-grid]");

if (catalogueLightboxRoot && lightbox && lightboxImage && lightboxClose) {
  catalogueLightboxRoot.addEventListener("click", (event) => {
    const card = event.target.closest(".portfolio-card");

    if (!card) {
      return;
    }

    lightboxImage.src = card.dataset.full;
    lightboxImage.alt = card.querySelector("img").alt;
    lightbox.showModal();
  });

  lightboxClose.addEventListener("click", () => {
    lightbox.close();
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      lightbox.close();
    }
  });
}

const eventList = document.querySelector("[data-event-list]");
const eventTotal = document.querySelector("[data-event-total]");

if (eventList && eventTotal) {
  eventTotal.textContent = String(eventList.querySelectorAll("article").length);
}

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  const formStatus = contactForm.querySelector(".form-status");
  const submitButton = contactForm.querySelector("button[type='submit']");
  const dateInput = contactForm.querySelector("input[name='date']");
  const unsureDateInput = contactForm.querySelector("input[name='date_status']");

  if (dateInput && unsureDateInput) {
    unsureDateInput.addEventListener("change", () => {
      dateInput.disabled = unsureDateInput.checked;

      if (unsureDateInput.checked) {
        dateInput.value = "";
      }
    });
  }

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const originalLabel = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    formStatus.textContent = "";
    formStatus.classList.remove("is-error", "is-success");

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      contactForm.reset();
      if (dateInput) {
        dateInput.disabled = false;
      }
      formStatus.textContent = "Thanks. Your inquiry has been sent.";
      formStatus.classList.add("is-success");
    } catch (error) {
      formStatus.textContent = "Something went wrong. Please email mehndibypreetbains@gmail.com directly.";
      formStatus.classList.add("is-error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalLabel;
    }
  });
}
