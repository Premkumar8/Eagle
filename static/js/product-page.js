function renderProductPage() {
    const slug = document.body.dataset.productSlug;
    const rootPath = document.body.dataset.rootPath || "/";
    const products = Array.isArray(window.EAGLE_PRODUCTS) ? window.EAGLE_PRODUCTS : [];
    const product = products.find((item) => item.slug === slug);

    if (!product) {
        window.location.replace(`${rootPath}404.html`);
        return;
    }

    document.title = `${product.title} | Eagle Group of IT Solution`;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute("content", product.summary);
    }

    const hero = document.getElementById("productHeroMedia");
    if (hero) {
        hero.style.backgroundImage = `linear-gradient(135deg, rgba(7, 15, 43, 0.82), rgba(140, 29, 24, 0.62)), url('${product.heroImage}')`;
    }

    const setText = (id, value) => {
        const node = document.getElementById(id);
        if (node) {
            node.textContent = value;
        }
    };

    setText("productCategory", product.category);
    setText("productTitle", product.title);
    setText("productTagline", product.tagline);
    setText("productDescription", product.description);
    setText("productSummary", product.summary);
    setText("productDelivery", product.delivery);
    setText("productSidebarDelivery", product.delivery);

    const detailImage = document.getElementById("productDetailImage");
    if (detailImage) {
        detailImage.src = product.detailImage;
        detailImage.alt = product.title;
    }

    const listMarkup = (items) => items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    const capabilityMarkup = product.capabilities.map((capability) => `
        <article class="detail-card">
            <h3>${escapeHtml(capability.title)}</h3>
            <p>${escapeHtml(capability.description)}</p>
        </article>
    `).join("");

    const capabilityGrid = document.getElementById("productCapabilities");
    if (capabilityGrid) {
        capabilityGrid.innerHTML = capabilityMarkup;
    }

    const useCases = document.getElementById("productUseCases");
    if (useCases) {
        useCases.innerHTML = listMarkup(product.useCases);
    }

    const outcomes = document.getElementById("productOutcomes");
    if (outcomes) {
        outcomes.innerHTML = listMarkup(product.outcomes);
    }

    const related = products.filter((item) => item.slug !== slug).slice(0, 3);
    const relatedGrid = document.getElementById("relatedProductsGrid");
    if (relatedGrid) {
        relatedGrid.innerHTML = related.map((item) => createProductCard(item, rootPath)).join("");
    }

    document.querySelectorAll("[data-home-link]").forEach((link) => {
        const target = link.getAttribute("data-home-link");
        link.setAttribute("href", `${rootPath}${target}`);
    });
}

document.addEventListener("DOMContentLoaded", renderProductPage);
