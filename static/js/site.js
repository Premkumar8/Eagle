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
                    <a class="card-link" href="${rootPath}products/${escapeHtml(product.slug)}/">View Solution <i class="fas fa-arrow-right" aria-hidden="true"></i></a>
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

        if (window.eagleHeroCanvas && typeof window.eagleHeroCanvas.syncTheme === "function") {
            window.eagleHeroCanvas.syncTheme();
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

    gsap.fromTo(".hero-badge, .hero-title, .hero-subtitle, .hero-buttons, .hero-tagline", {
        opacity: 0,
        y: 30
    }, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.25
    });

    gsap.fromTo(".dashboard-model", {
        opacity: 0,
        y: 40,
        rotateY: -18
    }, {
        opacity: 1,
        y: 0,
        rotateY: -12,
        duration: 1,
        ease: "power3.out",
        delay: 0.45
    });

    if (!window.ScrollTrigger) {
        return;
    }

    gsap.registerPlugin(window.ScrollTrigger);

    [".service-card", ".pricing-card", ".process-step", ".why-card", ".product-card"].forEach((selector) => {
        gsap.utils.toArray(selector).forEach((item, index) => {
            gsap.fromTo(item, {
                opacity: 0,
                y: 36
            }, {
                opacity: 1,
                y: 0,
                duration: 0.65,
                delay: (index % 3) * 0.05,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 86%",
                    toggleActions: "play none none none"
                }
            });
        });
    });

    if (document.querySelector(".highlight-content")) {
        gsap.to(".highlight-content", {
            y: -24,
            ease: "none",
            scrollTrigger: {
                trigger: ".highlight-band",
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });
    }
}

function initHeroCanvas() {
    const canvas = document.getElementById("heroCanvas");

    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    const context = canvas.getContext("2d");
    const particles = [];
    const particleCount = Math.min(95, Math.max(52, Math.floor(window.innerWidth / 18)));
    let width = 0;
    let height = 0;
    let color = "#7a1f2a";
    let lineColor = "rgba(122, 31, 42, 0.16)";
    let rafId = 0;
    const pointer = { x: 0, y: 0 };

    const syncTheme = () => {
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        color = isDark ? "#d6b25f" : "#7a1f2a";
        lineColor = isDark ? "rgba(214, 178, 95, 0.16)" : "rgba(122, 31, 42, 0.14)";
    };

    const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = canvas.offsetWidth || window.innerWidth;
        height = canvas.offsetHeight || window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
        particles.length = 0;
        for (let index = 0; index < particleCount; index += 1) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.28,
                vy: (Math.random() - 0.5) * 0.28,
                size: Math.random() * 1.8 + 0.8
            });
        }
    };

    const draw = () => {
        context.clearRect(0, 0, width, height);

        particles.forEach((particle, index) => {
            particle.x += particle.vx + pointer.x * 0.012;
            particle.y += particle.vy + pointer.y * 0.012;

            if (particle.x < -20) particle.x = width + 20;
            if (particle.x > width + 20) particle.x = -20;
            if (particle.y < -20) particle.y = height + 20;
            if (particle.y > height + 20) particle.y = -20;

            context.beginPath();
            context.fillStyle = color;
            context.globalAlpha = 0.42;
            context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            context.fill();

            for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
                const next = particles[nextIndex];
                const dx = particle.x - next.x;
                const dy = particle.y - next.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 118) {
                    context.beginPath();
                    context.globalAlpha = (118 - distance) / 118;
                    context.strokeStyle = lineColor;
                    context.lineWidth = 1;
                    context.moveTo(particle.x, particle.y);
                    context.lineTo(next.x, next.y);
                    context.stroke();
                }
            }
        });

        context.globalAlpha = 1;
        rafId = window.requestAnimationFrame(draw);
    };

    resize();
    syncTheme();
    seed();
    draw();

    window.eagleHeroCanvas = { syncTheme };

    window.addEventListener("resize", () => {
        window.cancelAnimationFrame(rafId);
        resize();
        seed();
        draw();
    }, { passive: true });

    window.addEventListener("mousemove", (event) => {
        pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
        pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
}

function initHeroVisualTilt() {
    const visual = document.getElementById("heroVisual");
    const model = visual ? visual.querySelector(".dashboard-model") : null;

    if (!visual || !model || window.matchMedia("(max-width: 991px)").matches) {
        return;
    }

    visual.addEventListener("mousemove", (event) => {
        const rect = visual.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        model.style.transform = `rotateX(${8 - y * 10}deg) rotateY(${-12 + x * 14}deg) translateY(-6px)`;
    });

    visual.addEventListener("mouseleave", () => {
        model.style.transform = "";
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
        const projectType = (formData.get("project_type") || "").toString().trim();
        const business = (formData.get("business") || "").toString().trim();
        const phone = (formData.get("phone") || "").toString().trim();
        const extraDetails = [
            business && `Business: ${business}`,
            phone && `Phone / WhatsApp: ${phone}`,
            projectType && `Project Type: ${projectType}`
        ].filter(Boolean);

        const payload = {
            name: (formData.get("name") || "").toString().trim(),
            email: (formData.get("email") || "").toString().trim(),
            message: [message, ...extraDetails].filter(Boolean).join("\n\n")
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
    initHeroCanvas();
    initHeroVisualTilt();
    setupContactForm();
    initBackToTop();
    initCurrentYear();
});
