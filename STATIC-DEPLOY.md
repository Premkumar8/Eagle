# Static Deployment

This repo now supports a split deployment model:

- Static frontend on Render Static Site
- Separate Flask backend API for contact submissions

## Frontend files

Render Static Site can publish this repo root directly.

Main static entry points:

- `index.html`
- `404.html`
- `products/<slug>/index.html`

Shared assets:

- `static/css/styles.css`
- `static/js/site-config.js`
- `static/js/site.js`
- `static/js/product-data.js`
- `static/js/product-page.js`

## Render Static Site settings

Use:

- Publish directory: `.`
- Build command: leave empty

## Contact API URL

The static contact form reads its API endpoint from:

- `static/js/site-config.js`

Default:

```js
window.EAGLE_SITE_CONFIG = window.EAGLE_SITE_CONFIG || {
    contactApiUrl: "/api/contact"
};
```

For split deployment, point this to your backend service, for example:

```js
window.EAGLE_SITE_CONFIG = window.EAGLE_SITE_CONFIG || {
    contactApiUrl: "https://api.eagleinnovations.in/api/contact"
};
```

## Flask backend service

The backend keeps these routes:

- `POST /api/contact`
- `OPTIONS /api/contact`
- `GET /health`

Important backend environment variables:

- `CONTACT_ALLOWED_ORIGIN=https://eagleinnovations.in`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`
- `MAIL_DEFAULT_SENDER`
- `MAIL_RECIPIENT`
- `SECRET_KEY`

If you deploy the backend separately, the site opens directly from Render Static Site while the contact form still stores data through the API service.
