# Eagle Group IT Solutions Website

This folder contains a lightweight, responsive web site for **Eagle Group
IT Solutions**.  The design draws inspiration from your existing B12
site while providing a fresh look and a clean codebase that you can host
and maintain yourself.  The site is built entirely with HTML and CSS and
uses Font Awesome for the service icons.

## Features

* **Hero section** with a full‑width background image, tagline and call‑to‑action button.
* **About section** that introduces your company and its mission.
* **Services section** featuring cards for Web Applications, CRM Applications
  and Insightful Analytics.
* **Products section** showcasing six key offerings:
  VisionPro Object Detection, DataViz Analytics Dashboard, AppGenius Builder,
  Enterprise Systems Manager, Predictive Analytics Suite, and Cloud Service & Solutions.
* **Contact section** with a simple form (client‑side only) and business
  hours.
* **Explore Projects section** highlighting four exemplar projects from
  your portfolio: energy forecasting, emotion recognition, knapsack
  optimisation and a CRM admin panel.  Each card links to an
  individual project page outlining the purpose and business value of
  the solution.

### Interactive demos

For added engagement, the site also includes a set of interactive
demos under the `demos/` directory.  These lightweight pages
illustrate the core concepts behind each project without exposing
source code:

* `energy_forecasting_demo.html` uses Chart.js to plot a synthetic time
  series and its machine‑learning forecast.
* `emotion_recognition_demo.html` displays simulated ECG traces and
  cycles through predicted emotions.
* `knapsack_optimizer_demo.html` lets you choose a weight capacity and
  highlights which items maximise value using a simple
  dynamic‑programming algorithm.
* `crm_admin_panel_demo.html` offers a CRUD interface for managing
  customer records directly in the browser.
* **Responsive layout** that adapts to desktop and mobile screens.

## How to Use

You don’t need any special tooling to view or deploy this site.  To preview
it locally, simply open `index.html` in your web browser.  To host it on a
web server (for example, on GitHub Pages or another static hosting
provider), upload the contents of the `eagle_group_site` directory and
ensure that the `assets/hero.png` image is preserved alongside the CSS
file.

### Optional customisation

* **Change the hero image:** Replace `assets/hero.png` with your own
  photograph of an office or team to personalise the look.
* **Edit the text:** The copy in each section is placeholder text based
  on the content of your original site.  Feel free to update the wording
  or add additional sections as your business evolves.
* **Add functionality:** The contact form is client‑side only and does not
  send messages.  If you want to handle submissions, connect the form to
  a backend endpoint or a service like Formspree.