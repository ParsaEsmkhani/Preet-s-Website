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

const portfolioGrid = document.querySelector("[data-portfolio-grid]");
const portfolioCount = portfolioGrid ? Number(portfolioGrid.dataset.count) : 0;

if (portfolioGrid && portfolioCount > 0) {
  const fragment = document.createDocumentFragment();

  for (let index = 1; index <= portfolioCount; index += 1) {
    const number = String(index).padStart(2, "0");
    const src = `assets/catalogue/design-${number}.jpg`;
    const button = document.createElement("button");
    const image = document.createElement("img");

    button.className = "portfolio-card";
    button.type = "button";
    button.dataset.full = src;
    button.setAttribute("aria-label", `View henna design ${number}`);

    image.src = src;
    image.alt = `Henna design ${number} by Mehndi by Preet`;
    image.loading = "lazy";

    button.append(image);
    fragment.append(button);
  }

  portfolioGrid.append(fragment);
}

const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox ? lightbox.querySelector("img") : null;
const lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;

if (portfolioGrid && lightbox && lightboxImage && lightboxClose) {
  portfolioGrid.addEventListener("click", (event) => {
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

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  const formStatus = contactForm.querySelector(".form-status");
  const submitButton = contactForm.querySelector("button[type='submit']");

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
