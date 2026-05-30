import os
from email.utils import parseaddr

from flask import Flask, flash, jsonify, make_response, redirect, render_template, request, url_for
from flask_mail import Mail, Message
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))

# Database URI builder that supports both DATABASE_URL and SQLITE_DB_PATH environment variables.
def build_database_uri():
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        if database_url.startswith("postgres://"):
            database_url = database_url.replace("postgres://", "postgresql://", 1)
        return database_url

    sqlite_path = os.getenv("SQLITE_DB_PATH")
    if sqlite_path:
        if not os.path.isabs(sqlite_path):
            sqlite_path = os.path.join(basedir, sqlite_path)
    else:
        os.makedirs(app.instance_path, exist_ok=True)
        sqlite_path = os.path.join(app.instance_path, "eagle.db")

    sqlite_path = os.path.abspath(sqlite_path)
    os.makedirs(os.path.dirname(sqlite_path), exist_ok=True)
    return "sqlite:///" + sqlite_path.replace("\\", "/")

app.config["SECRET_KEY"] = os.getenv(
    "SECRET_KEY",
    "dev-secret-key-change-me",
)

app.config["SQLALCHEMY_DATABASE_URI"] = build_database_uri()
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

app.config["MAIL_SERVER"] = os.getenv("MAIL_SERVER", "smtp.gmail.com")
app.config["MAIL_PORT"] = int(os.getenv("MAIL_PORT", "587"))
app.config["MAIL_USE_TLS"] = os.getenv("MAIL_USE_TLS", "true").lower() == "true"
app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")
app.config["MAIL_DEFAULT_SENDER"] = os.getenv("MAIL_DEFAULT_SENDER") or app.config["MAIL_USERNAME"]
app.config["MAIL_RECIPIENT"] = os.getenv("MAIL_RECIPIENT")
app.config["CONTACT_API_URL"] = os.getenv("CONTACT_API_URL", "/api/contact")
app.config["CONTACT_ALLOWED_ORIGIN"] = os.getenv("CONTACT_ALLOWED_ORIGIN")

db = SQLAlchemy(app)
mail = Mail(app)


PRODUCTS = [
    {
        "slug": "visionpro-object-detection",
        "title": "VisionPro Object Detection",
        "category": "Computer Vision Platform",
        "tagline": "Real-time visual intelligence for safety, operations, and quality control.",
        "summary": "A production-ready object detection platform that converts live video and image streams into operational alerts, searchable evidence, and performance metrics.",
        "description": "VisionPro helps operations teams monitor workspaces, identify anomalies, and automate visual inspections. It combines model deployment, event tracking, and reporting in a single interface so teams can move from experimentation to measurable business outcomes.",
        "hero_image": "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop",
        "detail_image": "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop",
        "outcomes": ["Faster incident response", "Reduced manual review effort", "Audit-ready event history"],
        "capabilities": [
            {
                "title": "Detection Operations",
                "description": "Run object detection across live camera feeds, uploaded images, and recorded video with a workflow designed for operational teams.",
            },
            {
                "title": "Policy-Based Alerting",
                "description": "Configure rules for safety, compliance, restricted zones, and asset movement so the system raises only the events that matter.",
            },
            {
                "title": "Review And Evidence Console",
                "description": "Give analysts a searchable event history with snapshots, timestamps, and exports for investigation and reporting.",
            },
        ],
        "use_cases": [
            "Warehouse safety and PPE monitoring",
            "Retail footfall and queue visibility",
            "Manufacturing defect and line-state detection",
        ],
        "delivery": "Delivered as a cloud-hosted dashboard or private deployment with integration support for your existing systems.",
    },
    {
        "slug": "dataviz-analytics-dashboard",
        "title": "DataViz Analytics Dashboard",
        "category": "Business Intelligence",
        "tagline": "Executive-ready dashboards that turn raw data into confident decisions.",
        "summary": "An interactive analytics environment designed for leadership teams that need clear KPIs, drill-down reporting, and consistent operational visibility.",
        "description": "DataViz consolidates information across spreadsheets, databases, and business platforms into a reliable reporting layer. It emphasizes usable visuals, metric governance, and fast access to the questions stakeholders ask most often.",
        "hero_image": "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2076&auto=format&fit=crop",
        "detail_image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
        "outcomes": ["Single source of truth", "Shorter reporting cycles", "Higher decision confidence"],
        "capabilities": [
            {
                "title": "Role-Based Reporting",
                "description": "Present the right level of detail to executives, functional managers, and analysts without duplicating reporting effort.",
            },
            {
                "title": "Trend And Variance Monitoring",
                "description": "Track performance movement over time and highlight exceptions that need management attention.",
            },
            {
                "title": "Presentation-Ready Outputs",
                "description": "Support board packs, operational reviews, and client updates with clean charts and exportable summaries.",
            },
        ],
        "use_cases": [
            "Sales pipeline and margin visibility",
            "Operations and service delivery reporting",
            "Finance, revenue, and forecast review",
        ],
        "delivery": "Configured around your data model with responsive dashboards, stakeholder workshops, and rollout guidance.",
    },
    {
        "slug": "appgenius",
        "title": "AppGenius",
        "category": "Application Delivery Framework",
        "tagline": "Accelerate custom application delivery without compromising architecture.",
        "summary": "A structured application delivery framework that helps teams launch secure, maintainable digital products faster.",
        "description": "AppGenius combines reusable design patterns, modular architecture, and deployment workflows so new digital initiatives start from a mature foundation instead of from scratch. The result is faster delivery, clearer governance, and lower maintenance cost.",
        "hero_image": "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?q=80&w=1974&auto=format&fit=crop",
        "detail_image": "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?q=80&w=2070&auto=format&fit=crop",
        "outcomes": ["Quicker project kickoff", "Consistent engineering standards", "Lower delivery risk"],
        "capabilities": [
            {
                "title": "Reusable Delivery Components",
                "description": "Accelerate new application work with proven interface, API, and deployment patterns instead of starting from zero.",
            },
            {
                "title": "Release And Environment Structure",
                "description": "Set up staging, rollout, and support practices that reduce delivery friction as products move toward production.",
            },
            {
                "title": "Engineering Quality Guardrails",
                "description": "Bake security, performance, and maintainability expectations into the foundation of each project.",
            },
        ],
        "use_cases": [
            "Customer portals and internal tools",
            "Workflow digitization projects",
            "New service launches and MVPs",
        ],
        "delivery": "Used as a foundation for bespoke web and mobile projects delivered by Eagle Innovations teams.",
    },
    {
        "slug": "enterprise-systems-manager",
        "title": "Enterprise Systems Manager",
        "category": "CRM And Operations Suite",
        "tagline": "Coordinate customer, revenue, and workflow operations in one controlled environment.",
        "summary": "A modular business operations suite that supports CRM workflows, customer records, approvals, and internal reporting.",
        "description": "Enterprise Systems Manager is designed for growing organizations that have outgrown fragmented admin processes. It centralizes customer data, task ownership, and reporting so teams can work with fewer handoffs and better accountability.",
        "hero_image": "/static/images/App.png",
        "detail_image": "/static/images/App.png",
        "outcomes": ["Stronger process control", "Improved team visibility", "Cleaner operational records"],
        "capabilities": [
            {
                "title": "Customer Lifecycle Management",
                "description": "Centralize account records, status changes, and follow-up workflows in one operational system.",
            },
            {
                "title": "Governance And Permissions",
                "description": "Control approvals, roles, and audit history so teams can manage process quality with less manual oversight.",
            },
            {
                "title": "Operational Visibility",
                "description": "Monitor pipeline movement, workload distribution, and service execution through live management dashboards.",
            },
        ],
        "use_cases": [
            "Sales and support coordination",
            "Internal admin modernization",
            "Business process standardization",
        ],
        "delivery": "Available as a tailored implementation aligned to your business rules and reporting requirements.",
    },
    {
        "slug": "predictive-analytics-suite",
        "title": "Predictive Analytics Suite",
        "category": "Forecasting And Decision Science",
        "tagline": "Forecast demand, risk, and opportunity with practical machine learning.",
        "summary": "A forecasting toolkit that helps teams plan ahead using statistical models, machine learning, and explainable reporting.",
        "description": "Predictive Analytics Suite supports organizations that want more than descriptive dashboards. It provides forecast models, scenario comparisons, and decision-ready outputs that help teams anticipate change and act earlier.",
        "hero_image": "https://images.unsplash.com/photo-1518186233392-c232efbf2373?q=80&w=2070&auto=format&fit=crop",
        "detail_image": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
        "outcomes": ["More proactive planning", "Reduced forecasting lag", "Stronger scenario analysis"],
        "capabilities": [
            {
                "title": "Forecast Model Library",
                "description": "Support demand, utilization, and revenue planning with models tailored to the planning cycles your teams use.",
            },
            {
                "title": "Scenario Planning",
                "description": "Compare likely outcomes under different assumptions so leaders can weigh risk, cost, and capacity with more clarity.",
            },
            {
                "title": "Explainable Decision Support",
                "description": "Translate predictive outputs into dashboards that communicate confidence, variance, and likely impact to decision-makers.",
            },
        ],
        "use_cases": [
            "Energy and resource planning",
            "Inventory and capacity management",
            "Commercial trend forecasting",
        ],
        "delivery": "Implemented with your historical data, business assumptions, and reporting cadence in mind.",
    },
    {
        "slug": "cloud-service-and-solutions",
        "title": "Cloud Service and Solutions",
        "category": "Cloud Modernization",
        "tagline": "Secure, scalable cloud foundations for resilient digital operations.",
        "summary": "A cloud modernization offering that helps organizations migrate, optimize, and operate digital services with stronger reliability and governance.",
        "description": "Cloud Service and Solutions combines architecture planning, environment setup, and operational support. It is built for teams that need performance and scalability, but also need sensible cost controls, security baselines, and dependable release workflows.",
        "hero_image": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop",
        "detail_image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
        "outcomes": ["Better uptime posture", "Improved deployment consistency", "Scalable infrastructure planning"],
        "capabilities": [
            {
                "title": "Architecture And Migration Planning",
                "description": "Design cloud environments and transition plans that align application requirements with growth and resilience goals.",
            },
            {
                "title": "Platform Operations",
                "description": "Strengthen release workflows, monitoring, and environment management so teams can operate with more consistency.",
            },
            {
                "title": "Security And Continuity Controls",
                "description": "Apply backup, recovery, access, and hardening practices appropriate for production business systems.",
            },
        ],
        "use_cases": [
            "Application hosting modernization",
            "Secure client-facing platform delivery",
            "Business continuity and infrastructure scaling",
        ],
        "delivery": "Engagements can include cloud advisory, migration execution, or managed operational support.",
    },
]

PRODUCTS_BY_SLUG = {product["slug"]: product for product in PRODUCTS}


class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=True)

    def __repr__(self):
        return f"<Contact {self.name}>"


def is_valid_email(value):
    return "@" in parseaddr(value)[1]


def mail_is_configured():
    return bool(
        app.config["MAIL_USERNAME"]
        and app.config["MAIL_PASSWORD"]
        and app.config["MAIL_DEFAULT_SENDER"]
        and app.config["MAIL_RECIPIENT"]
    )


def send_contact_notification(name, email, message):
    if not mail_is_configured():
        return False

    msg = Message(
        subject=f"New Contact Form Submission from {name}",
        recipients=[app.config["MAIL_RECIPIENT"]],
        body=f"Name: {name}\nEmail: {email}\nMessage:\n{message or 'No message provided.'}",
    )
    mail.send(msg)
    return True


def compose_contact_message(message, business=None, phone=None, project_type=None):
    details = [
        (message or "").strip(),
        f"Business: {business.strip()}" if business and business.strip() else "",
        f"Phone / WhatsApp: {phone.strip()}" if phone and phone.strip() else "",
        f"Project Type: {project_type.strip()}" if project_type and project_type.strip() else "",
    ]
    return "\n\n".join(detail for detail in details if detail)


def contact_api_payload(name, email, message):
    new_contact = Contact(name=name, email=email, message=message)

    try:
        db.session.add(new_contact)
        db.session.commit()
        notification_sent = send_contact_notification(name, email, message)
        response_message = (
            "Successfully submitted. We will contact you shortly."
            if notification_sent
            else "Successfully submitted. Your message has been saved and our team will follow up shortly."
        )
        return {
            "ok": True,
            "message": response_message,
        }, 201
    except Exception:
        db.session.rollback()
        app.logger.exception("Contact submission failed")
        return {
            "ok": False,
            "message": "An error occurred while submitting your message. Please try again.",
        }, 500


def build_cors_preflight_response():
    response = make_response("", 204)
    return apply_cors_headers(response)


def apply_cors_headers(response):
    allowed_origin = app.config["CONTACT_ALLOWED_ORIGIN"]
    origin = request.headers.get("Origin")

    if allowed_origin and origin == allowed_origin:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Vary"] = "Origin"
        response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"

    return response


@app.context_processor
def inject_shared_context():
    return {
        "featured_products": PRODUCTS,
        "contact_api_url": app.config["CONTACT_API_URL"],
    }


@app.route("/health")
def health():
    return "OK", 200


@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip()
        message = compose_contact_message(
            request.form.get("message", ""),
            business=request.form.get("business", ""),
            phone=request.form.get("phone", ""),
            project_type=request.form.get("project_type", ""),
        )

        if not name or not email:
            flash("Name and email are required.", "danger")
            return redirect(url_for("index") + "#contact")

        if not is_valid_email(email):
            flash("Please provide a valid email address.", "danger")
            return redirect(url_for("index") + "#contact")

        payload, status_code = contact_api_payload(name, email, message)
        flash(payload["message"], "success" if status_code < 400 else "danger")

        return redirect(url_for("index") + "#contact")

    return render_template("index.html")


@app.route("/api/contact", methods=["POST", "OPTIONS"])
def contact_api():
    if request.method == "OPTIONS":
        return build_cors_preflight_response()

    if request.is_json:
        payload = request.get_json(silent=True) or {}
        name = str(payload.get("name", "")).strip()
        email = str(payload.get("email", "")).strip()
        message = str(payload.get("message", "")).strip()
    else:
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip()
        message = compose_contact_message(
            request.form.get("message", ""),
            business=request.form.get("business", ""),
            phone=request.form.get("phone", ""),
            project_type=request.form.get("project_type", ""),
        )

    if not name or not email:
        response = jsonify({"ok": False, "message": "Name and email are required."})
        response.status_code = 400
        return apply_cors_headers(response)

    if not is_valid_email(email):
        response = jsonify({"ok": False, "message": "Please provide a valid email address."})
        response.status_code = 400
        return apply_cors_headers(response)

    payload, status_code = contact_api_payload(name, email, message)
    response = jsonify(payload)
    response.status_code = status_code
    return apply_cors_headers(response)


@app.route("/products/<slug>")
def product_detail(slug):
    product = PRODUCTS_BY_SLUG.get(slug)
    if product is None:
        return render_template("404.html"), 404

    related_products = [item for item in PRODUCTS if item["slug"] != slug][:3]
    return render_template(
        "product_detail.html",
        product=product,
        related_products=related_products,
    )


@app.errorhandler(404)
def page_not_found(_error):
    return render_template("404.html"), 404


def initialize_database():
    with app.app_context():
        db.create_all()


initialize_database()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
