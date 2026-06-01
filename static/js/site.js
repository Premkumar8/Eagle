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
            <article class="product-card h-100" style="border-radius: 24px; overflow: hidden; border: 1px solid var(--color-border); box-shadow: var(--color-shadow);">
                <img src="${escapeHtml(product.heroImage)}" class="card-img-top" alt="${escapeHtml(product.title)}" style="height: 200px; object-fit: cover;">
                <div class="card-body" style="padding: 2rem;">
                    <p class="product-category" style="font-size: 0.75rem; color: var(--color-primary); font-weight: 800; text-transform: uppercase; margin-bottom: 0.5rem;">${escapeHtml(product.category)}</p>
                    <h3 class="card-title" style="font-size: 1.25rem; margin-bottom: 1rem;">${escapeHtml(product.title)}</h3>
                    <p class="card-text" style="font-size: 0.9rem; color: var(--color-muted); line-height: 1.5;">${escapeHtml(product.summary)}</p>
                    <a class="card-link" href="${rootPath}products/${escapeHtml(product.slug)}/" style="display: inline-block; margin-top: 1.5rem; font-weight: 700; color: var(--color-primary);">Explore Solution <i class="fas fa-arrow-right" style="margin-left: 0.3rem;"></i></a>
                </div>
            </article>
        </div>
    `;
}

function initPreloader() {
    const preloader = document.getElementById("preloader");

    if (!preloader) {
        return;
    }

    document.body.classList.add("is-loading");

    const dismiss = () => {
        preloader.classList.add("fade-out");
        document.body.classList.remove("is-loading");
        window.setTimeout(() => {
            preloader.style.display = "none";
        }, 700);
    };

    window.addEventListener("load", () => window.setTimeout(dismiss, 650), { once: true });
    window.setTimeout(dismiss, 1800);
}

function initThemeToggle() {
    const html = document.documentElement;
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    const storedTheme = localStorage.getItem("eagle-theme");
    const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const startingTheme = storedTheme || html.getAttribute("data-theme") || preferredTheme;

    const applyTheme = (theme) => {
        html.setAttribute("data-theme", theme);

        if (themeIcon) {
            themeIcon.classList.toggle("fa-sun", theme === "dark");
            themeIcon.classList.toggle("fa-moon", theme !== "dark");
        }
    };

    applyTheme(startingTheme);

    if (!themeToggle) {
        return;
    }

    themeToggle.addEventListener("click", () => {
        const currentTheme = html.getAttribute("data-theme") === "dark" ? "dark" : "light";
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        localStorage.setItem("eagle-theme", nextTheme);
        applyTheme(nextTheme);
    });
}

function initNavbarState() {
    const navbar = document.querySelector(".navbar");

    if (!navbar) {
        return;
    }

    const sections = Array.from(document.querySelectorAll("main section[id]"));
    const navLinks = Array.from(document.querySelectorAll(".navbar-nav .nav-link"));

    const samePageHash = (link) => {
        const href = link.getAttribute("href") || "";

        if (!href.includes("#") || link.classList.contains("btn")) {
            return "";
        }

        try {
            const url = new URL(href, window.location.href);
            const currentPath = window.location.pathname.replace(/\/index\.html$/, "/");
            const linkPath = url.pathname.replace(/\/index\.html$/, "/");
            return currentPath === linkPath ? url.hash.slice(1) : "";
        } catch (_error) {
            return href.startsWith("#") ? href.slice(1) : "";
        }
    };

    const syncActiveLink = () => {
        let current = "";

        sections.forEach((section) => {
            if (window.scrollY >= section.offsetTop - 180) {
                current = section.getAttribute("id") || "";
            }
        });

        navLinks.forEach((link) => {
            const target = samePageHash(link);
            link.classList.toggle("active", Boolean(target && current && target === current));
        });
    };

    const syncScrollState = () => {
        navbar.classList.toggle("scrolled", window.scrollY > 42);
        navbar.classList.toggle("navbar-scrolled", window.scrollY > 42);
        syncActiveLink();
    };

    syncScrollState();
    window.addEventListener("scroll", syncScrollState, { passive: true });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            const collapse = document.getElementById("navbarNav");

            if (collapse && collapse.classList.contains("show") && window.bootstrap) {
                window.bootstrap.Collapse.getOrCreateInstance(collapse).hide();
            }
        });
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href*="#"]').forEach((link) => {
        link.addEventListener("click", function (event) {
            const href = this.getAttribute("href") || "";

            if (href === "#") {
                return;
            }

            let url;
            try {
                url = new URL(href, window.location.href);
            } catch (_error) {
                return;
            }

            const currentPath = window.location.pathname.replace(/\/index\.html$/, "/");
            const linkPath = url.pathname.replace(/\/index\.html$/, "/");

            if (currentPath !== linkPath || !url.hash) {
                return;
            }

            const target = document.querySelector(url.hash);

            if (!target) {
                return;
            }

            event.preventDefault();

            const navbar = document.querySelector(".navbar");
            const offset = navbar ? navbar.offsetHeight + 18 : 90;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({ top, behavior: "smooth" });
        });
    });
}

function initRevealAnimations() {
    const elements = document.querySelectorAll("[data-animate], .fade-in");

    if (!elements.length) {
        return;
    }

    if (!("IntersectionObserver" in window)) {
        elements.forEach((element) => element.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    elements.forEach((element) => observer.observe(element));
}

function initGsapAnimations() {
    if (!window.gsap) {
        return;
    }

    const gsap = window.gsap;

    gsap.fromTo(".hero-badge, .hero-title, .hero-subtitle, .hero-buttons", {
        opacity: 0,
        y: 20
    }, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.15,
        delay: 0.3
    });

    if (!window.ScrollTrigger) {
        return;
    }

    gsap.registerPlugin(window.ScrollTrigger);

    [".service-card", ".product-card", ".pricing-card", ".process-step", ".why-card"].forEach((selector) => {
        gsap.utils.toArray(selector).forEach((item, index) => {
            gsap.fromTo(item, {
                opacity: 0,
                y: 30
            }, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: (index % 3) * 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            });
        });
    });
}

function renderFeaturedProducts() {
    const grid = document.getElementById("featuredProductsGrid");

    if (!grid || !Array.isArray(window.EAGLE_PRODUCTS)) {
        return;
    }

    const rootPath = document.body.dataset.rootPath || "/";
    grid.innerHTML = window.EAGLE_PRODUCTS.slice(0, 3).map((product) => createProductCard(product, rootPath)).join("");
    initRevealAnimations();

    if (window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
    }
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
        const formData = new FormData(form);

        event.preventDefault();

        if (formData.get("botcheck")) {
            return;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        const message = (formData.get("message") || "").toString().trim();

        const payload = {
            name: (formData.get("name") || "").toString().trim(),
            email: (formData.get("email") || "").toString().trim(),
            message: message
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
                statusBox.className = "alert alert-info";
                statusBox.textContent = "Submitting with the standard contact form...";
                HTMLFormElement.prototype.submit.call(form);
                return;
            }

            const result = await response.json();

            statusBox.className = response.ok ? "alert alert-success" : "alert alert-danger";
            statusBox.textContent = result.message || "Unable to submit your inquiry right now.";

            if (response.ok) {
                form.reset();
            }
        } catch (_error) {
            statusBox.className = "alert alert-success";
            statusBox.textContent = "Connecting you directly to our WhatsApp support to complete your inquiry...";
            
            const waPhone = "918220488716";
            const waText = encodeURIComponent(
                `Hello Eagle Innovations!\n\nI just submitted a contact form inquiry on your website.\n\n*Name*: ${payload.name}\n*Email*: ${payload.email}\n*Message*: ${payload.message}`
            );
            const waUrl = `https://wa.me/${waPhone}?text=${waText}`;
            
            setTimeout(() => {
                window.open(waUrl, "_blank");
                form.reset();
                statusBox.classList.add("d-none");
            }, 1800);
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
            }
        }
    });
}

function setupExternalCtas() {
    const config = window.EAGLE_SITE_CONFIG || {};

    if (config.whatsAppUrl) {
        document.querySelectorAll(".js-whatsapp-link").forEach((link) => {
            link.setAttribute("href", config.whatsAppUrl);
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noreferrer");
        });
    }

    if (config.calendlyUrl) {
        document.querySelectorAll(".js-calendly-link").forEach((link) => {
            link.setAttribute("href", config.calendlyUrl);
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noreferrer");
        });
    }

    if (config.linkedInUrl) {
        document.querySelectorAll(".js-linkedin-link").forEach((link) => {
            link.setAttribute("href", config.linkedInUrl);
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noreferrer");
        });
    }

    if (config.instagramUrl) {
        document.querySelectorAll(".js-instagram-link").forEach((link) => {
            link.setAttribute("href", config.instagramUrl);
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noreferrer");
        });
    }

    if (config.facebookUrl) {
        document.querySelectorAll(".js-facebook-link").forEach((link) => {
            link.setAttribute("href", config.facebookUrl);
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noreferrer");
        });
    }
}

function initBackToTop() {
    const button = document.getElementById("backToTop");

    if (!button) {
        return;
    }

    const sync = () => {
        button.classList.toggle("visible", window.scrollY > 520);
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function initCurrentYear() {
    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    initPreloader();
    initThemeToggle();
    initNavbarState();
    initSmoothScroll();
    setupExternalCtas();
    renderFeaturedProducts();
    initRevealAnimations();
    initGsapAnimations();
    setupContactForm();
    initBackToTop();
    initCurrentYear();
});
