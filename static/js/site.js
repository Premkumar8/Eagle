function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function createProductCard(product, rootPath) {
    const outcomes = product.outcomes.slice(0, 2).map((outcome) => `<li>${escapeHtml(outcome)}</li>`).join("");
    return `
        <div class="col-lg-4 col-md-6 fade-in">
            <article class="product-card h-100">
                <img src="${escapeHtml(product.heroImage)}" class="card-img-top" alt="${escapeHtml(product.title)}">
                <div class="card-body">
                    <p class="product-category">${escapeHtml(product.category)}</p>
                    <h3 class="card-title">${escapeHtml(product.title)}</h3>
                    <p class="card-text">${escapeHtml(product.summary)}</p>
                    <ul class="product-outcomes">${outcomes}</ul>
                    <a class="card-link" href="${rootPath}products/${escapeHtml(product.slug)}/">View Solution</a>
                </div>
            </article>
        </div>
    `;
}

function renderFeaturedProducts() {
    const grid = document.getElementById("featuredProductsGrid");

    if (!grid || !Array.isArray(window.EAGLE_PRODUCTS)) {
        return;
    }

    const rootPath = document.body.dataset.rootPath || "/";
    grid.innerHTML = window.EAGLE_PRODUCTS.map((product) => createProductCard(product, rootPath)).join("");
}

function setupFadeInObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll(".fade-in").forEach((item) => observer.observe(item));
}

function setupNavbarState() {
    const navbar = document.querySelector(".navbar");

    if (!navbar) {
        return;
    }

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

    const syncActiveLink = () => {
        let current = "";
        sections.forEach((section) => {
            if (window.scrollY >= section.offsetTop - 180) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            const href = link.getAttribute("href") || "";
            const isHashLink = href.includes("#") && !link.classList.contains("nav-cta");
            link.classList.toggle("active", isHashLink && current && href.endsWith(`#${current}`));
        });
    };

    syncActiveLink();

    window.addEventListener("scroll", function () {
        navbar.classList.toggle("navbar-scrolled", window.scrollY > 24);
        syncActiveLink();
    });
}

function setupContactForm() {
    const form = document.querySelector(".contact-form");
    const statusBox = document.getElementById("contactFormStatus");

    if (!form || !statusBox) {
        return;
    }

    form.addEventListener("submit", async function (event) {
        const configUrl = window.EAGLE_SITE_CONFIG && window.EAGLE_SITE_CONFIG.contactApiUrl;
        const apiUrl = form.dataset.apiUrl || configUrl || "/api/contact";

        event.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        const formData = new FormData(form);
        const payload = {
            name: (formData.get("name") || "").toString().trim(),
            email: (formData.get("email") || "").toString().trim(),
            message: (formData.get("message") || "").toString().trim()
        };

        statusBox.className = "alert alert-info";
        statusBox.textContent = "Submitting your inquiry...";
        statusBox.classList.remove("d-none");

        if (submitButton) {
            submitButton.disabled = true;
        }

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const contentType = response.headers.get("content-type") || "";

            if (!contentType.includes("application/json")) {
                const canUseStandardSubmit = form.getAttribute("action") || form.getAttribute("method");

                if (canUseStandardSubmit) {
                    statusBox.className = "alert alert-info";
                    statusBox.textContent = "Submitting with the standard contact form...";
                    HTMLFormElement.prototype.submit.call(form);
                    return;
                }

                statusBox.className = "alert alert-danger";
                statusBox.textContent = "The contact service is unavailable at the configured address. Please check the contact API URL.";
                return;
            }

            const result = await response.json();

            statusBox.className = response.ok ? "alert alert-success" : "alert alert-danger";
            statusBox.textContent = result.message || "Unable to submit your inquiry right now.";

            if (response.ok) {
                form.reset();
            }
        } catch (_error) {
            statusBox.className = "alert alert-danger";
            statusBox.textContent = "Unable to reach the contact service right now. Please try again shortly.";
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
            }
        }
    });
}

function setupExternalCtas() {
    const config = window.EAGLE_SITE_CONFIG || {};
    const whatsAppUrl = config.whatsAppUrl;
    const calendlyUrl = config.calendlyUrl;

    if (whatsAppUrl) {
        document.querySelectorAll(".js-whatsapp-link").forEach((link) => {
            link.setAttribute("href", whatsAppUrl);
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noreferrer");
        });
    }

    if (calendlyUrl) {
        document.querySelectorAll(".js-calendly-link").forEach((link) => {
            link.setAttribute("href", calendlyUrl);
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noreferrer");
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    renderFeaturedProducts();
    setupFadeInObserver();
    setupNavbarState();
    setupContactForm();
    setupExternalCtas();

    const year = document.getElementById("year");
    if (year) {
        year.textContent = new Date().getFullYear();
    }
});
